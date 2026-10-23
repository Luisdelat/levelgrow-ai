import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUserId } from '@/lib/route-progress';
import { cancelSubscription, getSubscription, paypalConfig, planForPayPalPlanId } from '@/lib/paypal';

export const runtime = 'nodejs';

/**
 * POST { subscriptionId } → called after the buyer approves in PayPal.
 * Never trusts the browser: the subscription is read back from PayPal and must
 * be active, belong to this user (custom_id) and be one of our plans.
 */
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!paypalConfig().configured) return NextResponse.json({ error: 'paypal_not_configured' }, { status: 503 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const subscriptionId = typeof body.subscriptionId === 'string' ? body.subscriptionId.trim() : '';
  if (!/^I-[A-Z0-9]{6,}$/.test(subscriptionId)) {
    return NextResponse.json({ error: 'invalid_subscription' }, { status: 400 });
  }

  try {
    const remote = await getSubscription(subscriptionId);
    if (remote.custom_id !== userId) {
      return NextResponse.json({ error: 'subscription_mismatch' }, { status: 403 });
    }
    if (remote.status !== 'ACTIVE' && remote.status !== 'APPROVED') {
      return NextResponse.json({ error: 'subscription_not_active', status: remote.status }, { status: 409 });
    }
    const plan = await planForPayPalPlanId(remote.plan_id);
    if (!plan) return NextResponse.json({ error: 'unknown_plan' }, { status: 400 });

    const previous = await db().subscription.findUnique({ where: { userId } });
    const next = remote.billing_info?.next_billing_time;
    const data = {
      plan,
      status: 'active',
      paypalSubscriptionId: subscriptionId,
      paypalPlanId: remote.plan_id,
      currentPeriodStart: remote.start_time ? new Date(remote.start_time) : new Date(),
      currentPeriodEnd: next ? new Date(next) : null,
      cancelledAt: null,
    };
    await db().subscription.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    await db().user.update({ where: { id: userId }, data: { plan } });

    // Changing plan: stop billing the old PayPal subscription.
    const replaced = Boolean(
      previous?.paypalSubscriptionId &&
        previous.paypalSubscriptionId !== subscriptionId &&
        previous.status === 'active',
    );
    if (replaced && previous?.paypalSubscriptionId) {
      try {
        await cancelSubscription(previous.paypalSubscriptionId, 'Changed to another LEVELGROW AI plan');
      } catch (error) {
        console.error('Could not cancel previous subscription:', previous.paypalSubscriptionId, error);
      }
    }

    return NextResponse.json({ ok: true, plan, replaced });
  } catch (error) {
    console.error('PayPal activate error:', error);
    return NextResponse.json({ error: 'paypal_error' }, { status: 502 });
  }
}
