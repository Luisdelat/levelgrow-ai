'use client';

import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';
import type { Language } from '@/lib/translations';

const TEXT: Record<Language, { label: string; live: string; lines: string[] }> = {
  es: {
    label: 'Tu asesor IA',
    live: 'en vivo',
    lines: [
      'Analizando tu negocio… Tu cliente ideal: dueñas de spa en Miami, 30–45 años, que quieren llenar su agenda.',
      'Gancho para tu próximo reel: «Tu agenda vacía no es mala suerte. Es falta de un sistema.»',
      'Oferta sugerida: diagnóstico gratis de 15 min + paquete de 3 sesiones con garantía.',
      'Tu plan de 30 días está listo: 12 reels, 3 anuncios y 1 guion de ventas. ¿Empezamos?',
    ],
  },
  en: {
    label: 'Your AI advisor',
    live: 'live',
    lines: [
      'Analyzing your business… Your ideal client: spa owners in Miami, 30–45, who want a full calendar.',
      'Hook for your next reel: "An empty calendar is not bad luck. It is the lack of a system."',
      'Suggested offer: free 15-min diagnosis + a 3-session package with a guarantee.',
      'Your 30-day plan is ready: 12 reels, 3 ads and 1 sales script. Shall we start?',
    ],
  },
  ru: {
    label: 'Ваш ИИ-советник',
    live: 'в эфире',
    lines: [
      'Анализирую ваш бизнес… Идеальный клиент: владелицы спа в Майами, 30–45 лет, которые хотят полную запись.',
      'Хук для следующего рилс: «Пустая запись — это не невезение. Это отсутствие системы».',
      'Предлагаемое предложение: бесплатная 15-минутная диагностика + пакет из 3 сеансов с гарантией.',
      'Ваш план на 30 дней готов: 12 рилс, 3 объявления и 1 скрипт продаж. Начнём?',
    ],
  },
  tr: {
    label: 'Yapay zekâ danışmanın',
    live: 'canlı',
    lines: [
      'İşletmen analiz ediliyor… İdeal müşterin: Miami\'de 30–45 yaş arası, takvimini doldurmak isteyen spa sahipleri.',
      'Bir sonraki reels için kanca: "Boş takvim kötü şans değil. Sistem eksikliği."',
      'Önerilen teklif: ücretsiz 15 dk analiz + garantili 3 seanslık paket.',
      '30 günlük planın hazır: 12 reels, 3 reklam ve 1 satış metni. Başlayalım mı?',
    ],
  },
  az: {
    label: 'Süni intellekt məsləhətçiniz',
    live: 'canlı',
    lines: [
      'Biznesiniz təhlil edilir… İdeal müştəriniz: Mayamidə 30–45 yaşlı, cədvəlini doldurmaq istəyən spa sahibləri.',
      'Növbəti reels üçün qarmaq: «Boş cədvəl bədbəxtlik deyil. Sistemin olmamasıdır.»',
      'Təklif olunan təklif: pulsuz 15 dəq. diaqnostika + zəmanətli 3 seanslıq paket.',
      '30 günlük planınız hazırdır: 12 reels, 3 reklam və 1 satış ssenarisi. Başlayaq?',
    ],
  },
};

/** A small panel where the AI "writes" example answers, one after another. */
export default function AIThinking({ language, className = '' }: { language: Language; className?: string }) {
  const t = TEXT[language] ?? TEXT.es;
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  const [thinking, setThinking] = useState(true);

  useEffect(() => {
    setLine(0);
    setChars(0);
    setThinking(true);
  }, [language]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setThinking(false);
      setChars(t.lines[line].length);
      return;
    }
    const full = t.lines[line];
    let timer: ReturnType<typeof setTimeout>;
    if (thinking) {
      timer = setTimeout(() => setThinking(false), 1100);
    } else if (chars < full.length) {
      timer = setTimeout(() => setChars((c) => c + 1), 18 + Math.random() * 30);
    } else {
      timer = setTimeout(() => {
        setLine((l) => (l + 1) % t.lines.length);
        setChars(0);
        setThinking(true);
      }, 2600);
    }
    return () => clearTimeout(timer);
  }, [thinking, chars, line, t]);

  return (
    <div className={`ai-ring rounded-2xl ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0d1322]/85 p-4 backdrop-blur-md sm:p-5">
        <div className="ai-scan" />
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/30">
            <LogoMark size={22} compact animated />
          </span>
          <span className="text-sm font-semibold text-white">{t.label}</span>
          <span className="ml-auto flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t.live}
          </span>
        </div>
        <p className="mt-3 min-h-[4.5em] text-[15px] leading-relaxed text-slate-200" aria-live="off">
          {thinking ? (
            <span className="inline-flex gap-1 pt-2">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-blue-400" style={{ animationDelay: '0.15s' }} />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-blue-400" style={{ animationDelay: '0.3s' }} />
            </span>
          ) : (
            <>
              {t.lines[line].slice(0, chars)}
              <span className="ai-caret" />
            </>
          )}
        </p>
        <div className="mt-3 flex gap-1.5">
          {t.lines.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= line ? 'bg-blue-500/70' : 'bg-slate-800'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
