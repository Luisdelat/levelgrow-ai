import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUserId } from '@/lib/route-progress';
import { getAccess } from '@/lib/subscription';

export const runtime = 'nodejs';

/** GET → the signed-in user, their plan and whether their subscription gives access. */
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const user = await db().user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, plan: true },
    });
    if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const { access, status, subscription } = await getAccess(userId);
    return NextResponse.json({
      user,
      access,
      subscription: {
        status,
        currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
        hasPayPal: Boolean(subscription?.paypalSubscriptionId),
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
