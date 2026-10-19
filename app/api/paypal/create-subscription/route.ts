import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PAYPAL_API_URL = 'https://api.sandbox.paypal.com'; // Change to live for production
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');

  const response = await axios.post(
    `${PAYPAL_API_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

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

    const { plan } = await request.json();

    // Verify plan
    if (!['basic', 'full'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Plan details
    const planDetails = {
      basic: {
        planId: 'P-LEVELGROW-BASIC',
        name: 'Plan Básico',
        price: '49.00',
      },
      full: {
        planId: 'P-LEVELGROW-FULL',
        name: 'Plan Full',
        price: '99.00',
      },
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails];

    // Get access token
    const accessToken = await getPayPalAccessToken();

    // Create subscription
    const subscriptionResponse = await axios.post(
      `${PAYPAL_API_URL}/v1/billing/subscriptions`,
      {
        plan_id: selectedPlan.planId,
        subscriber: {
          email_address: user.email,
        },
        application_context: {
          brand_name: 'LEVELGROW AI',
          locale: 'es-MX',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const subscriptionId = subscriptionResponse.data.id;
    const approvalLink = subscriptionResponse.data.links.find(
      (link: any) => link.rel === 'approve'
    )?.href;

    // Save subscription info
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        paypalSubscriptionId: subscriptionId,
        paypalPlanId: selectedPlan.planId,
        status: 'pending',
      },
    });

    return NextResponse.json(
      {
        subscriptionId,
        approvalLink,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('PayPal error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
