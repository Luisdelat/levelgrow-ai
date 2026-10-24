import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, normalizeEmail, EMAIL_RE } from '@/lib/auth';
import { clientIp, hit } from '@/lib/rate-limit';
import { LEGAL_VERSION } from '@/lib/legal';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';

let dbInitialized = false;

async function ensureDatabaseTables(prisma: PrismaClient) {
  if (dbInitialized) return;

  try {
    // Try a simple query
    await prisma.$executeRawUnsafe('SELECT 1');

    // Check if User table exists
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'User'
      )
    `;

    const tableExists = (result as any[])?.[0]?.exists === true;

    if (!tableExists) {
      console.log('Creating database tables...');

      const tables = [
        'CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL PRIMARY KEY, "email" TEXT NOT NULL UNIQUE, "passwordHash" TEXT NOT NULL, "plan" TEXT NOT NULL DEFAULT \'basic\', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW())',
        'CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email")',
        'CREATE TABLE IF NOT EXISTS "Profile" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL UNIQUE, "genoma" JSONB, "businessName" TEXT, "businessType" TEXT, "businessStage" TEXT, "targetAudience" TEXT, "mainProblem" TEXT, "mainObjective" TEXT, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE)',
        'CREATE TABLE IF NOT EXISTS "Subscription" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL UNIQUE, "plan" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT \'active\', "paypalSubscriptionId" TEXT UNIQUE, "paypalPlanId" TEXT, "currentPeriodStart" TIMESTAMP, "currentPeriodEnd" TIMESTAMP, "cancelledAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE)',
        'CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId")',
        'CREATE INDEX IF NOT EXISTS "Subscription_paypalSubscriptionId_idx" ON "Subscription"("paypalSubscriptionId")',
        'CREATE TABLE IF NOT EXISTS "ChatSession" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "title" TEXT NOT NULL DEFAULT \'New Chat\', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE)',
        'CREATE INDEX IF NOT EXISTS "ChatSession_userId_idx" ON "ChatSession"("userId")',
        'CREATE TABLE IF NOT EXISTS "ChatMessage" ("id" TEXT NOT NULL PRIMARY KEY, "sessionId" TEXT NOT NULL, "role" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE)',
        'CREATE TABLE IF NOT EXISTS "Genoma" ("id" TEXT NOT NULL PRIMARY KEY, "userId" TEXT NOT NULL, "data" JSONB NOT NULL, "status" TEXT NOT NULL DEFAULT \'draft\', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE)',
        'CREATE INDEX IF NOT EXISTS "Genoma_userId_idx" ON "Genoma"("userId")'
      ];

      for (const sql of tables) {
        try {
          await prisma.$executeRawUnsafe(sql);
        } catch (error: any) {
          if (!error.message?.includes('already exists')) {
            console.warn('Table creation warning:', error.message);
          }
        }
      }
    }

    dbInitialized = true;
  } catch (error) {
    console.error('Database table check failed:', error);
  }
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const wait = hit(`register:${ip}`, 8, 60 * 60 * 1000);
  if (wait) {
    return NextResponse.json({ error: 'too_many_attempts' }, { status: 429, headers: { 'Retry-After': String(wait) } });
  }

  const prisma = new PrismaClient();
  try {
    // Ensure database tables exist
    await ensureDatabaseTables(prisma);

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const email = normalizeEmail(body.email);
    const password = typeof body.password === 'string' ? body.password : '';
    // The real plan is decided by the PayPal subscription; this is only a preference.
    const plan = body.plan === 'full' ? 'full' : 'basic';

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'weak_password' }, { status: 400 });
    }
    if (body.acceptTerms !== true) {
      return NextResponse.json({ error: 'terms_required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'email_taken' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        plan,
        termsAcceptedAt: new Date(),
        termsVersion: LEGAL_VERSION,
        profile: { create: {} },
        subscription: {
          create: {
            plan,
            status: 'pending', // Will be activated after payment
          },
        },
      },
    });

    const token = generateToken(user.id, user.email);

    return NextResponse.json(
      { token, user: { id: user.id, email: user.email, plan: user.plan } },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
