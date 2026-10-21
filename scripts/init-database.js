#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.production' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const url = new URL(DATABASE_URL);
const host = url.hostname;
const port = url.port || 5432;
const user = url.username;
const password = decodeURIComponent(url.password);
const database = url.pathname.substring(1);

async function initDatabase() {
  const postgres = require('postgres');
  
  const sql = postgres({
    host,
    port,
    user,
    password,
    database,
    ssl: 'require',
  });

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

  try {
    console.log('Initializing database tables...');
    
    for (const table of tables) {
      try {
        await sql.unsafe(table);
      } catch (error) {
        if (!error.message?.includes('already exists')) {
          console.warn('Warning:', error.message);
        }
      }
    }
    
    console.log('Database initialization complete');
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
