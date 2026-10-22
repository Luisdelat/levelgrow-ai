'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill, type AppText } from '@/lib/app-text';
import { STAGE_IDS, STAGE_TEXT } from '@/lib/stages';
import { authHeaders, completeStage, fetchProgress } from '@/lib/api-client';

const EMPTY = {
  businessName: '',
  businessType: '',
  location: '',
  services: '',
  targetAudience: '',
  mainProblem: '',
  differentiation: '',
  currentChannels: '',
  salesProcess: '',
  mainObjective: '',
  marketingBudget: '',
};

type GenomaForm = typeof EMPTY;
type FieldKey = keyof GenomaForm;

interface FieldDef {
  key: FieldKey;
  label: keyof AppText;
  placeholder: keyof AppText;
  multiline?: boolean;
  required?: boolean;
}

const SECTIONS: { title: keyof AppText; fields: FieldDef[] }[] = [
  {
    title: 'secBusiness',
    fields: [
      { key: 'businessName', label: 'fBusinessName', placeholder: 'pBusinessName', required: true },
      { key: 'businessType', label: 'fBusinessType', placeholder: 'pBusinessType', required: true },
      { key: 'location', label: 'fLocation', placeholder: 'pLocation' },
      { key: 'services', label: 'fServices', placeholder: 'pServices', multiline: true },
    ],
  },
  {
    title: 'secClient',
    fields: [
      { key: 'targetAudience', label: 'fTarget', placeholder: 'pTarget', multiline: true, required: true },
      { key: 'mainProblem', label: 'fProblem', placeholder: 'pProblem', multiline: true },
      { key: 'differentiation', label: 'fDiff', placeholder: 'pDiff', multiline: true },
    ],
  },
  {
    title: 'secNow',
    fields: [
      { key: 'currentChannels', label: 'fChannels', placeholder: 'pChannels', multiline: true },
      { key: 'salesProcess', label: 'fSales', placeholder: 'pSales', multiline: true },
      { key: 'mainObjective', label: 'fObjective', placeholder: 'pObjective', multiline: true },
      { key: 'marketingBudget', label: 'fBudget', placeholder: 'pBudget' },
    ],
  },
];

const TYPE_OPTIONS: { value: string; label: keyof AppText }[] = [
  { value: 'local', label: 'tLocal' },
  { value: 'services', label: 'tServices' },
  { value: 'ecommerce', label: 'tEcommerce' },
  { value: 'coaching', label: 'tCoaching' },
  { value: 'other', label: 'tOther' },
];

function GenomaContent() {
  const router = useRouter();
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const [form, setForm] = useState<GenomaForm>(EMPTY);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Prefill with the latest saved GENOMA.
  useEffect(() => {
    fetchProgress()
      .then((p) => {
        if (p.genoma) {
          const next = { ...EMPTY };
          for (const key of Object.keys(EMPTY) as FieldKey[]) {
            const v = p.genoma[key];
            if (typeof v === 'string') next[key] = v;
          }
          setForm(next);
        }
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const update = (key: FieldKey, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim() || !form.businessType || !form.targetAudience.trim()) {
      setError(T.requiredError);
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/genoma', {
        method: 'POST',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: form, status: 'completed' }),
      });
      if (!res.ok) throw new Error(`genoma ${res.status}`);
      const p = await completeStage('genoma', language);
      const next = STAGE_IDS.find((id) => id !== 'genoma' && !p.completed.includes(id)) ?? 'cliente';
      router.push(`/dashboard/ruta/${next}`);
    } catch (err) {
      console.error(err);
      setError(T.saveError);
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <header className="rise-in">
        <p className="text-sm font-medium text-blue-400">{fill(T.stageOf, { n: 1, total: STAGE_IDS.length })}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{T.genomaTitle}</h1>
        <p className="mt-2 text-slate-400">{T.genomaSub}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {STAGE_TEXT[language].genoma.deliverables.map((d) => (
            <span key={d} className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
              {d}
            </span>
          ))}
        </div>
      </header>

      {SECTIONS.map((section, si) => (
        <fieldset
          key={section.title}
          className="panel rise-in p-6 sm:p-8"
          style={{ animationDelay: `${(si + 1) * 70}ms` }}
        >
          <legend className="sr-only">{T[section.title] as string}</legend>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/15 text-sm font-semibold text-blue-400 ring-1 ring-blue-500/30">
              {si + 1}
            </span>
            <h2 className="text-lg font-semibold text-white">{T[section.title] as string}</h2>
          </div>
          <div className="grid gap-5">
            {section.fields.map((f) => (
              <label key={f.key} className="block">
                <span className="mb-2 flex items-baseline gap-2 text-sm font-medium text-slate-200">
                  {T[f.label] as string}
                  {f.required && <span className="text-xs font-normal text-slate-500">({T.required})</span>}
                </span>
                {f.key === 'businessType' ? (
                  <select
                    value={form.businessType}
                    onChange={(e) => update('businessType', e.target.value)}
                    className="field"
                  >
                    <option value="">{T.pBusinessType}</option>
                    {TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {T[o.label] as string}
                      </option>
                    ))}
                    {form.businessType && !TYPE_OPTIONS.some((o) => o.value === form.businessType) && (
                      <option value={form.businessType}>{form.businessType}</option>
                    )}
                  </select>
                ) : f.multiline ? (
                  <textarea
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={T[f.placeholder] as string}
                    rows={3}
                    maxLength={1500}
                    className="field resize-y"
                  />
                ) : (
                  <input
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    placeholder={T[f.placeholder] as string}
                    maxLength={200}
                    className="field"
                  />
                )}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard" className="btn-quiet">
          {T.cancel}
        </Link>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          {error && <p className="text-sm text-amber-300">{error}</p>}
          <button type="submit" disabled={saving} className="btn-accent px-6 py-3">
            {saving ? T.saving : T.saveContinue}
            {!saving && <span aria-hidden="true">→</span>}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function GenomaBuilder() {
  return (
    <AppShell>
      <GenomaContent />
    </AppShell>
  );
}
