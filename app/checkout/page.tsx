'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/lib/useAuth';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill } from '@/lib/app-text';
import { LANDING_TEXT } from '@/lib/landing-text';
import { PLANS, type PlanId } from '@/lib/plans';
import { authHeaders } from '@/lib/api-client';

interface PayPalConfig {
  configured: boolean;
  clientId: string | null;
  live: boolean;
  manageUrl: string;
}

interface PayPalButtonsInstance {
  render: (el: HTMLElement) => Promise<void>;
  close: () => Promise<void>;
}

interface PayPalNamespace {
  Buttons: (options: Record<string, unknown>) => PayPalButtonsInstance;
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

function loadPayPalSdk(clientId: string): Promise<PayPalNamespace> {
  const id = 'paypal-sdk';
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve(window.paypal);
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => (window.paypal ? resolve(window.paypal) : reject(new Error('no paypal'))));
    script.addEventListener('error', () => reject(new Error('paypal sdk failed to load')));
    if (!existing) {
      script.id = id;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&vault=true&intent=subscription&currency=USD`;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

const LOCALES: Record<string, string> = { es: 'es', en: 'en', ru: 'ru', tr: 'tr', az: 'az' };

function Checkout() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, subscription, access, refresh } = useAuth();
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const L = LANDING_TEXT[language];

  const initialPlan: PlanId = params.get('plan') === 'full' ? 'full' : params.get('plan') === 'basic' ? 'basic' : 'full';
  const [plan, setPlan] = useState<PlanId>(initialPlan);
  const [config, setConfig] = useState<PayPalConfig | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [error, setError] = useState('');
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/paypal/config', { cache: 'no-store' })
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ configured: false, clientId: null, live: false, manageUrl: '' }));
  }, []);

  const complimentary = subscription?.status === 'complimentary';
  const currentPlan: PlanId | null = access && user ? (user.plan === 'full' ? 'full' : 'basic') : null;
  const alreadyOnSelected = currentPlan === plan && subscription?.status === 'active';
  const showButtons = Boolean(config?.configured && config.clientId && user && !complimentary && !alreadyOnSelected);

  // Render PayPal buttons for the selected plan.
  useEffect(() => {
    if (!showButtons || !config?.clientId || !user || !buttonsRef.current) return;
    let instance: PayPalButtonsInstance | null = null;
    let cancelled = false;
    const container = buttonsRef.current;
    container.innerHTML = '';

    loadPayPalSdk(config.clientId)
      .then((paypal) => {
        if (cancelled) return;
        instance = paypal.Buttons({
          style: { shape: 'rect', color: 'blue', layout: 'vertical', label: 'subscribe' },
          createSubscription: async (_data: unknown, actions: { subscription: { create: (o: object) => Promise<string> } }) => {
            setError('');
            const res = await fetch(`/api/paypal/plan?plan=${plan}`, { headers: authHeaders() });
            if (!res.ok) throw new Error('plan');
            const { planId } = await res.json();
            return actions.subscription.create({ plan_id: planId, custom_id: user.id });
          },
          onApprove: async (data: { subscriptionID?: string }) => {
            setStatus('processing');
            const res = await fetch('/api/paypal/activate', {
              method: 'POST',
              headers: { ...authHeaders(), 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscriptionId: data.subscriptionID }),
            });
            if (!res.ok) {
              setStatus('idle');
              setError(T.paymentError);
              return;
            }
            const result = (await res.json().catch(() => ({}))) as { plan?: string; replaced?: boolean };
            setStatus('done');
            await refresh();
            // Thank-you page: confirms the payment and shows the first steps.
            const query = new URLSearchParams({ plan: result.plan === 'full' ? 'full' : 'basic' });
            if (result.replaced) query.set('upgrade', '1');
            router.push(`/dashboard/bienvenida?${query}`);
          },
          onError: (err: unknown) => {
            console.error('PayPal error', err);
            setStatus('idle');
            setError(T.paymentError);
          },
        });
        return instance.render(container);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError(T.paymentsNotReady);
      });

    return () => {
      cancelled = true;
      instance?.close().catch(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showButtons, config?.clientId, user?.id, plan]);

  const planCards: { id: PlanId; name: string; forWho: string; items: string[] }[] = [
    { id: 'basic', name: L.basicName, forWho: L.basicFor, items: L.basicItems },
    { id: 'full', name: L.fullName, forWho: L.fullFor, items: L.fullItems },
  ];

  const statusText = (() => {
    if (!subscription || !access) return null;
    if (subscription.status === 'complimentary') return T.statusComplimentary;
    if (subscription.status === 'cancelled' && subscription.currentPeriodEnd) {
      return fill(T.statusCancelled, {
        date: new Date(subscription.currentPeriodEnd).toLocaleDateString(LOCALES[language]),
      });
    }
    return T.statusActive;
  })();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rise-in">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{T.checkoutTitle}</h1>
        <p className="mt-2 max-w-2xl text-slate-400">{T.checkoutSub}</p>
      </header>

      {access && currentPlan && (
        <div className="panel flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{T.currentPlanLabel}</p>
            <p className="mt-1 font-medium text-white">
              {currentPlan === 'full' ? T.planFull : T.planBasic}
              {statusText && <span className="ml-2 text-sm font-normal text-emerald-400">· {statusText}</span>}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {subscription?.hasPayPal && config?.manageUrl && (
              <a href={config.manageUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300">
                {T.manageSubscription} ↗
              </a>
            )}
            <Link href="/dashboard" className="btn-quiet">
              {T.goDashboard}
            </Link>
          </div>
        </div>
      )}

      {!complimentary && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {planCards.map((p) => {
              const selected = plan === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`panel text-left transition-colors ${
                    selected ? 'border-blue-500/60 bg-blue-500/[0.07]' : 'hover:border-slate-700'
                  } p-6`}
                  aria-pressed={selected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{p.name}</h2>
                      <p className="mt-0.5 text-sm text-slate-400">{p.forWho}</p>
                    </div>
                    <span
                      className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border ${
                        selected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                      }`}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </div>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-semibold text-white">${PLANS[p.id].price}</span>
                    <span className="text-slate-400">{L.perMonth}</span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {p.items.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-blue-400">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <div className="panel mx-auto max-w-md space-y-4 p-6">
            <p className="text-center text-sm text-slate-400">
              {T.selectedPlan}:{' '}
              <span className="font-medium text-white">
                {plan === 'full' ? L.fullName : L.basicName} · ${PLANS[plan].price}
                {L.perMonth}
              </span>
            </p>

            {!config ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              </div>
            ) : !config.configured ? (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-200">
                {T.paymentsNotReady}
              </p>
            ) : alreadyOnSelected ? (
              <p className="text-center text-sm text-emerald-400">{T.haveAccess}</p>
            ) : (
              <>
                {status === 'processing' && (
                  <p className="text-center text-sm text-slate-300">{T.processing}</p>
                )}
                {status === 'done' && <p className="text-center text-sm text-emerald-400">{T.activated}</p>}
                <div ref={buttonsRef} className={status === 'idle' ? '' : 'pointer-events-none opacity-50'} />
                {!config.live && <p className="text-center text-xs text-amber-300">{T.sandboxNote}</p>}
              </>
            )}

            {error && <p className="text-center text-sm text-amber-300">{error}</p>}
            <p className="text-center text-xs text-slate-500">{T.secureNote}</p>
          </div>
        </>
      )}

      {complimentary && (
        <div className="panel p-6 text-center">
          <p className="text-slate-300">{T.haveAccess}</p>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AppShell allowWithoutAccess>
      <Suspense fallback={null}>
        <Checkout />
      </Suspense>
    </AppShell>
  );
}
