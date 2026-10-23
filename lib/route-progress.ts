// Server-only helpers shared by the advisor and progress API routes.
import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from './prisma';
import { verifyToken } from './auth';
import { isStageId, type StageId } from './stages';
import type { GenomaData } from './advisor-prompts';
import { PLANS, planOf, monthStart, type PlanId } from './plans';

export interface RouteProgress {
  completed: StageId[];
  summaries: Partial<Record<StageId, string>>;
}

export function getUserId(request: NextRequest): string | null {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.userId ?? null;
}

/**
 * Route progress is stored in Profile.genoma (JSON) under the "route" key.
 * The GENOMA answers themselves live in the Genoma table.
 */
export async function loadProgress(userId: string): Promise<RouteProgress> {
  const profile = await db().profile.findUnique({ where: { userId } });
  const raw = profile?.genoma;
  const route =
    raw && typeof raw === 'object' && !Array.isArray(raw)
      ? (raw as Record<string, unknown>).route
      : null;

  if (!route || typeof route !== 'object' || Array.isArray(route)) {
    return { completed: [], summaries: {} };
  }
  const r = route as Record<string, unknown>;
  const completed = Array.isArray(r.completed)
    ? r.completed.filter((s): s is StageId => typeof s === 'string' && isStageId(s))
    : [];
  const summaries: Partial<Record<StageId, string>> = {};
  if (r.summaries && typeof r.summaries === 'object' && !Array.isArray(r.summaries)) {
    for (const [k, v] of Object.entries(r.summaries as Record<string, unknown>)) {
      if (isStageId(k) && typeof v === 'string') summaries[k] = v;
    }
  }
  return { completed, summaries };
}

export async function saveProgress(userId: string, progress: RouteProgress): Promise<void> {
  const profile = await db().profile.findUnique({ where: { userId } });
  const base =
    profile?.genoma && typeof profile.genoma === 'object' && !Array.isArray(profile.genoma)
      ? (profile.genoma as Record<string, unknown>)
      : {};
  // Keep other route fields (such as the advisor's memory) that live next to the progress.
  const previousRoute =
    base.route && typeof base.route === 'object' && !Array.isArray(base.route)
      ? (base.route as Record<string, unknown>)
      : {};
  const value = {
    ...base,
    route: {
      ...previousRoute,
      completed: progress.completed,
      summaries: progress.summaries,
      updatedAt: new Date().toISOString(),
    },
  } as unknown as Prisma.InputJsonValue;

  await db().profile.upsert({
    where: { userId },
    update: { genoma: value },
    create: { userId, genoma: value },
  });
}

export async function loadLatestGenoma(userId: string): Promise<GenomaData | null> {
  const latest = await db().genoma.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
  const data = latest?.data;
  return data && typeof data === 'object' && !Array.isArray(data) ? (data as GenomaData) : null;
}

export function sessionTitle(stage: string): string {
  return `ruta:${stage}`;
}

export interface Usage {
  plan: PlanId;
  used: number;
  limit: number;
  contentCalendar: boolean;
  weeklyReview: boolean;
}

/** Advisor messages the user sent this calendar month (route + free chat). */
export async function getUsage(userId: string): Promise<Usage> {
  const [user, used] = await Promise.all([
    db().user.findUnique({ where: { id: userId }, select: { plan: true } }),
    db().chatMessage.count({
      where: {
        role: 'user',
        createdAt: { gte: monthStart() },
        session: { userId, title: { startsWith: 'ruta:' } },
      },
    }),
  ]);
  const plan = planOf(user?.plan);
  const limits = PLANS[plan];
  return {
    plan,
    used,
    limit: limits.monthlyMessages,
    contentCalendar: limits.contentCalendar,
    weeklyReview: limits.weeklyReview,
  };
}
