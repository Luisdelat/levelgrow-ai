// Server-only: the "Ficha del negocio", a running fact sheet of everything the
// user has told the advisor in any stage or in the free chat. It is injected
// into every advisor prompt so the advisor never asks for the same data twice.
//
// Stored in Profile.genoma (JSON) under route.memory, next to the route progress,
// so no database migration is needed.
import Anthropic from '@anthropic-ai/sdk';
import type { Prisma } from '@prisma/client';
import { db } from './prisma';
import { ADVISOR_MODEL } from './claude-stream';

const MAX_MEMORY_CHARS = 7000;
const MAX_TURN_CHARS = 1500;

interface Turn {
  role: string;
  content: string;
}

function routeOf(genoma: unknown): Record<string, unknown> {
  if (!genoma || typeof genoma !== 'object' || Array.isArray(genoma)) return {};
  const route = (genoma as Record<string, unknown>).route;
  return route && typeof route === 'object' && !Array.isArray(route) ? (route as Record<string, unknown>) : {};
}

export async function loadMemory(userId: string): Promise<string> {
  const profile = await db().profile.findUnique({ where: { userId } });
  const memory = routeOf(profile?.genoma).memory;
  return typeof memory === 'string' ? memory : '';
}

async function saveMemory(userId: string, memory: string): Promise<void> {
  // Re-read right before writing so route progress saved meanwhile is kept.
  const profile = await db().profile.findUnique({ where: { userId } });
  const base =
    profile?.genoma && typeof profile.genoma === 'object' && !Array.isArray(profile.genoma)
      ? (profile.genoma as Record<string, unknown>)
      : {};
  const value = {
    ...base,
    route: { ...routeOf(base), memory, memoryUpdatedAt: new Date().toISOString() },
  } as unknown as Prisma.InputJsonValue;
  await db().profile.upsert({
    where: { userId },
    update: { genoma: value },
    create: { userId, genoma: value },
  });
}

const MEMORY_SYSTEM = `Mantienes la FICHA DEL NEGOCIO de un usuario de LEVELGROW AI (un asesor de marketing con IA).
La ficha es la memoria del asesor: todo dato concreto que el usuario ya dio, para no volver a preguntárselo nunca.

Recibes la ficha actual y un fragmento reciente de conversación entre el ASESOR y el USUARIO. Devuelve la ficha actualizada.

Reglas:
- Guarda solo hechos que el USUARIO dijo o confirmó. Si aceptó o ajustó un borrador del asesor ("sí", "me gusta", "así está bien"), guarda la versión aceptada.
- Datos concretos y textuales cuando importen: nombres, ciudad, precios, números, metas, herramientas (p. ej. GHL, ManyChat), links, palabra clave, preguntas de su formulario, nombre con el que firma, tono que prefiere, horarios, presupuesto, lo que NO quiere.
- Conserva todo lo de la ficha actual. Si el usuario cambió un dato, reemplázalo por el nuevo.
- No guardes consejos, ideas ni borradores que el usuario no aceptó. No inventes nada.
- Formato Markdown, en español, con estos subtítulos (omite los que estén vacíos): ### Negocio · ### Cliente ideal · ### Promesa y oferta · ### Contenido y redes · ### Captación y herramientas · ### Anuncios · ### Ventas · ### Preferencias del usuario · ### Pendientes acordados
- Viñetas cortas. Máximo 500 palabras en total.
- Responde SOLO con la ficha, sin saludo ni explicación. Si no hay nada nuevo, devuelve la ficha actual sin cambios.`;

/**
 * Updates the fact sheet with what the user said in `turns`.
 * Never throws: memory is helpful but must not break the advisor.
 */
export async function refreshMemory(userId: string, stageTitle: string, turns: Turn[]): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) return;
  const userTurns = turns.filter((t) => t.role === 'user' && t.content.trim());
  if (userTurns.length === 0) return;

  try {
    const current = await loadMemory(userId);
    const transcript = turns
      .map((t) => {
        const who = t.role === 'assistant' ? 'ASESOR' : 'USUARIO';
        const text = t.content.length > MAX_TURN_CHARS ? `${t.content.slice(0, MAX_TURN_CHARS)}…` : t.content;
        return `${who}: ${text}`;
      })
      .join('\n\n');

    const client = new Anthropic();
    const response = await client.messages.create({
      model: ADVISOR_MODEL,
      max_tokens: 1500,
      system: MEMORY_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `FICHA ACTUAL:\n${current || '(vacía)'}\n\nCONVERSACIÓN RECIENTE (${stageTitle}):\n${transcript}`,
        },
      ],
    });
    const next = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim();
    if (!next || next === current) return;
    await saveMemory(userId, next.slice(0, MAX_MEMORY_CHARS));
  } catch (error) {
    console.error('Memory refresh failed:', error);
  }
}
