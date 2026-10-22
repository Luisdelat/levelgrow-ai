'use client';

import { FormEvent, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppShell from '@/components/AppShell';
import FullPlanLock from '@/components/FullPlanLock';
import LogoMark from '@/components/LogoMark';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill, type AppText } from '@/lib/app-text';
import { authHeaders, fetchUsage, streamPost, type UsageResponse } from '@/lib/api-client';

const FIELDS: { key: string; label: keyof AppText }[] = [
  { key: 'posts', label: 'mPosts' },
  { key: 'conversations', label: 'mConversations' },
  { key: 'appointments', label: 'mAppointments' },
  { key: 'sales', label: 'mSales' },
  { key: 'revenue', label: 'mRevenue' },
  { key: 'adSpend', label: 'mAdSpend' },
];

interface Review {
  id: string;
  date: string;
  metrics: Record<string, number | string>;
  analysis: string;
}

const LOCALES: Record<string, string> = { es: 'es', en: 'en', ru: 'ru', tr: 'tr', az: 'az' };

function WeeklyReview() {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [streaming, setStreaming] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadReviews = () =>
    fetch('/api/weekly-review', { headers: authHeaders(), cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []));

  useEffect(() => {
    fetchUsage()
      .then((u) => {
        setUsage(u);
        return u.weeklyReview ? loadReviews() : undefined;
      })
      .catch(() => setError(T.advisorError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(LOCALES[language], { day: 'numeric', month: 'long', year: 'numeric' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const metrics: Record<string, number | string> = {};
    for (const f of FIELDS) {
      const v = values[f.key]?.trim();
      if (v) metrics[f.key] = Number(v);
    }
    if (notes.trim()) metrics.notes = notes.trim();
    if (Object.keys(metrics).length === 0) return;

    setError('');
    setStreaming('');
    const result = await streamPost('/api/weekly-review', { metrics, language }, (text) => setStreaming(text));
    if (result.ok) {
      setValues({});
      setNotes('');
      await loadReviews().catch(() => undefined);
    } else {
      setError(T.advisorError);
    }
    setStreaming(null);
  };

  if (!usage) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {error ? (
          <p className="text-slate-400">{error}</p>
        ) : (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        )}
      </div>
    );
  }

  if (!usage.weeklyReview) {
    return <FullPlanLock title={T.reviewTitle} description={T.reviewSub} />;
  }

  const busy = streaming !== null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rise-in">
        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/30">
          {T.fullBadge}
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{T.reviewTitle}</h1>
        <p className="mt-2 max-w-2xl text-slate-400">{T.reviewSub}</p>
      </header>

      <form onSubmit={submit} className="panel rise-in space-y-5 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">{T[f.label] as string}</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={values[f.key] ?? ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="field tabular-nums"
              />
            </label>
          ))}
        </div>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">{T.mNotes}</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={2000} className="field resize-y" />
        </label>
        <div className="flex justify-end">
          <button type="submit" disabled={busy} className="btn-accent">
            {busy && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {busy ? T.reviewAnalyzing : T.reviewSubmit}
          </button>
        </div>
      </form>

      {error && <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</p>}

      {busy && (
        <article className="panel p-6 sm:p-8">
          {streaming ? (
            <div className="advisor-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{streaming}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <LogoMark size={28} compact animated />
              {T.reviewAnalyzing}
            </div>
          )}
        </article>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">{T.reviewHistory}</h2>
        {reviews.length === 0 && !busy && <p className="text-sm text-slate-400">{T.reviewEmpty}</p>}
        {reviews.map((r) => (
          <details key={r.id} className="panel group p-5" open={r.id === reviews[0]?.id && !busy}>
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
              <span className="font-medium text-white">{fill(T.weekOf, { date: formatDate(r.date) })}</span>
              <span className="flex flex-wrap gap-2 text-xs text-slate-400">
                {FIELDS.filter((f) => r.metrics[f.key] !== undefined).map((f) => (
                  <span key={f.key} className="rounded-full border border-slate-700 px-2 py-0.5">
                    {T[f.label] as string}: <span className="tabular-nums text-slate-200">{String(r.metrics[f.key])}</span>
                  </span>
                ))}
              </span>
            </summary>
            <div className="advisor-md mt-4 border-t border-slate-800 pt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{r.analysis}</ReactMarkdown>
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <AppShell>
      <WeeklyReview />
    </AppShell>
  );
}
