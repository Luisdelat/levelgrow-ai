// Server-only PayPal Subscriptions client.
//
// Environment variables (set in Vercel):
//   PAYPAL_CLIENT_ID   – REST app client ID (falls back to NEXT_PUBLIC_PAYPAL_CLIENT_ID)
//   PAYPAL_SECRET      – REST app secret
//   PAYPAL_ENV         – "live" for real payments; anything else uses the sandbox
//
// The PayPal product and the two monthly plans are created automatically the
// first time they are needed, so no plan IDs have to be configured by hand.
import { LAUNCH_PROMO, PLANS, type PlanId } from './plans';

const PRODUCT_NAME = 'LEVELGROW AI';

export function paypalConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const secret = process.env.PAYPAL_SECRET || '';
  const live = process.env.PAYPAL_ENV === 'live';
  return {
    clientId,
    secret,
    live,
    apiBase: live ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com',
    // A real REST client ID is a long string; anything short is a placeholder.
    configured: clientId.length > 40 && secret.length > 40,
  };
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const { clientId, secret, apiBase } = paypalConfig();
  const res = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function paypal<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const { apiBase } = paypalConfig();
  const res = await fetch(`${apiBase}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: 'no-store',
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) throw new Error(`PayPal ${init.method ?? 'GET'} ${path} failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

/** Plan names include the price, so changing a price creates a new plan. */
function planName(plan: PlanId, trial: boolean): string {
  const base = `${PRODUCT_NAME} ${plan === 'full' ? 'Full' : 'Basic'} - ${PLANS[plan].price} USD/month`;
  return trial ? `${base} - first ${LAUNCH_PROMO.freeMonths} month free` : base;
}

type PlanKey = `${PlanId}` | `${PlanId}-trial`;
let planIdCache: Partial<Record<PlanKey, string>> = {};

async function findOrCreateProduct(): Promise<string> {
  const list = await paypal<{ products?: { id: string; name: string }[] }>(
    '/v1/catalogs/products?page_size=20&total_required=true',
  );
  const existing = list.products?.find((p) => p.name === PRODUCT_NAME);
  if (existing) return existing.id;
  const created = await paypal<{ id: string }>('/v1/catalogs/products', {
    method: 'POST',
    body: {
      name: PRODUCT_NAME,
      description: 'AI marketing advisor for business owners',
      type: 'SERVICE',
      category: 'SOFTWARE',
    },
  });
  return created.id;
}

/**
 * PayPal plan ID for one of our plans, creating product and plan if needed.
 * With `trial`, the plan starts with free month(s); PayPal keeps the buyer's
 * payment method and charges the regular price automatically afterwards.
 */
export async function getPlanId(plan: PlanId, trial = false): Promise<string> {
  const key: PlanKey = trial ? `${plan}-trial` : plan;
  const cached = planIdCache[key];
  if (cached) return cached;

  const productId = await findOrCreateProduct();
  const list = await paypal<{ plans?: { id: string; name: string; status: string }[] }>(
    `/v1/billing/plans?product_id=${productId}&page_size=20`,
  );
  const name = planName(plan, trial);
  let id = list.plans?.find((p) => p.name === name && p.status === 'ACTIVE')?.id;

  if (!id) {
    const created = await paypal<{ id: string }>('/v1/billing/plans', {
      method: 'POST',
      body: {
        product_id: productId,
        name,
        status: 'ACTIVE',
        billing_cycles: [
          // A trial cycle without a price is free.
          ...(trial
            ? [
                {
                  frequency: { interval_unit: 'MONTH', interval_count: 1 },
                  tenure_type: 'TRIAL',
                  sequence: 1,
                  total_cycles: LAUNCH_PROMO.freeMonths,
                },
              ]
            : []),
          {
            frequency: { interval_unit: 'MONTH', interval_count: 1 },
            tenure_type: 'REGULAR',
            sequence: trial ? 2 : 1,
            total_cycles: 0,
            pricing_scheme: { fixed_price: { value: String(PLANS[plan].price), currency_code: 'USD' } },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: 'CANCEL',
          payment_failure_threshold: 2,
        },
      },
    });
    id = created.id;
  }

  planIdCache = { ...planIdCache, [key]: id };
  return id;
}

/** Which of our plans a PayPal plan ID belongs to, if any. */
export async function planForPayPalPlanId(paypalPlanId: string): Promise<PlanId | null> {
  for (const plan of ['basic', 'full'] as PlanId[]) {
    if ((await getPlanId(plan)) === paypalPlanId) return plan;
  }
  // Launch-promo plan (also after the promotion ends, for people already on it).
  if ((await getPlanId(LAUNCH_PROMO.plan, true)) === paypalPlanId) return LAUNCH_PROMO.plan;
  return null;
}

export interface PayPalSubscription {
  id: string;
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  plan_id: string;
  custom_id?: string;
  start_time?: string;
  billing_info?: { next_billing_time?: string; last_payment?: { time?: string } };
}

export function getSubscription(id: string): Promise<PayPalSubscription> {
  return paypal<PayPalSubscription>(`/v1/billing/subscriptions/${encodeURIComponent(id)}`);
}

export async function cancelSubscription(id: string, reason: string): Promise<void> {
  await paypal<void>(`/v1/billing/subscriptions/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    body: { reason },
  });
}

/** Where buyers manage or cancel their automatic payments. */
export function manageUrl(): string {
  return paypalConfig().live
    ? 'https://www.paypal.com/myaccount/autopay/'
    : 'https://www.sandbox.paypal.com/myaccount/autopay/';
}
