import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { getUserId } from '@/lib/route-progress';
import { extractDataFromSummary, updateDataMemory } from '@/lib/data-extractor';
import type { StageId } from '@/lib/stages';

/**
 * POST /api/advisor/complete-stage
 * Called when a user completes a stage. Extracts data from the summary
 * and updates UserDataMemory so future conversations remember the info.
 */
export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const { stage, summary } = await request.json();

    if (!stage || !summary || typeof summary !== 'string') {
      return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
    }

    // Extract key data from the summary
    const extracted = await extractDataFromSummary(summary, stage as StageId);

    // Update memory with extracted data
    await updateDataMemory(userId, stage as StageId, extracted);

    return NextResponse.json({
      success: true,
      extracted,
    });
  } catch (error) {
    console.error('Error completing stage:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
