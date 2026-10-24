'use client';

import { useState } from 'react';
import { LEGAL_UI } from '@/lib/legal';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT } from '@/lib/app-text';
import type { PdfSection } from '@/lib/pdf/deliverable-pdf';

const LOCALES: Record<string, string> = { es: 'es', en: 'en', ru: 'ru', tr: 'tr', az: 'az' };

interface DownloadPdfButtonProps {
  title: string;
  /** Business name, shown under the title and added to the file name. */
  businessName?: string;
  sections: PdfSection[];
  /** "accent" for the main call to action, "quiet" for small inline buttons. */
  variant?: 'accent' | 'quiet' | 'small';
  label?: string;
}

export default function DownloadPdfButton({
  title,
  businessName,
  sections,
  variant = 'small',
  label,
}: DownloadPdfButtonProps) {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const download = async () => {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      const { downloadDeliverablePdf, pdfFileName } = await import('@/lib/pdf/deliverable-pdf');
      await downloadDeliverablePdf({
        title,
        subtitle: businessName,
        sections,
        fileName: pdfFileName('levelgrow', title, businessName),
        pageLabel: T.pdfPage,
        aiNotice: LEGAL_UI[language].aiShort,
        dateLabel: new Date().toLocaleDateString(LOCALES[language], { year: 'numeric', month: 'long', day: 'numeric' }),
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const className =
    variant === 'accent'
      ? 'btn-accent'
      : variant === 'quiet'
        ? 'btn-quiet'
        : 'inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-600 hover:text-white disabled:opacity-60';

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button type="button" onClick={download} disabled={busy} className={className}>
        {busy ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M10 2.5a.75.75 0 0 1 .75.75v7.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L5.72 9.53a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.25A.75.75 0 0 1 10 2.5ZM3.75 13.5a.75.75 0 0 1 .75.75v1.5c0 .14.11.25.25.25h10.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 15.25 17.5H4.75A1.75 1.75 0 0 1 3 15.75v-1.5a.75.75 0 0 1 .75-.75Z" />
          </svg>
        )}
        {busy ? T.pdfGenerating : (label ?? T.downloadPdf)}
      </button>
      {failed && <span className="text-xs text-amber-300">{T.pdfError}</span>}
    </span>
  );
}
