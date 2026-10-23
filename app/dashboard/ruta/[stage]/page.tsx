'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppShell from '@/components/AppShell';
import AdvisorChat from '@/components/AdvisorChat';
import DownloadPdfButton from '@/components/DownloadPdfButton';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill } from '@/lib/app-text';
import { STAGE_IDS, STAGE_TEXT, isStageId, nextStage, stageHref, type StageId } from '@/lib/stages';
import { completeStage, fetchProgress, restartStage, type ProgressResponse } from '@/lib/api-client';

function StageContent({ stage }: { stage: StageId }) {
  const router = useRouter();
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const S = STAGE_TEXT[language];
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [userMessages, setUserMessages] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [restarting, setRestarting] = useState(false);
  // Changing the key remounts the chat so a restarted stage opens fresh.
  const [chatKey, setChatKey] = useState(0);

  useEffect(() => {
    fetchProgress()
      .then(setProgress)
      .catch(() => setProgress({ completed: [], summaries: {}, genoma: null }));
  }, [stage]);

  const onUserMessageCount = useCallback((n: number) => setUserMessages(n), []);

  const index = STAGE_IDS.indexOf(stage);
  const total = STAGE_IDS.length;
  const isDone = progress?.completed.includes(stage) ?? false;
  const following = nextStage(stage);
  const summary = progress?.summaries[stage];

  const onComplete = async () => {
    if (userMessages === 0) {
      setCompleteError(T.completeNeedsChat);
      return;
    }
    const wasDone = isDone;
    setCompleting(true);
    setCompleteError('');
    setNotice('');
    try {
      const updated = await completeStage(stage, language);
      setProgress((prev) => ({ ...(prev ?? { genoma: null }), ...updated }));
      if (wasDone) setNotice(T.updatedOk);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      setCompleteError(code === 'no_conversation' ? T.completeNeedsChat : T.completeError);
    } finally {
      setCompleting(false);
    }
  };

  const onRestart = async () => {
    setRestarting(true);
    setCompleteError('');
    setNotice('');
    try {
      await restartStage(stage);
      setConfirmRestart(false);
      setUserMessages(0);
      setChatKey((k) => k + 1);
    } catch {
      setCompleteError(T.restartError);
    } finally {
      setRestarting(false);
    }
  };

  if (!progress) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  // The advisor needs the GENOMA before any stage.
  if (!progress.genoma) {
    return (
      <div className="panel rise-in mx-auto max-w-xl p-8 text-center">
        <h1 className="text-xl font-semibold text-white">{T.needGenomaTitle}</h1>
        <p className="mt-2 text-slate-400">{T.needGenomaSub}</p>
        <Link href="/dashboard/genoma" className="btn-accent mt-6">
          {T.goGenoma} <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Route sidebar */}
      <aside className="order-2 lg:order-1">
        <div className="panel p-4 lg:sticky lg:top-24">
          <Link href="/dashboard" className="mb-3 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
            <span aria-hidden="true">←</span> {T.backToRoute}
          </Link>
          <ol className="space-y-1">
            {STAGE_IDS.map((id, i) => {
              const done = progress.completed.includes(id);
              const active = id === stage;
              return (
                <li key={id}>
                  <Link
                    href={stageHref(id)}
                    className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                      active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        done
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : active
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <span className="truncate">{STAGE_TEXT[language][id].title}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      {/* Stage */}
      <section className="order-1 min-w-0 space-y-5 lg:order-2">
        <header className="panel rise-in p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-400">{fill(T.stageOf, { n: index + 1, total })}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{S[stage].title}</h1>
              <p className="mt-2 max-w-2xl text-slate-400">{S[stage].goal}</p>
            </div>
            {isDone && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30">
                {T.completedBadge}
              </span>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{T.whatYouGet}</span>
            {S[stage].deliverables.map((d) => (
              <span key={d} className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
                {d}
              </span>
            ))}
          </div>
        </header>

        {isDone && summary && (
          <div className="panel rise-in border-emerald-500/25 p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold text-white">{T.yourDeliverable}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <DownloadPdfButton
                  variant="quiet"
                  title={`${T.pdfDeliverable}: ${S[stage].title}`}
                  businessName={progress.genoma?.businessName?.trim() || undefined}
                  sections={[{ markdown: summary }]}
                />
                {following && (
                  <button onClick={() => router.push(stageHref(following))} className="btn-accent">
                    {T.goNext}: {S[following].title} <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </div>
            <div className="advisor-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            </div>
          </div>
        )}

        <AdvisorChat key={chatKey} channel={stage} onUserMessageCount={onUserMessageCount} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-sm ${completeError ? 'text-amber-300' : notice ? 'text-emerald-400' : 'text-slate-400'}`}>
            {completeError || notice || (isDone ? T.updateHint : T.completeHint)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {!confirmRestart && (
              <button
                onClick={() => setConfirmRestart(true)}
                disabled={completing || restarting}
                className="btn-quiet"
              >
                ↺ {T.restartStage}
              </button>
            )}
            <button onClick={onComplete} disabled={completing || restarting} className="btn-accent">
              {completing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isDone ? T.updating : T.completing}
                </>
              ) : (
                <>✓ {isDone ? T.updateDeliverable : T.completeStage}</>
              )}
            </button>
          </div>
        </div>

        {confirmRestart && (
          <div className="panel rise-in flex flex-col gap-3 border-amber-500/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">{T.restartConfirm}</p>
            <div className="flex flex-shrink-0 gap-2">
              <button onClick={() => setConfirmRestart(false)} disabled={restarting} className="btn-quiet">
                {T.cancel}
              </button>
              <button onClick={onRestart} disabled={restarting} className="btn-accent">
                {restarting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                {T.restartYes}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StageRouter() {
  const params = useParams<{ stage: string }>();
  const router = useRouter();
  const raw = params?.stage ?? '';
  const valid = isStageId(raw);

  useEffect(() => {
    if (!valid) router.replace('/dashboard/ruta');
    else if (raw === 'genoma') router.replace('/dashboard/genoma');
  }, [valid, raw, router]);

  if (!isStageId(raw) || raw === 'genoma') return null;
  return <StageContent key={raw} stage={raw} />;
}

export default function StagePage() {
  return (
    <AppShell>
      <StageRouter />
    </AppShell>
  );
}
