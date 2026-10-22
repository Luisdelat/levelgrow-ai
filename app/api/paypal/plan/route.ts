import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/lib/route-progress';
import { getPlanId, paypalConfig } from '@/lib/paypal';

export const runtime = 'nodejs';

/** GET ?plan=basic|full → the PayPal plan ID to subscribe to (signed-in users only). */
export async function GET(request: NextRequest) {
  if (!getUserId(request)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!paypalConfig().configured) return NextResponse.json({ error: 'paypal_not_configured' }, { status: 503 });

  const plan = request.nextUrl.searchParams.get('plan');
  if (plan !== 'basic' && plan !== 'full') return NextResponse.json({ error: 'invalid_plan' }, { status: 400 });

  try {
    return NextResponse.json({ planId: await getPlanId(plan) });
  } catch (error) {
    console.error('PayPal plan error:', error);
    return NextResponse.json({ error: 'paypal_error' }, { status: 502 });
  }
}
