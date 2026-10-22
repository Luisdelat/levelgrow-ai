import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUserId, getUsage, loadProgress, loadLatestGenoma, sessionTitle } from '@/lib/route-progress';
import { buildSystemPrompt, kickoffMessage } from '@/lib/advisor-prompts';
import { streamClaude } from '@/lib/claude-stream';
import { FREE_CHAT_ID, isStageId, type StageId } from '@/lib/stages';
import { LANGUAGES, type Language } from '@/lib/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const HISTORY_LIMIT = 40;
const MAX_INPUT_CHARS = 4000;

type ChannelId = StageId | typeof FREE_CHAT_ID;
interface StoredMessage {
  id: string;
  role: string;
  content: string;
}

function parseChannel(value: unknown): ChannelId | null {
  if (typeof value !== 'string') return null;
  if (value === FREE_CHAT_ID) return FREE_CHAT_ID;
  return isStageId(value) && value !== 'genoma' ? value : null;
}

function parseLanguage(value: unknown): Language {
  return typeof value === 'string' && (LANGUAGES as string[]).includes(value) ? (value as Language) : 'es';
}

async function findSession(userId: string, channel: ChannelId) {
  return db().chatSession.findFirst({
    where: { userId, title: sessionTitle(channel) },
    orderBy: { createdAt: 'asc' },
  });
}

async function loadMessages(sessionId: string): Promise<StoredMessage[]> {
  const rows = await db().chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_LIMIT,
  });
  return rows.reverse();
}

/** GET /api/advisor?stage=cliente → saved conversation for that stage. */
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const channel = parseChannel(request.nextUrl.searchParams.get('stage'));
  if (!channel) return NextResponse.json({ error: 'invalid_stage' }, { status: 400 });

  try {
    const session = await findSession(userId, channel);
    if (!session) return NextResponse.json({ messages: [] });
    const messages = await loadMessages(session.id);
    return NextResponse.json({
      messages: messages.map((m: StoredMessage) => ({ id: m.id, role: m.role, content: m.content })),
    });
  } catch (error) {
    console.error('Advisor GET error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

/**
 * POST /api/advisor  { stage, message?, kickoff?, language }
 * Streams the advisor's reply as plain text and saves both turns.
 */
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const channel = parseChannel(body.stage);
  if (!channel) return NextResponse.json({ error: 'invalid_stage' }, { status: 400 });
  const language = parseLanguage(body.language);
  const kickoff = body.kickoff === true;
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_INPUT_CHARS) : '';
  if (!kickoff && !message) return NextResponse.json({ error: 'empty_message' }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set');
    return NextResponse.json({ error: 'advisor_unavailable' }, { status: 503 });
  }

  let session: { id: string };
  let history: { role: string; content: string }[];
  let systemPrompt: string;
  try {
    session = (await findSession(userId, channel)) ??
      (await db().chatSession.create({ data: { userId, title: sessionTitle(channel) } }));
    history = await loadMessages(session.id);

    // A kickoff only makes sense on an empty conversation.
    if (kickoff && history.length > 0) {
      return NextResponse.json({ error: 'already_started' }, { status: 409 });
    }

    const [genoma, progress] = await Promise.all([loadLatestGenoma(userId), loadProgress(userId)]);
    systemPrompt = buildSystemPrompt({
      stage: channel,
      language,
      genoma,
      completed: progress.completed,
      summaries: progress.summaries,
    });

    // On a retry the same user turn is already saved; don't store it twice.
    const lastSaved = history[history.length - 1];
    const isRetry = lastSaved?.role === 'user' && lastSaved.content === message;
    if (isRetry) history = history.slice(0, -1);
    if (!kickoff && !isRetry) {
      const usage = await getUsage(userId);
      if (usage.used >= usage.limit) {
        return NextResponse.json(
          { error: 'limit_reached', plan: usage.plan, used: usage.used, limit: usage.limit },
          { status: 402 },
        );
      }
      await db().chatMessage.create({ data: { sessionId: session.id, role: 'user', content: message } });
    }
  } catch (error) {
    console.error('Advisor POST setup error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  // Build the conversation for the model. It must start with a user turn and
  // alternate roles, so the hidden kickoff instruction always comes first.
  const turns: { role: 'user' | 'assistant'; content: string }[] = [
    { role: 'user', content: kickoffMessage(channel) },
  ];
  for (const m of history) {
    const role = m.role === 'assistant' ? 'assistant' : 'user';
    const last = turns[turns.length - 1];
    if (last.role === role) last.content += `\n\n${m.content}`;
    else turns.push({ role, content: m.content });
  }
  if (!kickoff) {
    const last = turns[turns.length - 1];
    if (last.role === 'user') last.content += `\n\n${message}`;
    else turns.push({ role: 'user', content: message });
  }

  const sessionId = session.id;
  return streamClaude({
    system: systemPrompt,
    messages: turns,
    maxTokens: 2000,
    onComplete: async (full) => {
      await db().chatMessage.create({ data: { sessionId, role: 'assistant', content: full } });
      await db().chatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
    },
  });
}
