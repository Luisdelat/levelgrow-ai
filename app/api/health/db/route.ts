import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export const runtime = 'nodejs';

/** Public health check: says only whether the database answers, never why not. */
export async function GET() {
  try {
    await db().$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Health check: database unavailable', error);
    return NextResponse.json({ status: 'error' }, { status: 503 });
  }
}
