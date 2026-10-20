import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
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
