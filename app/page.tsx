'use client';

import Link from 'next/link';
import LogoMark from '@/components/LogoMark';
import { useLanguage } from '@/lib/useLanguage';
import { LANDING_TEXT } from '@/lib/landing-text';
import { STAGE_IDS, STAGE_TEXT } from '@/lib/stages';
import { PLANS } from '@/lib/plans';
import type { Language } from '@/lib/translations';

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: 'es', label: 'ES · Español' },
  { value: 'en', label: 'EN · English' },
  { value: 'ru', label: 'RU · Русский' },
  { value: 'tr', label: 'TR · Türkçe' },
  { value: 'az', label: 'AZ · Azərbaycanca' },
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" fill="currentColor" aria-hidden="true">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export default function Home() {
  const { language, changeLanguage } = useLanguage();
  const L = LANDING_TEXT[language];
  const S = STAGE_TEXT[language];

  return (
    <div className="app-bg relative isolate min-h-screen overflow-x-hidden text-slate-100">
      {/* Living logo watermark */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="app-grid absolute inset-0" />
        <div className="lg-watermark absolute -right-40 top-16 opacity-[0.10] sm:-right-16 lg:right-[2%]">
          <LogoMark size={680} animated />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0a0e16]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
            <LogoMark size={34} compact />
            <span className="whitespace-nowrap text-[15px] font-semibold tracking-wide text-white">
              LEVELGROW <span className="text-blue-400">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="w-[76px] rounded-lg border border-slate-700/80 bg-slate-900/80 px-2 py-1.5 text-xs text-slate-300 focus:border-blue-500 focus:outline-none sm:w-auto"
              aria-label="Language"
            >
              {LANG_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <Link href="/auth/login" className="hidden text-sm font-medium text-slate-300 hover:text-white sm:inline">
              {L.login}
            </Link>
            <Link href="/auth/register" className="btn-accent whitespace-nowrap px-3 py-2 sm:px-4">
              {L.register}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pt-24">
          <div className="rise-in">
            <p className="text-sm font-medium text-blue-400">{L.eyebrow}</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              {L.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">{L.heroSub}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/register" className="btn-accent px-6 py-3 text-base">
                {L.ctaPrimary} <span aria-hidden="true">→</span>
              </Link>
              <a href="#como-funciona" className="btn-quiet px-6 py-3 text-base">
                {L.ctaSecondary}
              </a>
            </div>
          </div>

          {/* Product preview: the real route */}
          <div className="panel rise-in p-5 sm:p-6" style={{ animationDelay: '120ms' }} aria-hidden="true">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">{L.previewLabel}</p>
              <span className="text-xs tabular-nums text-slate-400">2 / {STAGE_IDS.length}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
            </div>
            <ol className="mt-5 space-y-2">
              {STAGE_IDS.slice(0, 5).map((id, i) => {
                const done = i < 2;
                const current = i === 2;
                return (
                  <li
                    key={id}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                      current ? 'bg-blue-500/10 ring-1 ring-blue-500/40' : ''
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        done
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : current
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <span className={done || current ? 'text-slate-200' : 'text-slate-500'}>{S[id].title}</span>
                    {current && <span className="ml-auto text-xs text-blue-400">{L.previewNext}</span>}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* How it works */}
        <section id="como-funciona" className="scroll-mt-20 border-t border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{L.howTitle}</h2>
            <p className="mt-2 max-w-2xl text-slate-400">{L.howSub}</p>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {L.steps.map((step, i) => (
                <li key={step.title} className="panel p-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/15 text-sm font-semibold text-blue-400 ring-1 ring-blue-500/30">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Route */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{L.routeTitle}</h2>
            <p className="mt-2 max-w-2xl text-slate-400">{L.routeSub}</p>
            <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STAGE_IDS.map((id, i) => (
                <li key={id} className="panel p-5">
                  <p className="text-xs font-semibold tabular-nums text-blue-400">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 font-medium text-white">{S[id].title}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-slate-400">{S[id].goal}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Benefits */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{L.benefitsTitle}</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {L.benefits.map((b) => (
                <div key={b.title} className="panel flex gap-4 p-6">
                  <Check />
                  <div>
                    <h3 className="font-semibold text-white">{b.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="planes" className="scroll-mt-20 border-t border-slate-800/80">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{L.pricingTitle}</h2>
            <p className="mt-2 text-slate-400">{L.pricingSub}</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {[
                { id: 'basic', name: L.basicName, forWho: L.basicFor, items: L.basicItems, price: PLANS.basic.price, featured: false },
                { id: 'full', name: L.fullName, forWho: L.fullFor, items: L.fullItems, price: PLANS.full.price, featured: true },
              ].map((plan) => (
                <div
                  key={plan.id}
                  className={`panel relative flex flex-col p-7 sm:p-8 ${plan.featured ? 'border-blue-500/50 bg-blue-500/[0.05]' : ''}`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 right-6 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      {L.recommended}
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{plan.forWho}</p>
                  <p className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-white">${plan.price}</span>
                    <span className="text-slate-400">{L.perMonth}</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-slate-300">
                        <Check />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/auth/register?plan=${plan.id}`}
                    className={`mt-8 w-full ${plan.featured ? 'btn-accent' : 'btn-quiet'} py-3`}
                  >
                    {L.choose}
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate-500">{L.pricingNote}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{L.faqTitle}</h2>
            <div className="mt-8 space-y-3">
              {L.faq.map((item) => (
                <details key={item.q} className="panel group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white">
                    {item.q}
                    <span className="text-slate-500 transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-slate-800/80">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">{L.finalTitle}</h2>
            <p className="mt-3 text-slate-400">{L.finalSub}</p>
            <Link href="/auth/register" className="btn-accent mt-8 px-6 py-3 text-base">
              {L.ctaPrimary} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6">
          <span className="flex items-center gap-2">
            <LogoMark size={22} compact /> LEVELGROW AI
          </span>
          <span>
            © {new Date().getFullYear()} LEVELGROW AI. {L.footer}
          </span>
        </div>
      </footer>
    </div>
  );
}
