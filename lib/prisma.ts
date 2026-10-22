import { PrismaClient } from '@prisma/client';

// One client per server instance, created on first use. Creating a new client
// on every request exhausts the connection pool on serverless platforms, and
// creating it at import time breaks the build step that loads route modules.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function db(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}
