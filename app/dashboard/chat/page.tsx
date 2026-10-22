'use client';

import AppShell from '@/components/AppShell';
import AdvisorChat from '@/components/AdvisorChat';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT } from '@/lib/app-text';
import { FREE_CHAT_ID } from '@/lib/stages';

function FreeAdvisor() {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="rise-in">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{T.advisorTitle}</h1>
        <p className="mt-1 text-slate-400">{T.advisorSub}</p>
      </header>
      <AdvisorChat channel={FREE_CHAT_ID} className="min-h-[60vh]" />
    </div>
  );
}

export default function ChatPage() {
  return (
    <AppShell>
      <FreeAdvisor />
    </AppShell>
  );
}
