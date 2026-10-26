import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUserId } from '@/lib/route-progress';
import { getPlanId, paypalConfig } from '@/lib/paypal';
import { trialApplies } from '@/lib/plans';

export const runtime = 'nodejs';

/**
 * GET ?plan=basic|full → the PayPal plan ID to subscribe to (signed-in users only).
 * During the launch promotion, first-time Basic subscribers get the plan with a
 * free first month; the server decides, never the browser.
 */
export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!paypalConfig().configured) return NextResponse.json({ error: 'paypal_not_configured' }, { status: 503 });

  const plan = request.nextUrl.searchParams.get('plan');
  if (plan !== 'basic' && plan !== 'full') return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });

  try {
    const sub = await db().subscription.findUnique({ where: { userId }, select: { paypalSubscriptionId: true } });
    const trial = trialApplies(plan, Boolean(sub?.paypalSubscriptionId));
    return NextResponse.json({ planId: await getPlanId(plan, trial), trial });
  } catch (error) {
    console.error('PayPal plan error:', error);
    return NextResponse.json({ error: 'paypal_error' }, { status: 502 });
  }
}
