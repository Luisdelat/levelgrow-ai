'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import DownloadPdfButton from '@/components/DownloadPdfButton';
import remarkGfm from 'remark-gfm';
import AppShell from '@/components/AppShell';
import FullPlanLock from '@/components/FullPlanLock';
import LogoMark from '@/components/LogoMark';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill } from '@/lib/app-text';
import { authHeaders, fetchUsage, streamPost, type UsageResponse } from '@/lib/api-client';

interface CalendarState {
  used: number;
  limit: number;
  content: string | null;
}

function ContentCalendar() {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [calendar, setCalendar] = useState<CalendarState | null>(null);
  const [streaming, setStreaming] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Promise.all([
      fetchUsage(),
      fetch('/api/content-calendar', { headers: authHeaders(), cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([u, c]) => {
        setUsage(u);
        setCalendar({ used: c.used ?? 0, limit: c.limit ?? 0, content: c.content ?? null });
      })
      .catch(() => setError(T.advisorError));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generate = async () => {
    setError('');
    setStreaming('');
    const result = await streamPost('/api/content-calendar', { language }, (text) => setStreaming(text));
    if (result.ok) {
      setCalendar((prev) => ({
        used: (prev?.used ?? 0) + 1,
        limit: prev?.limit ?? 0,
        content: result.text,
      }));
    } else if (result.error === 'no_genoma') {
      setError(T.needGenomaSub);
    } else {
      setError(T.advisorError);
    }
    setStreaming(null);
  };

  const copy = async () => {
    if (!calendar?.content) return;
    try {
      await navigator.clipboard.writeText(calendar.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  };

  if (!usage || !calendar) {
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

  if (!usage.contentCalendar) {
    return <FullPlanLock title={T.contentTitle} description={T.contentSub} />;
  }

  const left = Math.max(calendar.limit - calendar.used, 0);
  const busy = streaming !== null;
  const shown = busy ? streaming : calendar.content;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rise-in flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/30">
            {T.fullBadge}
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{T.contentTitle}</h1>
          <p className="mt-2 max-w-2xl text-slate-400">{T.contentSub}</p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <button onClick={generate} disabled={busy || left === 0} className="btn-accent">
            {busy ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            {calendar.content ? T.contentRegenerate : T.contentGenerate}
          </button>
          <span className="text-xs text-slate-500">
            {left > 0 ? fill(T.contentRemaining, { n: left }) : fill(T.contentNoneLeft, { n: calendar.limit })}
          </span>
        </div>
      </header>

      {error && <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</p>}

      {busy && !streaming && (
        <div className="panel flex items-center gap-3 p-6 text-sm text-slate-400">
          <LogoMark size={28} compact animated />
          {T.contentGenerating}
        </div>
      )}

      {shown ? (
        <article className="panel rise-in p-6 sm:p-8">
          {!busy && (
            <div className="mb-2 flex flex-wrap items-start justify-end gap-2">
              <DownloadPdfButton title={T.pdfCalendarTitle} sections={[{ markdown: calendar.content ?? '' }]} />
              <button
                onClick={copy}
                className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-600 hover:text-white"
              >
                {copied ? T.copied : T.copy}
              </button>
            </div>
          )}
          <div className="advisor-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{shown}</ReactMarkdown>
          </div>
        </article>
      ) : (
        !busy && (
          <div className="panel p-6 text-sm text-slate-400">
            {T.contentTip}{' '}
            <Link href="/dashboard/ruta" className="text-blue-400 hover:text-blue-300">
              {T.navRoute} →
            </Link>
          </div>
        )
      )}
    </div>
  );
}

export default function ContentPage() {
  return (
    <AppShell>
      <ContentCalendar />
    </AppShell>
  );
}
