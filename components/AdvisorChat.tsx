'use client';

import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LogoMark from './LogoMark';
import { authHeaders } from '@/lib/api-client';
import { useLanguage } from '@/lib/useLanguage';
import { APP_TEXT, fill } from '@/lib/app-text';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ERROR_MARKER = '[[ADVISOR_ERROR]]';

interface AdvisorChatProps {
  /** Stage id, or "libre" for the free-form advisor. */
  channel: string;
  /** Called whenever the number of user messages changes. */
  onUserMessageCount?: (count: number) => void;
  className?: string;
}

export default function AdvisorChat({ channel, onUserMessageCount, className = '' }: AdvisorChatProps) {
  const { language } = useLanguage();
  const T = APP_TEXT[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{ plan: string; limit: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const kickedOff = useRef(false);
  const languageRef = useRef(language);
  languageRef.current = language;

  useEffect(() => {
    onUserMessageCount?.(messages.filter((m) => m.role === 'user').length);
  }, [messages, onUserMessageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  /** Sends a turn (or the opening kickoff) and streams the reply in. */
  const send = useCallback(
    async (text: string | null) => {
      setBusy(true);
      setError(false);
      setLimitInfo(null);
      const replyId = `a-${Date.now()}`;
      const userMsgId = `u-${Date.now()}`;
      if (text) {
        setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: text }]);
      }
      setMessages((prev) => [...prev, { id: replyId, role: 'assistant', content: '' }]);

      try {
        const res = await fetch('/api/advisor', {
          method: 'POST',
          headers: { ...authHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(
            text
              ? { stage: channel, message: text, language: languageRef.current }
              : { stage: channel, kickoff: true, language: languageRef.current },
          ),
        });
        if (res.status === 402) {
          // Monthly message limit reached: the message was not saved.
          const data = await res.json().catch(() => ({}));
          if (data.error === 'payment_required') {
            window.location.href = '/checkout';
            return;
          }
          setMessages((prev) => prev.filter((m) => m.id !== replyId && m.id !== userMsgId));
          if (text) setInput(text);
          setLimitInfo({ plan: data.plan ?? 'basic', limit: data.limit ?? 0 });
          return;
        }
        if (!res.ok || !res.body) throw new Error(`advisor ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          const visible = full.replace(ERROR_MARKER, '').trimEnd();
          setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content: visible } : m)));
        }
        if (full.includes(ERROR_MARKER)) {
          const clean = full.replace(ERROR_MARKER, '').trim();
          if (!clean) setMessages((prev) => prev.filter((m) => m.id !== replyId));
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setMessages((prev) => prev.filter((m) => m.id !== replyId));
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [channel],
  );

  // Load the saved conversation; open the stage if it is empty.
  useEffect(() => {
    let cancelled = false;
    kickedOff.current = false;
    setLoaded(false);
    setMessages([]);
    (async () => {
      try {
        const res = await fetch(`/api/advisor?stage=${encodeURIComponent(channel)}`, {
          headers: authHeaders(),
          cache: 'no-store',
        });
        const data = res.ok ? await res.json() : { messages: [] };
        if (cancelled) return;
        const history: ChatMessage[] = (data.messages ?? []).map(
          (m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          }),
        );
        setMessages(history);
        setLoaded(true);
        // The last message has no reply (for example the connection dropped):
        // offer to retry instead of leaving the user waiting.
        if (history[history.length - 1]?.role === 'user') setError(true);
        if (history.length === 0 && !kickedOff.current) {
          kickedOff.current = true;
          send(null);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setLoaded(true);
          setError(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [channel, send]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    send(text);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const retry = () => {
    if (messages.length === 0) {
      send(null);
      return;
    }
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      // The user turn is already saved; re-send it so the advisor answers.
      setMessages((prev) => prev.filter((m) => m.id !== lastUser.id));
      send(lastUser.content);
    }
  };

  const last = messages[messages.length - 1];
  const waitingFirstToken = busy && last?.role === 'assistant' && last.content === '';

  return (
    <div className={`panel flex min-h-[520px] flex-col overflow-hidden ${className}`}>
      <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6">
        {!loaded && (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          </div>
        )}

        {messages.map((m) =>
          m.role === 'assistant' ? (
            m.content ? (
              <div key={m.id} className="rise-in flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
                  <LogoMark size={22} compact />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-medium text-slate-400">{T.advisorName}</p>
                  <div className="advisor-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ) : null
          ) : (
            <div key={m.id} className="rise-in flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-blue-600/90 px-4 py-3 text-[15px] leading-relaxed text-white">
                {m.content}
              </div>
            </div>
          ),
        )}

        {waitingFirstToken && (
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-950">
              <LogoMark size={22} compact animated />
            </div>
            <span className="flex gap-1">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: '0.15s' }} />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-slate-400" style={{ animationDelay: '0.3s' }} />
            </span>
            <span>{T.thinking}</span>
          </div>
        )}

        {limitInfo && (
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
            {fill(limitInfo.plan === 'full' ? T.limitFull : T.limitBasic, { limit: limitInfo.limit })}
            {limitInfo.plan !== 'full' && (
              <a href="/checkout?plan=full" className="ml-2 font-semibold text-white underline">
                {T.upgradeCta}
              </a>
            )}
          </div>
        )}

        {error && !busy && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <span>{T.advisorError}</span>
            <button onClick={retry} className="font-semibold text-amber-100 underline">
              {T.retry}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={submit} className="border-t border-slate-800 bg-slate-950/40 p-3 sm:p-4">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={T.inputPlaceholder}
            rows={1}
            maxLength={4000}
            disabled={!loaded}
            className="field max-h-40 min-h-[48px] resize-y"
          />
          <button type="submit" disabled={busy || !input.trim()} className="btn-accent h-12 px-4">
            <span className="hidden sm:inline">{T.send}</span>
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M2.94 2.94a1 1 0 0 1 1.06-.22l13 5.2a1 1 0 0 1 0 1.86l-13 5.2A1 1 0 0 1 2.66 13.7L4.2 10 2.66 6.3a1 1 0 0 1 .28-1.14ZM5.6 11l-.98 2.36L14.6 10 4.62 6.64 5.6 9H10a1 1 0 1 1 0 2H5.6Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
