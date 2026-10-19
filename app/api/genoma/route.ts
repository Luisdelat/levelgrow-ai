import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const genoma = await request.json();

    // Update or create genoma
    let savedGenoma = await prisma.genoma.findFirst({
      where: { userId: decoded.userId },
    });

    if (savedGenoma) {
      savedGenoma = await prisma.genoma.update({
        where: { id: savedGenoma.id },
        data: {
          data: genoma,
          status: 'completed',
        },
      });
    } else {
      savedGenoma = await prisma.genoma.create({
        data: {
          userId: decoded.userId,
          data: genoma,
          status: 'completed',
        },
      });
    }

    // Also update profile
    await prisma.profile.update({
      where: { userId: decoded.userId },
      data: {
        genoma,
        businessName: genoma.businessName,
        businessType: genoma.businessType,
        targetAudience: genoma.targetAudience,
      },
    });

    return NextResponse.json(savedGenoma, { status: 200 });
  } catch (error) {
    console.error('GENOMA save error:', error);
    return NextResponse.json(
      { error: 'Failed to save GENOMA' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const genoma = await prisma.genoma.findFirst({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!genoma) {
      return NextResponse.json(
        { error: 'GENOMA not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(genoma, { status: 200 });
  } catch (error) {
    console.error('GENOMA fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GENOMA' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
