'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill } from '@/lib/app-text';
import { STAGE_IDS, STAGE_TEXT, stageHref, type StageId } from '@/lib/stages';
import { fetchProgress, type ProgressResponse } from '@/lib/api-client';

function StageIcon({ state, index }: { state: 'done' | 'current' | 'pending'; index: number }) {
  if (state === 'done') {
    return (
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        state === 'current'
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'bg-slate-800 text-slate-400 ring-1 ring-slate-700'
      }`}
    >
      {index + 1}
    </span>
  );
}

function DashboardContent() {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const S = STAGE_TEXT[language];
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [tipIndex] = useState(() => new Date().getDate());

  useEffect(() => {
    fetchProgress()
      .then(setProgress)
      .catch(() => setLoadError(true));
  }, []);

  const completed = useMemo(() => progress?.completed ?? [], [progress]);
  const next: StageId | null = STAGE_IDS.find((id) => !completed.includes(id)) ?? null;
  const total = STAGE_IDS.length;
  const done = completed.length;
  const pct = Math.round((done / total) * 100);
  const businessName = progress?.genoma?.businessName?.trim();
  const tip = T.tips[tipIndex % T.tips.length];

  const stateOf = (id: StageId): 'done' | 'current' | 'pending' =>
    completed.includes(id) ? 'done' : id === next ? 'current' : 'pending';

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rise-in grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-6 sm:p-8">
          <p className="text-sm font-medium text-blue-400">
            {T.hello}
            {businessName ? `, ${businessName}` : ''}
          </p>
          <h1 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {T.heroTitle}
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">{T.heroSub}</p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium text-slate-300">{T.progressLabel}</span>
              <span className="tabular-nums text-slate-400">{fill(T.stepsDone, { n: done, total })}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700"
                style={{ width: `${progress ? Math.max(pct, 3) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Next step */}
        <div className="panel relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-600/15 blur-3xl" />
          {next ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{T.nextStepLabel}</p>
              <p className="mt-3 text-sm text-slate-400">{fill(T.stageOf, { n: STAGE_IDS.indexOf(next) + 1, total })}</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{S[next].title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{S[next].goal}</p>
              <Link href={stageHref(next)} className="btn-accent mt-6 w-full sm:w-auto">
                {done === 0 ? T.start : T.continue}
                <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : progress ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">{T.statusDone}</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{T.allDoneTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{T.allDoneSub}</p>
              <Link href="/dashboard/plan" className="btn-accent mt-6">
                {T.openPlan} <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              {loadError ? (
                <p className="text-sm text-slate-400">{T.advisorError}</p>
              ) : (
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Route */}
      <section className="rise-in" style={{ animationDelay: '80ms' }}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">{T.routeTitle}</h2>
          <p className="text-sm text-slate-400">{T.routeSub}</p>
        </div>
        <ol className="grid gap-3 sm:grid-cols-2">
          {STAGE_IDS.map((id, i) => {
            const state = stateOf(id);
            return (
              <li key={id}>
                <Link
                  href={stageHref(id)}
                  className={`panel panel-hover group flex h-full items-start gap-4 p-4 ${
                    state === 'current' ? 'border-blue-500/50 bg-blue-500/[0.06]' : ''
                  }`}
                >
                  <StageIcon state={state} index={i} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-white">{S[id].title}</h3>
                      <span
                        className={`text-xs ${
                          state === 'done'
                            ? 'text-emerald-400'
                            : state === 'current'
                              ? 'text-blue-400'
                              : 'text-slate-500'
                        }`}
                      >
                        {state === 'done' ? T.statusDone : state === 'current' ? T.statusCurrent : T.statusPending}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-snug text-slate-400">{S[id].goal}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Tools + tip */}
      <section className="rise-in grid gap-4 lg:grid-cols-4" style={{ animationDelay: '160ms' }}>
        <h2 className="sr-only">{T.toolsTitle}</h2>
        {[
          { href: '/dashboard/chat', title: T.navAdvisor, text: T.toolAdvisor, icon: 'M4 5h16v10H8l-4 4V5Z' },
          { href: '/dashboard/plan', title: T.navPlan, text: T.toolPlan, icon: 'M6 3h9l3 3v15H6V3Zm3 7h6m-6 4h6m-6 4h4' },
          { href: '/dashboard/genoma', title: T.navGenoma, text: T.toolGenoma, icon: 'M7 3c0 6 10 6 10 12s-10 6-10 6m10-18c0 6-10 6-10 12' },
        ].map((tool) => (
          <Link key={tool.href} href={tool.href} className="panel panel-hover group p-5">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={tool.icon} />
            </svg>
            <h3 className="mt-4 font-medium text-white">{tool.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{tool.text}</p>
          </Link>
        ))}
        <div className="panel border-blue-500/20 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-400">{T.tipTitle}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">“{tip}”</p>
        </div>
      </section>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}
