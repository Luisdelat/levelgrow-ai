import { NextRequest, NextResponse } from 'next/server';
import { getUsage, getUserId } from '@/lib/route-progress';

export const runtime = 'nodejs';

/** GET /api/usage → plan, advisor messages used this month and plan features. */
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    return NextResponse.json(await getUsage(userId));
  } catch (error) {
    console.error('Usage GET error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
