import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateToken, hashPassword, normalizeEmail, verifyPassword } from '@/lib/auth';
import { clientIp, hit, reset } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const WINDOW_MS = 15 * 60 * 1000;
let dummyHash: Promise<string> | null = null;

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const email = normalizeEmail(body.email);
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password || password.length > 128) {
    return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
  }

  // Slow down password guessing: per address and per network.
  const ip = clientIp(request);
  const wait = Math.max(hit(`login:${email}`, 10, WINDOW_MS), hit(`login-ip:${ip}`, 40, WINDOW_MS));
  if (wait) {
    return NextResponse.json({ error: 'too_many_attempts' }, { status: 429, headers: { 'Retry-After': String(wait) } });
  }

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    // Same answer (and similar timing) whether or not the account exists.
    const ok = user
      ? await verifyPassword(password, user.passwordHash)
      : (await verifyPassword(password, await (dummyHash ??= hashPassword('no-such-account'))), false);

    if (!user || !ok) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 });
    }

    reset(`login:${email}`);
    const token = generateToken(user.id, user.email);
    return NextResponse.json({ token, user: { id: user.id, email: user.email, plan: user.plan } }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
