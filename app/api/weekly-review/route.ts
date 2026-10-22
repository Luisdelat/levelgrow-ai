import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUsage, getUserId, loadLatestGenoma, loadProgress } from '@/lib/route-progress';
import { buildSystemPrompt, WEEKLY_REVIEW_BRIEF } from '@/lib/advisor-prompts';
import { streamClaude } from '@/lib/claude-stream';
import { FREE_CHAT_ID } from '@/lib/stages';
import { LANGUAGES, type Language } from '@/lib/translations';

export const runtime = 'nodejs';
export const maxDuration = 60;

const METRIC_KEYS = ['posts', 'conversations', 'appointments', 'sales', 'revenue', 'adSpend'] as const;
type MetricKey = (typeof METRIC_KEYS)[number];
type Metrics = Partial<Record<MetricKey, number>> & { notes?: string };

const METRIC_LABELS: Record<MetricKey, string> = {
  posts: 'Publicaciones',
  conversations: 'Conversaciones nuevas',
  appointments: 'Citas o llamadas',
  sales: 'Ventas cerradas',
  revenue: 'Ingresos de la semana ($)',
  adSpend: 'Inversión en anuncios ($)',
};

function parseMetrics(raw: unknown): Metrics {
  const out: Metrics = {};
  if (!raw || typeof raw !== 'object') return out;
  const r = raw as Record<string, unknown>;
  for (const key of METRIC_KEYS) {
    const n = typeof r[key] === 'number' ? r[key] : typeof r[key] === 'string' ? Number(r[key]) : NaN;
    if (Number.isFinite(n) && (n as number) >= 0) out[key] = Math.round((n as number) * 100) / 100;
  }
  if (typeof r.notes === 'string' && r.notes.trim()) out.notes = r.notes.trim().slice(0, 2000);
  return out;
}

function describe(m: Metrics): string {
  const lines = METRIC_KEYS.filter((k) => m[k] !== undefined).map((k) => `- ${METRIC_LABELS[k]}: ${m[k]}`);
  if (m.notes) lines.push(`- Notas: ${m.notes}`);
  return lines.join('\n') || '(sin datos)';
}

/** GET → the user's latest 12 weekly reviews, newest first. */
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const sessions: { id: string; createdAt: Date }[] = await db().chatSession.findMany({
      where: { userId, title: { startsWith: 'revision:' } },
      orderBy: { createdAt: 'desc' },
      take: 12,
    });
    const reviews = await Promise.all(
      sessions.map(async (s) => {
        const msgs: { role: string; content: string }[] = await db().chatMessage.findMany({
          where: { sessionId: s.id },
          orderBy: { createdAt: 'asc' },
        });
        const metricsMsg = msgs.find((m) => m.role === 'user');
        const analysis = msgs.find((m) => m.role === 'assistant');
        let metrics: Metrics = {};
        try {
          metrics = parseMetrics(JSON.parse(metricsMsg?.content ?? '{}'));
        } catch {
          // ignore malformed rows
        }
        return { id: s.id, date: s.createdAt, metrics, analysis: analysis?.content ?? null };
      }),
    );
    return NextResponse.json({ reviews: reviews.filter((r) => r.analysis) });
  } catch (error) {
    console.error('Review GET error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

/** POST { metrics, language } → streams the advisor's analysis (Full plan only). */
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const metrics = parseMetrics(body.metrics);
  const language: Language =
    typeof body.language === 'string' && (LANGUAGES as string[]).includes(body.language)
      ? (body.language as Language)
      : 'es';
  if (METRIC_KEYS.every((k) => metrics[k] === undefined) && !metrics.notes) {
    return NextResponse.json({ error: 'empty_metrics' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'advisor_unavailable' }, { status: 503 });
  }

  let sessionId: string;
  let system: string;
  let userContent: string;
  try {
    const usage = await getUsage(userId);
    if (!usage.weeklyReview) return NextResponse.json({ error: 'plan_required' }, { status: 403 });

    const [genoma, progress, previous] = await Promise.all([
      loadLatestGenoma(userId),
      loadProgress(userId),
      db().chatSession.findFirst({
        where: { userId, title: { startsWith: 'revision:' } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    let previousText = '';
    if (previous) {
      const prevMsg = await db().chatMessage.findFirst({
        where: { sessionId: previous.id, role: 'user' },
        orderBy: { createdAt: 'asc' },
      });
      try {
        previousText = describe(parseMetrics(JSON.parse(prevMsg?.content ?? '{}')));
      } catch {
        previousText = '';
      }
    }

    system = buildSystemPrompt({
      stage: FREE_CHAT_ID,
      language,
      genoma,
      completed: progress.completed,
      summaries: progress.summaries,
      brief: WEEKLY_REVIEW_BRIEF,
    });
    userContent = `MIS NÚMEROS DE ESTA SEMANA:\n${describe(metrics)}${
      previousText ? `\n\nSEMANA ANTERIOR:\n${previousText}` : '\n\n(Es mi primera revisión.)'
    }`;

    const session = await db().chatSession.create({
      data: { userId, title: `revision:${new Date().toISOString().slice(0, 10)}` },
    });
    sessionId = session.id;
    await db().chatMessage.create({
      data: { sessionId, role: 'user', content: JSON.stringify(metrics) },
    });
  } catch (error) {
    console.error('Review POST setup error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  return streamClaude({
    system,
    messages: [{ role: 'user', content: userContent }],
    maxTokens: 1500,
    onComplete: async (full) => {
      await db().chatMessage.create({ data: { sessionId, role: 'assistant', content: full } });
    },
  });
}
