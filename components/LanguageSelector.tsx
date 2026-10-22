'use client';

import { useLanguage } from '@/lib/useLanguage';

export function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => changeLanguage(e.target.value as any)}
      className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm hover:border-blue-500 focus:outline-none focus:border-blue-500 transition"
    >
      <option value="es">🇪🇸 Español</option>
      <option value="en">🇬🇧 English</option>
      <option value="ru">🇷🇺 Русский</option>
      <option value="tr">🇹🇷 Türkçe</option>
      <option value="az">🇦🇿 Azərbaycanca</option>
    </select>
  );
}
