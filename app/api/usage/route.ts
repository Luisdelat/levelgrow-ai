import { NextRequest, NextResponse } from 'next/server';
import { requireAccess } from '@/lib/subscription';
import { getUsage } from '@/lib/route-progress';

export const runtime = 'nodejs';

/** GET /api/usage → plan, advisor messages used this month and plan features. */
export async function GET(request: NextRequest) {
  const auth = await requireAccess(request);
  if (auth.error) return auth.error;
  const userId = auth.userId;
  try {
    return NextResponse.json(await getUsage(userId));
  } catch (error) {
    console.error('Usage GET error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
