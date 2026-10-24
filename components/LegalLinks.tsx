'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/useLanguage';
import { LEGAL_UI } from '@/lib/legal';

/** Small row of links to the legal documents, for page footers. */
export default function LegalLinks({ className = '' }: { className?: string }) {
  const { language } = useLanguage();
  const U = LEGAL_UI[language];
  const links: [string, string][] = [
    ['/legal/terminos', U.terms],
    ['/legal/privacidad', U.privacy],
    ['/legal/reembolsos', U.refunds],
    ['/legal/ia', U.ai],
  ];
  return (
    <nav className={`flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 ${className}`}>
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="hover:text-slate-300">
          {label}
        </Link>
      ))}
    </nav>
  );
}
