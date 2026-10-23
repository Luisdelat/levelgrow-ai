// Extract structured data from stage summaries and save to UserDataMemory
// This allows the advisor to remember what the user has already provided

import { db } from './prisma';

interface ExtractedData {
  clienteIdeal?: string;
  dolores?: string[];
  deseos?: string[];
  oferta?: string;
  promesa?: string;
  canalPrincipal?: string;
  canalesSecundarios?: string[];
  embudo?: string;
  palabraClave?: string;
  tipoAds?: string;
  presupuestoAds?: string;
  metodoCierre?: string;
  objeciones?: string[];
  frecuenciaPublicacion?: string;
}

/**
 * Extract key data from a stage summary using AI analysis.
 * This is called when a stage is completed to update UserDataMemory.
 */
export async function extractDataFromSummary(
  summary: string,
  stage: string,
): Promise<Partial<ExtractedData>> {
  // For now, return a structured extraction based on the stage
  // In a real implementation, this could call Claude to parse the summary
  // But for performance, we'll use pattern matching for common formats

  const data: Partial<ExtractedData> = {};

  // Helper to extract quoted strings
  const extractQuotes = (text: string, limit = Infinity): string[] => {
    const matches = text.match(/"([^"]+)"/g) || [];
    return matches.map((m) => m.slice(1, -1)).slice(0, limit);
  };

  // Helper to extract bullet points
  const extractBullets = (text: string): string[] => {
    const lines = text.split('\n');
    return lines
      .filter((line) => line.trim().startsWith('- ') || line.trim().startsWith('• '))
      .map((line) => line.replace(/^[-•]\s*/, '').trim())
      .filter((line) => line.length > 0);
  };

  if (stage === 'cliente') {
    // Extract: "[cliente] en [ubicación] que [problema]"
    const clientMatch = summary.match(/\*\*([^*]+)\*\*.*?([A-Z][^.!?]*)/);
    if (clientMatch) data.clienteIdeal = clientMatch[1];

    // Extract dolores (usually in a list)
    const doloresSection = summary.match(/dolor[es]?\s*[:|]?\s*([\s\S]*?)(?=deseo|$)/i);
    if (doloresSection) {
      data.dolores = extractBullets(doloresSection[1]);
      if (data.dolores.length === 0) {
        data.dolores = extractQuotes(doloresSection[1], 5);
      }
    }

    // Extract deseos
    const deseosSection = summary.match(/deseo[s]?\s*[:|]?\s*([\s\S]*?)(?=objeción|ubicación|$)/i);
    if (deseosSection) {
      data.deseos = extractBullets(deseosSection[1]);
      if (data.deseos.length === 0) {
        data.deseos = extractQuotes(deseosSection[1], 5);
      }
    }
  } else if (stage === 'oferta') {
    // Extract promesa (usually first bold text)
    const promiseMatch = summary.match(/promesa[^*]*\*\*([^*]+)\*\*/i);
    if (promiseMatch) data.promesa = promiseMatch[1];

    // Extract oferta description
    const ofertaMatch = summary.match(/oferta[^-]*?\n([\s\S]*?)(?=garantía|bonos|$)/i);
    if (ofertaMatch) data.oferta = ofertaMatch[1].trim().slice(0, 200);
  } else if (stage === 'contenido') {
    // Extract canal principal
    const canalMatch = summary.match(/red[^:]*:\s*\*\*?([^\n*]+)/i);
    if (canalMatch) data.canalPrincipal = canalMatch[1].trim();

    // Extract frecuencia
    const freqMatch = summary.match(/publicación[^:]*:\s*([^\n]+)/i);
    if (freqMatch) data.frecuenciaPublicacion = freqMatch[1].trim();
  } else if (stage === 'captacion') {
    // Extract embudo
    const embudoMatch = summary.match(/embudo[^:]*:\s*([\s\S]*?)(?=mensajes?|palabra|$)/i);
    if (embudoMatch) data.embudo = embudoMatch[1].trim().slice(0, 300);

    // Extract palabra clave
    const palabraMatch = summary.match(/palabra\s*(?:clave|código)[^:]*:\s*\*?([^\n*]+)/i);
    if (palabraMatch) data.palabraClave = palabraMatch[1].trim();

    // Extract canales
    const canalesMatch = summary.match(/canal[es]*[^:]*:\s*([^\n]+)/i);
    if (canalesMatch) {
      const canales = canalesMatch[1].split(/,|y|o/).map((c) => c.trim());
      data.canalesSecundarios = canales.filter((c) => c.length > 0);
    }
  } else if (stage === 'anuncios') {
    // Extract tipo de ads
    const tipoMatch = summary.match(/tipo\s*(?:de\s*)?campaña[^:]*:\s*([^\n]+)/i);
    if (tipoMatch) data.tipoAds = tipoMatch[1].trim();

    // Extract presupuesto
    const presupMatch = summary.match(/presupuesto[^:]*:\s*\$?([^\n]+)/i);
    if (presupMatch) data.presupuestoAds = presupMatch[1].trim();
  } else if (stage === 'ventas') {
    // Extract método de cierre
    const metodoMatch = summary.match(/guion[^:]*:\s*([\s\S]*?)(?=respuesta|objeción|$)/i);
    if (metodoMatch) data.metodoCierre = metodoMatch[1].trim().slice(0, 300);

    // Extract objeciones
    const objeccionesSection = summary.match(/objeción[es]?\s*[:|]?\s*([\s\S]*?)(?=seguimiento|$)/i);
    if (objeccionesSection) {
      data.objeciones = extractBullets(objeccionesSection[1]);
      if (data.objeciones.length === 0) {
        data.objeciones = extractQuotes(objeccionesSection[1], 5);
      }
    }
  }

  return data;
}

/**
 * Update or create UserDataMemory with extracted data from a completed stage.
 */
export async function updateDataMemory(
  userId: string,
  stage: string,
  newData: Partial<ExtractedData>,
): Promise<void> {
  try {
    // Get existing memory or create new one
    let memory = await db().userDataMemory.findUnique({ where: { userId } });

    const updateData = {
      ...newData,
      ultimaEtapaActualizada: stage,
    };

    if (memory) {
      // Merge with existing data (new data overwrites)
      await db().userDataMemory.update({
        where: { userId },
        data: {
          clienteIdeal: newData.clienteIdeal ?? memory.clienteIdeal,
          dolores: newData.dolores ?? memory.dolores,
          deseos: newData.deseos ?? memory.deseos,
          oferta: newData.oferta ?? memory.oferta,
          promesa: newData.promesa ?? memory.promesa,
          canalPrincipal: newData.canalPrincipal ?? memory.canalPrincipal,
          canalesSecundarios: newData.canalesSecundarios ?? memory.canalesSecundarios,
          embudo: newData.embudo ?? memory.embudo,
          palabraClave: newData.palabraClave ?? memory.palabraClave,
          tipoAds: newData.tipoAds ?? memory.tipoAds,
          presupuestoAds: newData.presupuestoAds ?? memory.presupuestoAds,
          metodoCierre: newData.metodoCierre ?? memory.metodoCierre,
          objeciones: newData.objeciones ?? memory.objeciones,
          frecuenciaPublicacion: newData.frecuenciaPublicacion ?? memory.frecuenciaPublicacion,
          ultimaEtapaActualizada: stage,
        },
      });
    } else {
      // Create new memory
      await db().userDataMemory.create({
        data: {
          userId,
          ...updateData,
        },
      });
    }
  } catch (error) {
    console.error('Error updating UserDataMemory:', error);
    // Don't throw - this is non-critical
  }
}

/**
 * Get the user's data memory for injection into the advisor prompt.
 */
export async function getDataMemory(userId: string): Promise<ExtractedData | null> {
  try {
    return await db().userDataMemory.findUnique({ where: { userId } });
  } catch {
    return null;
  }
}

/**
 * Format data memory as a readable section for the advisor prompt.
 */
export function formatDataMemory(data: ExtractedData | null): string {
  if (!data || Object.values(data).every((v) => !v || (Array.isArray(v) && v.length === 0))) {
    return '';
  }

  const lines: string[] = [];

  if (data.clienteIdeal) lines.push(`- Cliente ideal: ${data.clienteIdeal}`);
  if (data.dolores?.length) lines.push(`- Dolores: ${data.dolores.join(', ')}`);
  if (data.deseos?.length) lines.push(`- Deseos: ${data.deseos.join(', ')}`);
  if (data.promesa) lines.push(`- Promesa: ${data.promesa}`);
  if (data.oferta) lines.push(`- Oferta: ${data.oferta.slice(0, 100)}...`);
  if (data.canalPrincipal) lines.push(`- Canal principal: ${data.canalPrincipal}`);
  if (data.canalesSecundarios?.length) lines.push(`- Otros canales: ${data.canalesSecundarios.join(', ')}`);
  if (data.embudo) lines.push(`- Embudo: ${data.embudo.slice(0, 100)}...`);
  if (data.palabraClave) lines.push(`- Palabra clave: ${data.palabraClave}`);
  if (data.tipoAds) lines.push(`- Tipo de ads: ${data.tipoAds}`);
  if (data.presupuestoAds) lines.push(`- Presupuesto ads: ${data.presupuestoAds}`);
  if (data.metodoCierre) lines.push(`- Método de cierre: ${data.metodoCierre.slice(0, 100)}...`);
  if (data.objeciones?.length) lines.push(`- Objeciones comunes: ${data.objeciones.join(', ')}`);
  if (data.frecuenciaPublicacion) lines.push(`- Frecuencia de publicación: ${data.frecuenciaPublicacion}`);

  if (lines.length === 0) return '';

  return `\nLO QUE YA CONOCEMOS DE TI (para no repetir):\n${lines.join('\n')}`;
}
