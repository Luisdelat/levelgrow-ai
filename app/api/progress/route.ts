import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/prisma';
import {
  getUserId,
  loadProgress,
  saveProgress,
  loadLatestGenoma,
  sessionTitle,
} from '@/lib/route-progress';
import { buildSystemPrompt, summaryInstruction } from '@/lib/advisor-prompts';
import { ADVISOR_MODEL } from '@/lib/claude-stream';
import { isStageId, STAGE_IDS } from '@/lib/stages';
import { LANGUAGES, type Language } from '@/lib/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;


/** GET /api/progress → route progress + latest GENOMA answers. */
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const [progress, genoma] = await Promise.all([loadProgress(userId), loadLatestGenoma(userId)]);
    // Users who saved a GENOMA before the route existed still count as done.
    if (genoma && !progress.completed.includes('genoma')) progress.completed.unshift('genoma');
    return NextResponse.json({ ...progress, genoma });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

/**
 * POST /api/progress { stage, language }
 * Marks a stage as completed. For advisor stages, the advisor writes the
 * final deliverable from the conversation and it is saved to the user's plan.
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

  const stage = typeof body.stage === 'string' && isStageId(body.stage) ? body.stage : null;
  if (!stage) return NextResponse.json({ error: 'invalid_stage' }, { status: 400 });
  const language: Language =
    typeof body.language === 'string' && (LANGUAGES as string[]).includes(body.language)
      ? (body.language as Language)
      : 'es';

  try {
    const progress = await loadProgress(userId);

    if (stage !== 'genoma') {
      const session = await db().chatSession.findFirst({
        where: { userId, title: sessionTitle(stage) },
        orderBy: { createdAt: 'asc' },
      });
      const rows: { role: string; content: string }[] = session
        ? await db().chatMessage.findMany({
            where: { sessionId: session.id },
            orderBy: { createdAt: 'asc' },
          })
        : [];
      if (!rows.some((m) => m.role === 'user')) {
        return NextResponse.json({ error: 'no_conversation' }, { status: 400 });
      }
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: 'advisor_unavailable' }, { status: 503 });
      }

      const genoma = await loadLatestGenoma(userId);
      const transcript = rows
        .slice(-40)
        .map((m) => `${m.role === 'assistant' ? 'ASESOR' : 'USUARIO'}: ${m.content}`)
        .join('\n\n');

      const client = new Anthropic();
      const response = await client.messages.create({
        model: ADVISOR_MODEL,
        max_tokens: 1500,
        system: buildSystemPrompt({
          stage,
          language,
          genoma,
          completed: progress.completed,
          summaries: progress.summaries,
        }),
        messages: [
          {
            role: 'user',
            content: `CONVERSACIÓN DE LA ETAPA:\n\n${transcript}\n\n---\n${summaryInstruction(language)}`,
          },
        ],
      });
      const summary = response.content
        .map((block) => (block.type === 'text' ? block.text : ''))
        .join('')
        .trim();
      if (summary) progress.summaries[stage] = summary;
    }

    if (!progress.completed.includes(stage)) progress.completed.push(stage);
    progress.completed.sort((a, b) => STAGE_IDS.indexOf(a) - STAGE_IDS.indexOf(b));
    await saveProgress(userId, progress);

    return NextResponse.json({ ...progress });
  } catch (error) {
    console.error('Progress POST error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
