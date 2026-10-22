'use client';

import type { StageId } from './stages';

export interface ProgressResponse {
  completed: StageId[];
  summaries: Partial<Record<StageId, string>>;
  genoma: Record<string, string> | null;
}

export function authHeaders(): Record<string, string> {
  let token = '';
  try {
    token = localStorage.getItem('token') ?? '';
  } catch {
    // ignore
  }
  return { Authorization: `Bearer ${token}` };
}

export async function fetchProgress(): Promise<ProgressResponse> {
  const res = await fetch('/api/progress', { headers: authHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error(`progress ${res.status}`);
  return res.json();
}

export async function completeStage(stage: StageId, language: string): Promise<ProgressResponse> {
  const res = await fetch('/api/progress', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage, language }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `complete ${res.status}`);
  }
  return res.json();
}
