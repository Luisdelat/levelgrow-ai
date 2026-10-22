import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const genomas = await prisma.genoma.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ genomas });
  } catch (error) {
    console.error('Get genomas error:', error);
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { data, status } = await request.json();

    const genoma = await prisma.genoma.create({
      data: {
        userId: decoded.userId,
        data: data || {},
        status: status || 'draft',
      },
    });

    return NextResponse.json({ genoma }, { status: 201 });
  } catch (error) {
    console.error('Create genoma error:', error);
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
