'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import LogoMark from './LogoMark';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT } from '@/lib/app-text';
import type { Language } from '@/lib/translations';

const LANG_OPTIONS: { value: Language; label: string }[] = [
  { value: 'es', label: 'ES · Español' },
  { value: 'en', label: 'EN · English' },
  { value: 'ru', label: 'RU · Русский' },
  { value: 'tr', label: 'TR · Türkçe' },
  { value: 'az', label: 'AZ · Azərbaycanca' },
];

function LogoWatermark() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="app-grid absolute inset-0" />
      <div className="lg-watermark absolute -right-24 top-24 opacity-[0.10] sm:-right-10 lg:right-[4%]">
        <LogoMark size={620} animated />
      </div>
    </div>
  );
}

export default function AppShell({
  children,
  allowWithoutAccess = false,
}: {
  children: ReactNode;
  /** The checkout page must open for users who have not paid yet. */
  allowWithoutAccess?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, access, loading, authenticated, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const T = APP_TEXT[language];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!authenticated) router.replace('/auth/login');
    else if (access === false && !allowWithoutAccess) router.replace('/checkout');
  }, [loading, authenticated, access, allowWithoutAccess, router]);

  const blocked = loading || !authenticated || (access === false && !allowWithoutAccess);

  const nav = [
    { href: '/dashboard', label: T.navHome, match: (p: string) => p === '/dashboard' },
    {
      href: '/dashboard/ruta',
      label: T.navRoute,
      match: (p: string) => p.startsWith('/dashboard/ruta') || p.startsWith('/dashboard/genoma'),
    },
    { href: '/dashboard/chat', label: T.navAdvisor, match: (p: string) => p.startsWith('/dashboard/chat') },
    { href: '/dashboard/plan', label: T.navPlan, match: (p: string) => p.startsWith('/dashboard/plan') },
  ];

  const planLabel = user?.plan === 'full' ? T.planFull : T.planBasic;

  return (
    <div className="app-bg relative isolate min-h-screen text-slate-100">
      <LogoWatermark />

      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0a0e16]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="flex flex-shrink-0 items-center gap-2.5">
            <LogoMark size={34} compact />
            <span className="whitespace-nowrap text-[15px] font-semibold tracking-wide text-white">
              LEVELGROW <span className="text-blue-400">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-slate-800/80 text-white' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
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

            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold uppercase text-slate-200 hover:border-slate-600"
                aria-label="Account"
              >
                {user?.email?.[0] ?? '·'}
              </button>
              {menuOpen && (
                <>
                  <button className="fixed inset-0 z-40 cursor-default" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl shadow-black/40">
                    <div className="border-b border-slate-800 px-3 pb-3 pt-2">
                      <p className="truncate text-sm font-medium text-white">{user?.email}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{planLabel}</p>
                    </div>
                    <div className="py-1 md:hidden">
                      {nav.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    {[
                      { href: '/dashboard/genoma', label: T.navGenoma },
                      { href: '/dashboard/contenido', label: T.contentTitle },
                      { href: '/dashboard/revision', label: T.reviewTitle },
                      { href: '/checkout', label: T.navSubscription },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={logout}
                      className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      {T.logout}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        {blocked ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
