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

export async function restartStage(stage: StageId): Promise<void> {
  const res = await fetch('/api/progress/restart', {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage }),
  });
  if (!res.ok) throw new Error(`restart ${res.status}`);
}

export interface UsageResponse {
  plan: 'basic' | 'full';
  used: number;
  limit: number;
  contentCalendar: boolean;
  weeklyReview: boolean;
}

export async function fetchUsage(): Promise<UsageResponse> {
  const res = await fetch('/api/usage', { headers: authHeaders(), cache: 'no-store' });
  if (!res.ok) throw new Error(`usage ${res.status}`);
  return res.json();
}

const STREAM_ERROR = '[[ADVISOR_ERROR]]';

export type StreamResult =
  | { ok: true; text: string }
  | { ok: false; status: number; error: string };

/** POST that streams plain text back; onText receives the text so far. */
export async function streamPost(
  url: string,
  body: unknown,
  onText: (textSoFar: string) => void,
): Promise<StreamResult> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: 0, error: 'network' };
  }
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    return { ok: false, status: res.status, error: data.error ?? 'server_error' };
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onText(full.replace(STREAM_ERROR, '').trimEnd());
  }
  if (full.includes(STREAM_ERROR)) return { ok: false, status: 500, error: 'stream_error' };
  return { ok: true, text: full };
}
