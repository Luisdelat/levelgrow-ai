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
