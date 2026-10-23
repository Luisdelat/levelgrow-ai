import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { requireAccess } from '@/lib/subscription';
import { sessionTitle } from '@/lib/route-progress';
import { isStageId } from '@/lib/stages';

export const runtime = 'nodejs';

/**
 * POST /api/progress/restart { stage }
 * Starts a stage conversation from scratch. The old conversation is archived,
 * not deleted: its title changes, so the advisor opens a new one. Archived
 * titles keep the "ruta:" prefix so their messages still count toward the
 * monthly limit and still feed the user's fact sheet. The stage deliverable
 * stays until the user completes or updates the stage again.
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
  const stage = typeof body.stage === 'string' && isStageId(body.stage) && body.stage !== 'genoma' ? body.stage : null;
  if (!stage) return NextResponse.json({ error: 'invalid_stage' }, { status: 400 });

  try {
    const archivedTitle = `${sessionTitle('archivo')}:${stage}:${new Date().toISOString()}`;
    await db().chatSession.updateMany({
      where: { userId, title: sessionTitle(stage) },
      data: { title: archivedTitle },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Restart stage error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
