// Server-only: who may use the app, based on their subscription.
//
// Subscription.status values:
//   pending        – registered, has not paid yet (no access)
//   active         – paying through PayPal
//   cancelled      – cancelled in PayPal; keeps access until currentPeriodEnd
//   suspended      – PayPal could not charge (no access)
//   expired        – ended (no access)
//   complimentary  – free access granted by the owner
import { NextRequest, NextResponse } from 'next/server';
import { db } from './prisma';
import { getUserId } from './route-progress';
import { getSubscription, paypalConfig } from './paypal';

const RESYNC_AFTER_MS = 12 * 60 * 60 * 1000;

interface SubscriptionRow {
  id: string;
  status: string;
  paypalSubscriptionId: string | null;
  currentPeriodEnd: Date | null;
  cancelledAt: Date | null;
  updatedAt: Date;
}

export function hasAccess(sub: Pick<SubscriptionRow, 'status' | 'currentPeriodEnd'> | null): boolean {
  if (!sub) return false;
  if (sub.status === 'active' || sub.status === 'complimentary') return true;
  if (sub.status === 'cancelled' && sub.currentPeriodEnd) return sub.currentPeriodEnd.getTime() > Date.now();
  return false;
}

/** Re-reads a PayPal subscription at most every 12 hours to catch cancellations and failed payments. */
async function resync(sub: SubscriptionRow): Promise<SubscriptionRow> {
  if (!sub.paypalSubscriptionId) return sub;
  if (sub.status !== 'active' && sub.status !== 'cancelled') return sub;
  if (Date.now() - sub.updatedAt.getTime() < RESYNC_AFTER_MS) return sub;
  if (!paypalConfig().configured) return sub;

  try {
    const remote = await getSubscription(sub.paypalSubscriptionId);
    const next = remote.billing_info?.next_billing_time;
    const data: { status: string; currentPeriodEnd?: Date; cancelledAt?: Date } = { status: sub.status };
    switch (remote.status) {
      case 'ACTIVE':
      case 'APPROVED':
        data.status = 'active';
        if (next) data.currentPeriodEnd = new Date(next);
        break;
      case 'CANCELLED':
        data.status = 'cancelled';
        if (!sub.cancelledAt) data.cancelledAt = new Date();
        break;
      case 'SUSPENDED':
        data.status = 'suspended';
        break;
      case 'EXPIRED':
        data.status = 'expired';
        break;
      default:
        break;
    }
    const updated: SubscriptionRow = await db().subscription.update({ where: { id: sub.id }, data });
    return updated;
  } catch (error) {
    // PayPal unavailable: keep the current state and try again next time.
    console.error('PayPal resync failed:', error);
    return sub;
  }
}

export async function getAccess(userId: string) {
  const sub: SubscriptionRow | null = await db().subscription.findUnique({ where: { userId } });
  const fresh = sub ? await resync(sub) : null;
  return { access: hasAccess(fresh), status: fresh?.status ?? 'pending', subscription: fresh };
}

/**
 * For API routes that require a paid (or complimentary) subscription.
 * Returns the user id, or a ready error response.
 */
export async function requireAccess(
  request: NextRequest,
): Promise<{ userId: string; error?: undefined } | { userId?: undefined; error: NextResponse }> {
  const userId = getUserId(request);
  if (!userId) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  try {
    const { access } = await getAccess(userId);
    if (!access) return { error: NextResponse.json({ error: 'payment_required' }, { status: 402 }) };
  } catch (error) {
    console.error('Access check failed:', error);
    return { error: NextResponse.json({ error: 'server_error' }, { status: 500 }) };
  }
  return { userId };
}
