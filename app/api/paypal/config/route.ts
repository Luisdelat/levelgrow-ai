import { NextResponse } from 'next/server';
import { manageUrl, paypalConfig } from '@/lib/paypal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET → public PayPal settings for the checkout button (the client ID is public by design). */
export async function GET() {
  const { clientId, live, configured } = paypalConfig();
  return NextResponse.json({
    configured,
    clientId: configured ? clientId : null,
    live,
    manageUrl: manageUrl(),
  });
}
