import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { Anthropic } from '@anthropic-ai/sdk';

export const runtime = 'nodejs';

const client = new Anthropic();

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

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    // Get user's GENOMA for context
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true, genoma: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const genomaContext = user.genoma?.[0]?.data
      ? `\n\nGenoma del usuario:\n${JSON.stringify(user.genoma[0].data, null, 2)}`
      : '';

    const systemPrompt = `Eres un Asistente de Marketing experto basado en la metodología HAZTUAGENCIA. 
Tu rol es ayudar al usuario con estrategias de marketing, ventas, y crecimiento de su negocio.

Responde siempre:
- En español (México)
- De manera concisa y directa
- Con acciones prácticas que pueden implementar
- Considerando su GENOMA de negocio${genomaContext}

Enfócate en: marketing digital, redes sociales, embudos de ventas, copywriting, automatización, y crecimiento.`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return NextResponse.json({
      content: content.text,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Error al procesar el mensaje' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
