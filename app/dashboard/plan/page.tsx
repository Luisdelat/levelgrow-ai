'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppShell from '@/components/AppShell';
import DownloadPdfButton from '@/components/DownloadPdfButton';
import UpgradeCard from '@/components/UpgradeCard';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill, type AppText } from '@/lib/app-text';
import { STAGE_IDS, STAGE_TEXT, stageHref, type StageId } from '@/lib/stages';
import { fetchProgress, fetchUsage, type ProgressResponse } from '@/lib/api-client';

const GENOMA_FIELDS: { key: string; label: keyof AppText }[] = [
  { key: 'businessName', label: 'fBusinessName' },
  { key: 'location', label: 'fLocation' },
  { key: 'services', label: 'fServices' },
  { key: 'targetAudience', label: 'fTarget' },
  { key: 'mainProblem', label: 'fProblem' },
  { key: 'differentiation', label: 'fDiff' },
  { key: 'mainObjective', label: 'fObjective' },
  { key: 'marketingBudget', label: 'fBudget' },
];

function CopyButton({ text, labels }: { text: string; labels: { copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable
    }
  };
  return (
    <button onClick={copy} className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 hover:border-slate-600 hover:text-white">
      {copied ? labels.copied : labels.copy}
    </button>
  );
}

function PlanContent() {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const S = STAGE_TEXT[language];
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [plan, setPlan] = useState<'basic' | 'full' | null>(null);

  useEffect(() => {
    fetchProgress()
      .then(setProgress)
      .catch(() => setProgress({ completed: [], summaries: {}, genoma: null }));
    fetchUsage()
      .then((u) => setPlan(u.plan))
      .catch(() => setPlan(null));
  }, []);

  if (!progress) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  const advisorStages = STAGE_IDS.filter((id): id is Exclude<StageId, 'genoma'> => id !== 'genoma');
  const hasAny = advisorStages.some((id) => progress.summaries[id]);
  const businessName = progress.genoma?.businessName?.trim() || undefined;
  const stageKicker = (id: StageId) => fill(T.stageOf, { n: STAGE_IDS.indexOf(id) + 1, total: STAGE_IDS.length });

  // The full plan PDF: GENOMA answers first, then every finished deliverable in route order.
  const genomaMarkdown = GENOMA_FIELDS.filter((f) => progress.genoma?.[f.key]?.trim())
    .map((f) => `- **${T[f.label] as string}:** ${progress.genoma?.[f.key]?.trim().replace(/\n+/g, ' ')}`)
    .join('\n');
  const fullPlanSections = [
    ...(genomaMarkdown ? [{ kicker: stageKicker('genoma'), heading: S.genoma.title, markdown: genomaMarkdown }] : []),
    ...advisorStages
      .filter((id) => progress.summaries[id])
      .map((id) => ({ kicker: stageKicker(id), heading: S[id].title, markdown: progress.summaries[id] ?? '' })),
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rise-in flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{T.planTitle}</h1>
          <p className="mt-2 text-slate-400">{T.planSub}</p>
        </div>
        {hasAny && (
          <DownloadPdfButton
            variant="accent"
            label={T.downloadFullPlan}
            title={T.pdfFullPlanTitle}
            businessName={businessName}
            sections={fullPlanSections}
          />
        )}
      </header>

      {plan === 'basic' && (
        <UpgradeCard title={T.upsellPlanTitle} description={T.upsellPlanSub} cta={T.upgradeCta} />
      )}

      {progress.genoma && (
        <section className="panel rise-in p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-white">{S.genoma.title}</h2>
            <Link href="/dashboard/adn" className="text-sm text-blue-400 hover:text-blue-300">
              {T.review}
            </Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {GENOMA_FIELDS.filter((f) => progress.genoma?.[f.key]?.trim()).map((f) => (
              <div key={f.key}>
                <dt className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">{T[f.label] as string}</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-200">{progress.genoma?.[f.key]}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {!hasAny && (
        <div className="panel rise-in p-8 text-center">
          <p className="text-slate-400">{T.planEmpty}</p>
          <Link href="/dashboard/ruta" className="btn-accent mt-5">
            {T.startRoute} <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {advisorStages.map((id, i) => {
        const summary = progress.summaries[id];
        if (!summary) return null;
        return (
          <section key={id} className="panel rise-in p-6" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {fill(T.stageOf, { n: STAGE_IDS.indexOf(id) + 1, total: STAGE_IDS.length })}
                </p>
                <h2 className="font-semibold text-white">{S[id].title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={summary} labels={{ copy: T.copy, copied: T.copied }} />
                <DownloadPdfButton
                  title={`${T.pdfDeliverable}: ${S[id].title}`}
                  businessName={businessName}
                  sections={[{ markdown: summary }]}
                />
                <Link href={stageHref(id)} className="rounded-md px-2.5 py-1 text-xs text-blue-400 hover:text-blue-300">
                  {T.review}
                </Link>
              </div>
            </div>
            <div className="advisor-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function PlanPage() {
  return (
    <AppShell>
      <PlanContent />
    </AppShell>
  );
}
