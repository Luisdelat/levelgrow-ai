'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill } from '@/lib/app-text';
import { LANDING_TEXT } from '@/lib/landing-text';
import { PLANS, planOf } from '@/lib/plans';
import { PROMO_TEXT, promoFill } from '@/lib/promo-text';
import { STAGE_IDS, STAGE_TEXT, stageHref, type StageId } from '@/lib/stages';
import { fetchProgress } from '@/lib/api-client';

const LOCALES: Record<string, string> = { es: 'es', en: 'en', ru: 'ru', tr: 'tr', az: 'az' };

/** Shown right after a successful payment: confirms the purchase and tells the user exactly what to do next. */
function Welcome() {
  const params = useSearchParams();
  const { user, subscription } = useAuth();
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const L = LANDING_TEXT[language];
  const S = STAGE_TEXT[language];

  const [completed, setCompleted] = useState<StageId[] | null>(null);
  useEffect(() => {
    fetchProgress()
      .then((p) => setCompleted(p.completed))
      .catch(() => setCompleted([]));
  }, []);

  const plan = planOf(user?.plan ?? params.get('plan'));
  const planName = plan === 'full' ? L.fullName : L.basicName;
  const upgraded = params.get('upgrade') === '1';
  const trial = params.get('trial') === '1';
  const next: StageId | null = completed ? (STAGE_IDS.find((id) => !completed.includes(id)) ?? null) : 'genoma';
  const started = Boolean(completed && completed.length > 0);
  const nextDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString(LOCALES[language], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const included = plan === 'full' ? T.welcomeIncludedFull : T.welcomeIncludedBasic;
  const steps = [
    { title: T.welcomeStep1Title, text: T.welcomeStep1Text },
    { title: T.welcomeStep2Title, text: T.welcomeStep2Text },
    { title: T.welcomeStep3Title, text: T.welcomeStep3Text },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Confirmation */}
      <section className="panel rise-in relative overflow-hidden p-6 text-center sm:p-10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/40">
          <svg viewBox="0 0 20 20" className="h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
          </svg>
        </span>
        <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
          {T.welcomeKicker}
        </p>
        <h1 className="relative mt-2 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {fill(T.welcomeTitle, { plan: planName })}
        </h1>
        <p className="relative mx-auto mt-3 max-w-xl text-slate-400">{T.welcomeSub}</p>
        {trial && (
          <p className="relative mx-auto mt-4 max-w-xl rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-200">
            🎁{' '}
            {promoFill(PROMO_TEXT[language].welcome, {
              price: PLANS[plan].price,
              date: nextDate ?? '—',
            })}
          </p>
        )}
        {upgraded && (
          <p className="relative mx-auto mt-4 max-w-xl rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm text-blue-200">
            {fill(T.welcomeUpgraded, { plan: planName })}
          </p>
        )}

        <div className="relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {next ? (
            <Link href={stageHref(next)} className="btn-accent w-full sm:w-auto">
              {started ? fill(T.welcomeContinue, { stage: S[next].title }) : T.welcomeStart}
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link href="/dashboard/plan" className="btn-accent w-full sm:w-auto">
              {T.openPlan} <span aria-hidden="true">→</span>
            </Link>
          )}
          <Link href="/dashboard" className="btn-quiet w-full sm:w-auto">
            {T.goDashboard}
          </Link>
        </div>
      </section>

      {/* Receipt */}
      <section className="panel rise-in p-6" style={{ animationDelay: '60ms' }}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">{T.receiptTitle}</h2>
        <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
            <dt className="text-slate-400">{T.receiptPlan}</dt>
            <dd className="font-medium text-white">{planName}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
            <dt className="text-slate-400">{T.receiptPrice}</dt>
            <dd className="font-medium tabular-nums text-white">
              ${PLANS[plan].price} USD{L.perMonth}
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-slate-800 pb-2">
            <dt className="text-slate-400">{T.receiptNext}</dt>
            <dd className="font-medium text-white">{nextDate ?? T.receiptNextSoon}</dd>
          </div>
          <div className="flex min-w-0 justify-between gap-3 border-b border-slate-800 pb-2">
            <dt className="text-slate-400">{T.receiptAccount}</dt>
            <dd className="min-w-0 truncate font-medium text-white">{user?.email ?? '—'}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">{T.receiptNote}</p>
        <p className="mt-2 text-sm text-slate-500">
          {T.receiptManage}{' '}
          <Link href="/checkout" className="text-blue-400 hover:text-blue-300">
            {T.navSubscription}
          </Link>
          .
        </p>
      </section>

      {/* How it works */}
      <section className="panel rise-in p-6" style={{ animationDelay: '120ms' }}>
        <h2 className="text-lg font-semibold text-white">{T.welcomeStepsTitle}</h2>
        <ol className="mt-5 space-y-5">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-medium text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-lg bg-slate-800/60 px-4 py-3 text-sm text-slate-300">{T.welcomeHelp}</p>
      </section>

      {/* What the plan includes */}
      <section className="panel rise-in p-6" style={{ animationDelay: '180ms' }}>
        <h2 className="text-lg font-semibold text-white">{fill(T.welcomeIncludedTitle, { plan: planName })}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {included.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-slate-300">
              <span className="text-emerald-400">✓</span>
              {item}
            </li>
          ))}
        </ul>
        {plan === 'basic' && (
          <p className="mt-5 text-sm text-slate-400">
            {T.welcomeBasicMore}{' '}
            <Link href="/checkout?plan=full" className="text-blue-400 hover:text-blue-300">
              {T.upgradeCta} →
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <Welcome />
      </Suspense>
    </AppShell>
  );
}
