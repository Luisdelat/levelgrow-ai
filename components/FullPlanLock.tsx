'use client';

import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT } from '@/lib/app-text';

/** Shown to Basic plan users on Full-only tools. */
export default function FullPlanLock({ title, description }: { title: string; description: string }) {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  return (
    <div className="panel rise-in mx-auto max-w-xl p-8 text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-500/30">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M10 2a4 4 0 0 0-4 4v2H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-1V6a4 4 0 0 0-4-4Zm-2 6V6a2 2 0 1 1 4 0v2H8Z" />
        </svg>
        {T.fullBadge}
      </span>
      <h1 className="mt-4 text-xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-slate-400">{description}</p>
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
        <p className="font-medium text-white">{T.lockedTitle}</p>
        <p className="mt-1 text-sm text-slate-400">{T.lockedSub}</p>
      </div>
    </div>
  );
}
