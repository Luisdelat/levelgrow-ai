'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  };

  const fontSize = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const dimensions = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        width={dimensions.width}
        height={dimensions.height}
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#grad1)" strokeWidth="1" opacity="0.2" />
        <g transform="translate(100, 100)">
          <path d="M -45 30 Q -20 -20 20 -35 Q 45 -40 50 -20" fill="none" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="-45" cy="30" r="6" fill="url(#grad1)" />
          <circle cx="-45" cy="30" r="3.5" fill="white" opacity="0.8" />
          <circle cx="-15" cy="-8" r="7" fill="url(#grad2)" />
          <circle cx="-15" cy="-8" r="4" fill="white" opacity="0.8" />
          <circle cx="25" cy="-30" r="7.5" fill="url(#grad1)" />
          <circle cx="25" cy="-30" r="4.5" fill="white" opacity="0.8" />
          <circle cx="50" cy="-20" r="6" fill="url(#grad2)" />
          <circle cx="50" cy="-20" r="3.5" fill="white" opacity="0.8" />
          <line x1="-45" y1="30" x2="-15" y2="-8" stroke="url(#grad1)" strokeWidth="1.5" opacity="0.4" />
          <line x1="-15" y1="-8" x2="25" y2="-30" stroke="url(#grad2)" strokeWidth="1.5" opacity="0.4" />
          <line x1="25" y1="-30" x2="50" y2="-20" stroke="url(#grad1)" strokeWidth="1.5" opacity="0.4" />
          <line x1="-45" y1="30" x2="25" y2="-30" stroke="url(#grad1)" strokeWidth="1" opacity="0.2" />
          <path d="M 60 0 L 75 -15 L 75 5" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
        </g>
      </svg>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent ${fontSize[size]}`}>
          LEVELGROW AI
        </span>
      )}
    </div>
  );
}
