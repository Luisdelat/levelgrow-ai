// Best-effort in-memory rate limiting for auth endpoints.
// Vercel reuses warm instances, so this stops scripted guessing from one
// source without adding a dependency. Limits are per key per window.
import type { NextRequest } from 'next/server';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/** Returns seconds to wait if the key is over its limit, otherwise 0 (and counts the hit). */
export function hit(key: string, limit: number, windowMs: number): number {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return 0;
  }
  b.count += 1;
  return b.count > limit ? Math.ceil((b.resetAt - now) / 1000) : 0;
}

export function reset(key: string): void {
  buckets.delete(key);
}
