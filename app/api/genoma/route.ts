import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { db } from '@/lib/prisma';
import { requireAccess } from '@/lib/subscription';

export const runtime = 'nodejs';

const FIELDS = [
  'businessName',
  'businessType',
  'location',
  'services',
  'targetAudience',
  'mainProblem',
  'differentiation',
  'currentChannels',
  'salesProcess',
  'mainObjective',
  'marketingBudget',
] as const;

/** GET → the user's saved GENOMA versions, newest first. */
export async function GET(request: NextRequest) {
  const auth = await requireAccess(request);
  if (auth.error) return auth.error;
  try {
    const genomas = await db().genoma.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return NextResponse.json({ genomas });
  } catch (error) {
    console.error('Get genomas error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

/** POST { data, status } → saves a new GENOMA version (only known text fields). */
export async function POST(request: NextRequest) {
  const auth = await requireAccess(request);
  if (auth.error) return auth.error;
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const raw = body.data && typeof body.data === 'object' ? (body.data as Record<string, unknown>) : {};
    const data: Record<string, string> = {};
    for (const key of FIELDS) {
      if (typeof raw[key] === 'string') data[key] = (raw[key] as string).slice(0, 2000);
    }
    const genoma = await db().genoma.create({
      data: {
        userId: auth.userId,
        data: data as Prisma.InputJsonValue,
        status: body.status === 'completed' ? 'completed' : 'draft',
      },
    });
    return NextResponse.json({ genoma }, { status: 201 });
  } catch (error) {
    console.error('Create genoma error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
