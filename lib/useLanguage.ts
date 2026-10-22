import { useState, useEffect } from 'react';
import { translations, Language } from './translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    // Get language from localStorage or browser
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['es', 'ru', 'az', 'en', 'tr'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof typeof translations['es']): string => {
    return translations[language][key] || key;
  };

  return { language, changeLanguage, t };
}
