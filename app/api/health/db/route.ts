import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  console.log('Health check - checking database connection...');
  console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Simple connection test
    const result = await prisma.$queryRaw`SELECT NOW() as timestamp`;
    console.log('✓ Database connection successful');
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      result
    });
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : 'Unknown'
        }
      },
      { status: 503 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
