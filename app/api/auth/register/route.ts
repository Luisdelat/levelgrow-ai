import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
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
  const prisma = new PrismaClient();
  try {
    // Ensure database tables exist
    await ensureDatabaseTables(prisma);
    
    const { email, password, plan } = await request.json();

    // Validate input
    if (!email || !password || !plan) {
      return NextResponse.json(
        { error: 'Email, password, and plan are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        plan,
        profile: {
          create: {},
        },
        subscription: {
          create: {
            plan,
            status: 'pending', // Will be activated after payment
          },
        },
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          plan: user.plan,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
