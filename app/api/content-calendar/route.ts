import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAccess } from '@/lib/subscription';
import { getUsage, loadLatestGenoma, loadProgress } from '@/lib/route-progress';
import { buildSystemPrompt, CONTENT_CALENDAR_BRIEF } from '@/lib/advisor-prompts';
import { streamClaude } from '@/lib/claude-stream';
import { FREE_CHAT_ID } from '@/lib/stages';
import { PLANS, monthKey } from '@/lib/plans';
import { LANGUAGES, type Language } from '@/lib/translations';
import { loadMemory } from '@/lib/business-memory';

export const runtime = 'nodejs';
// The 30-post calendar is a long reply.
export const maxDuration = 300;

const GENERATIONS_LIMIT = PLANS.full.calendarGenerations;

function calendarTitle() {
  return `contenido:${monthKey()}`;
}

async function loadCalendar(userId: string) {
  const session = await db().chatSession.findFirst({
    where: { userId, title: calendarTitle() },
    orderBy: { createdAt: 'asc' },
  });
  if (!session) return { sessionId: null as string | null, used: 0, content: null as string | null };
  const versions: { content: string }[] = await db().chatMessage.findMany({
    where: { sessionId: session.id, role: 'assistant' },
    orderBy: { createdAt: 'desc' },
  });
  return { sessionId: session.id, used: versions.length, content: versions[0]?.content ?? null };
}

/** GET → this month's latest calendar and how many generations are left. */
export async function GET(request: NextRequest) {
  const auth = await requireAccess(request);
  if (auth.error) return auth.error;
  const userId = auth.userId;
  try {
    const { used, content } = await loadCalendar(userId);
    return NextResponse.json({ month: monthKey(), used, limit: GENERATIONS_LIMIT, content });
  } catch (error) {
    console.error('Calendar GET error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

/** POST { language } → streams a new 30-post calendar (Full plan only). */
export async function POST(request: NextRequest) {
  const auth = await requireAccess(request);
  if (auth.error) return auth.error;
  const userId = auth.userId;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const language: Language =
    typeof body.language === 'string' && (LANGUAGES as string[]).includes(body.language)
      ? (body.language as Language)
      : 'es';

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'advisor_unavailable' }, { status: 503 });
  }

  let sessionId: string;
  let system: string;
  try {
    const usage = await getUsage(userId);
    if (!usage.contentCalendar) return NextResponse.json({ error: 'plan_required' }, { status: 403 });

    const calendar = await loadCalendar(userId);
    if (calendar.used >= GENERATIONS_LIMIT) {
      return NextResponse.json({ error: 'generation_limit' }, { status: 429 });
    }

    const [genoma, progress, memory] = await Promise.all([
      loadLatestGenoma(userId),
      loadProgress(userId),
      loadMemory(userId),
    ]);
    if (!genoma) return NextResponse.json({ error: 'no_genoma' }, { status: 400 });

    system = buildSystemPrompt({
      stage: FREE_CHAT_ID,
      language,
      genoma,
      completed: progress.completed,
      summaries: progress.summaries,
      brief: CONTENT_CALENDAR_BRIEF,
      memory,
    });
    sessionId =
      calendar.sessionId ??
      (await db().chatSession.create({ data: { userId, title: calendarTitle() } })).id;
  } catch (error) {
    console.error('Calendar POST setup error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return streamClaude({
    system,
    messages: [{ role: 'user', content: 'Crea mi calendario de contenido de este mes.' }],
    // The model's own thinking counts toward max_tokens, so limits leave plenty of room.
    maxTokens: 16000,
    onComplete: async (full) => {
      await db().chatMessage.create({ data: { sessionId, role: 'assistant', content: full } });
    },
  });
}
