import { useState, useEffect, useCallback } from 'react';
import { translations, Language, LANGUAGES } from './translations';

export { LANGUAGES };
const STORAGE_KEY = 'language';
const CHANGE_EVENT = 'lg-language-change';

function readStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && LANGUAGES.includes(saved)) return saved;
  } catch {
    // localStorage unavailable (private mode, etc.)
  }
  return 'es';
}

/**
 * Shared language state. Every component that calls this hook stays in sync:
 * changing the language in the selector re-renders all open pages at once.
 */
export function useLanguage() {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    setLanguage(readStoredLanguage());

    const onChange = (e: Event) => {
      const lang = (e as CustomEvent<Language>).detail;
      if (LANGUAGES.includes(lang)) setLanguage(lang);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setLanguage(readStoredLanguage());
    };

    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = useCallback((lang: Language) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent<Language>(CHANGE_EVENT, { detail: lang }));
  }, []);

  const t = (key: keyof typeof translations['es']): string => {
    return translations[language][key] || translations.es[key] || key;
  };

  return { language, changeLanguage, t };
}
