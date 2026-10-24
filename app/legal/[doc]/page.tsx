'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import LogoMark from '@/components/LogoMark';
import LegalLinks from '@/components/LegalLinks';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/useLanguage';
import { LEGAL_DOCS, LEGAL_UI, LEGAL_UPDATED, legalDoc, type LegalDocId } from '@/lib/legal';

export default function LegalPage() {
  const params = useParams<{ doc: string }>();
  const { language } = useLanguage();
  const U = LEGAL_UI[language];
  const id = (LEGAL_DOCS as string[]).includes(params.doc) ? (params.doc as LegalDocId) : 'terminos';
  const { text, lang } = legalDoc(id, language);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-slate-800/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-white">
            <LogoMark size={28} compact /> LEVELGROW AI
          </Link>
          <LanguageSelector />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6" lang={lang}>
        <nav className="mb-8 flex flex-wrap gap-2 text-sm">
          {LEGAL_DOCS.map((d) => (
            <Link
              key={d}
              href={`/legal/${d}`}
              className={`rounded-full border px-3 py-1 ${
                d === id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-300'
                  : 'border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {{ terminos: U.terms, privacidad: U.privacy, reembolsos: U.refunds, ia: U.ai }[d]}
            </Link>
          ))}
        </nav>

        {U.englishNotice && (
          <p className="mb-6 rounded-lg border border-slate-700 bg-slate-900 p-3 text-sm text-slate-400">
            {U.englishNotice}
          </p>
        )}

        <h1 className="text-3xl font-bold text-white">{text.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {U.updated}: {LEGAL_UPDATED[lang]}
        </p>
        <p className="mt-6 leading-relaxed text-slate-300">{text.intro}</p>

        <div className="mt-8 space-y-8">
          {text.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-lg font-semibold text-white">{s.h}</h2>
              <div className="mt-3 space-y-3">
                {s.p.map((p) => (
                  <p key={p.slice(0, 40)} className="leading-relaxed text-slate-300">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-800/80">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <LegalLinks />
        </div>
      </footer>
    </div>
  );
}
