import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/prisma';
import { requireAccess } from '@/lib/subscription';
import {
  loadProgress,
  saveProgress,
  loadLatestGenoma,
  sessionTitle,
} from '@/lib/route-progress';
import { buildSystemPrompt, summaryInstruction } from '@/lib/advisor-prompts';
import { ADVISOR_MODEL } from '@/lib/claude-stream';
import { isStageId, STAGE_IDS, STAGE_TEXT } from '@/lib/stages';
import { loadMemory, refreshMemory } from '@/lib/business-memory';
import { planOf } from '@/lib/plans';
import { LANGUAGES, type Language } from '@/lib/translations';

export const runtime = 'nodejs';
// Writing the Contenido deliverable (10 full scripts) takes about a minute or more.
export const maxDuration = 300;


/** GET /api/progress → route progress + latest GENOMA answers. */
export async function GET(request: NextRequest) {
  const auth = await requireAccess(request);
  if (auth.error) return auth.error;
  const userId = auth.userId;

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
  const auth = await requireAccess(request);
  if (auth.error) return auth.error;
  const userId = auth.userId;

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

      const [genoma, memory, user] = await Promise.all([
        loadLatestGenoma(userId),
        loadMemory(userId),
        db().user.findUnique({ where: { id: userId }, select: { plan: true } }),
      ]);
      const plan = planOf(user?.plan);
      const transcript = rows
        .slice(-40)
        .map((m) => `${m.role === 'assistant' ? 'ASESOR' : 'USUARIO'}: ${m.content}`)
        .join('\n\n');

      const client = new Anthropic();
      // The deliverable and the fact sheet are written at the same time.
      const [response] = await Promise.all([
        client.messages.create({
          model: ADVISOR_MODEL,
          // The model's own thinking counts toward max_tokens, so limits leave plenty of room.
          max_tokens: stage === 'contenido' ? 20000 : 6000,
          system: buildSystemPrompt({
            stage,
            language,
            genoma,
            completed: progress.completed,
            summaries: progress.summaries,
            memory,
            plan,
          }),
          messages: [
            {
              role: 'user',
              content: `CONVERSACIÓN DE LA ETAPA:\n\n${transcript}\n\n---\n${summaryInstruction(language, stage, plan)}`,
            },
          ],
        }),
        refreshMemory(userId, STAGE_TEXT.es[stage].title, rows.slice(-16)),
      ]);
      if (response.stop_reason !== 'end_turn') {
        // A cut-off deliverable must be visible in the logs.
        console.error(`Deliverable for ${stage} stopped early: ${response.stop_reason}`);
      }
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
