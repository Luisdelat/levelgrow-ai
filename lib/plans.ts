/**
 * What each subscription plan includes. This is the single source of truth:
 * the API enforces these limits and the landing page lists these features.
 */
export type PlanId = 'basic' | 'full';

export interface PlanLimits {
  price: number;
  /** Messages the user can send to the advisor per calendar month. */
  monthlyMessages: number;
  /** Monthly 30-post content calendar. */
  contentCalendar: boolean;
  /** Content calendar generations allowed per month. */
  calendarGenerations: number;
  /** Weekly results review with the advisor. */
  weeklyReview: boolean;
}

export const PLANS: Record<PlanId, PlanLimits> = {
  basic: {
    price: 49,
    monthlyMessages: 200,
    contentCalendar: false,
    calendarGenerations: 0,
    weeklyReview: false,
  },
  full: {
    price: 99,
    monthlyMessages: 1000,
    contentCalendar: true,
    calendarGenerations: 3,
    weeklyReview: true,
  },
};

export function planOf(value: unknown): PlanId {
  return value === 'full' ? 'full' : 'basic';
}

/** First instant of the current calendar month (UTC). */
export function monthStart(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/** "2026-10" for the current month (UTC). */
export function monthKey(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

/**
 * Launch promotion: new subscribers to the Basic plan get their first month
 * free. PayPal stores their payment method at sign-up and charges the regular
 * price automatically when the free month ends. Only people who have never had
 * a PayPal subscription with us qualify. The Full plan is never discounted.
 */
export const LAUNCH_PROMO = {
  plan: 'basic' as PlanId,
  freeMonths: 1,
  /** Last day new subscribers can start the free month (end of day, Miami time). */
  endsAt: '2026-12-27T05:00:00Z',
};

export function launchPromoActive(now = new Date()): boolean {
  return now.getTime() < new Date(LAUNCH_PROMO.endsAt).getTime();
}

/** Whether this signup gets the free month for this plan. */
export function trialApplies(plan: PlanId, hadPayPalSubscription: boolean, now = new Date()): boolean {
  return plan === LAUNCH_PROMO.plan && launchPromoActive(now) && !hadPayPalSubscription;
}
