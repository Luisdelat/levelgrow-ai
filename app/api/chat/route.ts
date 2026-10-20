import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Eres un asistente de marketing experto basado en la metodología HAZTUAGENCIA (HTA).

TU ROL PRINCIPAL:
- Ayudar al usuario a ejecutar su estrategia de marketing basada en su GENOMA
- Proporcionar acciones concretas y diarias para crecer su negocio
- Ser su coach de marketing personalizado

METODOLOGÍA:
Usa siempre la metodología HTA que incluye:
1. GENOMA: Análisis profundo del negocio
2. EMBUDOS: Estrategias de conversión
3. ANUNCIOS: Campañas con Meta Ads
4. VENTAS: Cierre de clientes
5. AUTOMATIZACIÓN: Sistemas que escalan

TONO Y ESTILO:
- Responde SIEMPRE en español
- Sé directo, accionable y motivador
- Proporciona pasos concretos que pueda hacer HOY
- Basa cada recomendación en su GENOMA específico

CUANDO RESPONDA:
1. Considera el GENOMA del usuario (sus objetivos, público, problemas)
2. Proporciona tácticas específicas de HTA
3. Dale pequeñas acciones que pueda completar en 1-2 horas
4. Sé su mentor de marketing, no solo un chatbot`;

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  const client = new Anthropic();
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

    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user and chat session
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: { messages: true },
      });
    } else {
      session = await prisma.chatSession.create({
        data: {
          userId: user.id,
          title: message.substring(0, 50) + '...',
        },
        include: { messages: true },
      });
    }

    if (!session || session.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message,
      },
    });

    // Build conversation history for Claude
    const conversationHistory = session.messages.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Add the new user message
    conversationHistory.push({
      role: 'user',
      content: message,
    });

    // Add context from user's profile if available
    let contextPrompt = SYSTEM_PROMPT;
    if (user.profile?.genoma) {
      contextPrompt += `\n\nGENOMA del usuario:\n${JSON.stringify(user.profile.genoma, null, 2)}`;
    }

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-opus-4-1',
      max_tokens: 1024,
      system: contextPrompt,
      messages: conversationHistory,
    });

    const assistantMessage = response.content[0].type === 'text' ? response.content[0].text : '';

    // Save assistant response
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: assistantMessage,
      },
    });

    return NextResponse.json(
      {
        sessionId: session.id,
        response: assistantMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
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

    const sessionId = request.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
      // Get all sessions for user
      const sessions = await prisma.chatSession.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(sessions);
    }

    // Get specific session with messages
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: true },
    });

    if (!session || session.userId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Get chat error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
