'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/useLanguage';
import { LanguageSelector } from '@/components/LanguageSelector';
import LogoMark from '@/components/LogoMark';
import AuthBackdrop from '@/components/AuthBackdrop';
import AIThinking from '@/components/AIThinking';
import { LANDING_TEXT } from '@/lib/landing-text';
import { PLANS, launchPromoActive } from '@/lib/plans';
import { PROMO_TEXT, promoFill } from '@/lib/promo-text';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') === 'full' ? 'full' : 'basic';
  const { t, language } = useLanguage();
  const [promo, setPromo] = useState(true);
  useEffect(() => setPromo(launchPromoActive()), []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    plan: planParam,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const ERRORS: Record<string, string> = {
    invalid_email: t('invalidEmail'),
    weak_password: t('weakPassword'),
    terms_required: t('mustAcceptTerms'),
    email_taken: t('emailAlreadyRegistered'),
    too_many_attempts: t('tooManyAttempts'),
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError(t('weakPassword'));
      setLoading(false);
      return;
    }
    if (!acceptTerms) {
      setError(t('mustAcceptTerms'));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          plan: formData.plan,
          acceptTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(ERRORS[data.error] || t('connectionError'));
        return;
      }

      localStorage.setItem('token', data.token);
      router.push(`/checkout?plan=${formData.plan === 'full' ? 'full' : 'basic'}`);
    } catch (err) {
      setError(t('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-bg relative isolate flex min-h-screen flex-col items-center justify-center overflow-x-hidden p-4 py-16">
      <AuthBackdrop />
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="grid w-full max-w-md items-center gap-10 lg:max-w-5xl lg:grid-cols-[1fr_28rem]">
        {/* While they sign up, the AI is already working (desktop) */}
        <div className="rise-in hidden lg:block">
          <LogoMark size={72} animated />
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-tight text-white">
            LEVELGROW <span className="ai-text">AI</span>
          </h2>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-slate-400">{LANDING_TEXT[language].heroTitle}</p>
          <AIThinking language={language} className="mt-8 max-w-md" />
        </div>

        <div className="ai-ring rise-in rounded-2xl" style={{ animationDelay: '100ms' }}>
        <div className="card bg-slate-900/70 backdrop-blur-xl">
          <div className="mb-2 flex justify-center lg:hidden">
            <LogoMark size={56} animated />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-center">
            LEVELGROW <span className="ai-text">AI</span>
          </h1>
          <p className="text-gray-400 text-center mb-8">{t('createAccount')}</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input w-full pr-10"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t('confirmPassword')}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input w-full pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium mb-3">{t('choosePlan')}</p>
              <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={t('choosePlan')}>
                {(['basic', 'full'] as const).map((id) => {
                  const selected = formData.plan === id;
                  const showPromo = promo && id === 'basic';
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setFormData((prev) => ({ ...prev, plan: id }))}
                      className={`relative flex flex-col items-start rounded-xl border p-3.5 pt-4 text-left transition-all duration-200 ${
                        selected
                          ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_24px_rgba(59,130,246,0.25)]'
                          : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                      }`}
                    >
                      {showPromo && (
                        <span className="absolute -top-2.5 left-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          {PROMO_TEXT[language].badge}
                        </span>
                      )}
                      {id === 'full' && (
                        <span className="absolute -top-2.5 left-3 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          {LANDING_TEXT[language].recommended}
                        </span>
                      )}
                      <span
                        className={`absolute right-3 top-3.5 flex h-4 w-4 items-center justify-center rounded-full border ${
                          selected ? 'border-blue-500 bg-blue-500' : 'border-slate-600'
                        }`}
                      >
                        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="text-sm font-semibold text-white">{id === 'full' ? t('fullPlan') : t('basicPlan')}</span>
                      <span className="mt-1.5 flex items-baseline gap-0.5">
                        <span className="text-2xl font-bold text-white">${PLANS[id].price}</span>
                        <span className="text-xs text-slate-400">{t('perMonth')}</span>
                      </span>
                      <span className={`mt-1 text-[11px] leading-snug ${showPromo ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {showPromo
                          ? promoFill(PROMO_TEXT[language].registerOption, { price: PLANS.basic.price })
                          : LANDING_TEXT[language][id === 'full' ? 'fullFor' : 'basicFor']}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-gray-300 leading-relaxed cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-blue-500"
                required
              />
              <span>
                {t('acceptTermsPre')}{' '}
                <Link href="/legal/terminos" target="_blank" className="text-blue-400 underline hover:text-blue-300">
                  {t('termsLink')}
                </Link>{' '}
                {t('andWord')}{' '}
                <Link href="/legal/privacidad" target="_blank" className="text-blue-400 underline hover:text-blue-300">
                  {t('privacyLink')}
                </Link>
                {t('acceptTermsPost')}
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6"
            >
              {loading ? t('signUp') + '...' : t('signUp')}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            {t('haveAccount')}{' '}
            <Link href="/auth/login" className="text-blue-500 hover:text-blue-400">
              {t('signInHere')}
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
