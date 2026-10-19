-- SQLite Schema for LEVELGROW AI

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'basic',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "genoma" JSON,
    "businessName" TEXT,
    "businessType" TEXT,
    "businessStage" TEXT,
    "targetAudience" TEXT,
    "mainProblem" TEXT,
    "mainObjective" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "paypalSubscriptionId" TEXT UNIQUE,
    "paypalPlanId" TEXT,
    "currentPeriodStart" DATETIME,
    "currentPeriodEnd" DATETIME,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ChatSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sessionId") REFERENCES "ChatSession"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Genoma" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "data" JSON NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
CREATE INDEX IF NOT EXISTS "Profile_userId_idx" ON "Profile"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_paypalSubscriptionId_idx" ON "Subscription"("paypalSubscriptionId");
CREATE INDEX IF NOT EXISTS "ChatSession_userId_idx" ON "ChatSession"("userId");
CREATE INDEX IF NOT EXISTS "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");
CREATE INDEX IF NOT EXISTS "Genoma_userId_idx" ON "Genoma"("userId");
