import { NextRequest, NextResponse } from 'next/server';

const { Client } = require('pg');

export async function POST(request: NextRequest) {
  // Security: verify admin token
  const adminToken = request.headers.get('x-admin-token');
  const expectedToken = process.env.ADMIN_INIT_TOKEN || 'init-levelgrow-2024';

  if (adminToken !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Starting database initialization...');
    await client.connect();

    // Create Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        "plan" TEXT NOT NULL DEFAULT 'basic',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✓ User table created');

    // Create index
    await client.query(`CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email")`);
    console.log('✓ User email index created');

    // Create Profile table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Profile" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL UNIQUE,
        "genoma" JSONB,
        "businessName" TEXT,
        "businessType" TEXT,
        "businessStage" TEXT,
        "targetAudience" TEXT,
        "mainProblem" TEXT,
        "mainObjective" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);
    console.log('✓ Profile table created');

    // Create Subscription table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Subscription" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL UNIQUE,
        "plan" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'active',
        "paypalSubscriptionId" TEXT UNIQUE,
        "paypalPlanId" TEXT,
        "currentPeriodStart" TIMESTAMP,
        "currentPeriodEnd" TIMESTAMP,
        "cancelledAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);
    console.log('✓ Subscription table created');

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId")`);
    await client.query(`CREATE INDEX IF NOT EXISTS "Subscription_paypalSubscriptionId_idx" ON "Subscription"("paypalSubscriptionId")`);
    console.log('✓ Subscription indexes created');

    // Create ChatSession table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ChatSession" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL DEFAULT 'New Chat',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);
    console.log('✓ ChatSession table created');

    // Create index
    await client.query(`CREATE INDEX IF NOT EXISTS "ChatSession_userId_idx" ON "ChatSession"("userId")`);
    console.log('✓ ChatSession index created');

    // Create ChatMessage table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "ChatMessage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "sessionId" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE
      )
    `);
    console.log('✓ ChatMessage table created');

    // Create Genoma table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Genoma" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "data" JSONB NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'draft',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
      )
    `);
    console.log('✓ Genoma table created');

    // Create index
    await client.query(`CREATE INDEX IF NOT EXISTS "Genoma_userId_idx" ON "Genoma"("userId")`);
    console.log('✓ Genoma index created');

    return NextResponse.json(
      {
        success: true,
        message: 'Database initialized successfully',
        tables: [
          'User',
          'Profile',
          'Subscription',
          'ChatSession',
          'ChatMessage',
          'Genoma'
        ]
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
