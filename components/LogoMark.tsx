'use client';

import { useId } from 'react';

interface LogoMarkProps {
  size?: number;
  /** Animated version: nodes pulse, the growth line draws itself. */
  animated?: boolean;
  /** Tight crop without the outer ring, for small sizes (avatars, header). */
  compact?: boolean;
  className?: string;
}

/** LEVELGROW AI symbol: a rising line of connected nodes ending in an arrow. */
export default function LogoMark({ size = 32, animated = false, compact = false, className = '' }: LogoMarkProps) {
  const uid = useId().replace(/:/g, '');
  const g1 = `lg-g1-${uid}`;
  const g2 = `lg-g2-${uid}`;
  const node = animated ? 'lg-node' : '';

  const nodes = [
    { cx: -45, cy: 30, r: 6, grad: g1, delay: '0s' },
    { cx: -15, cy: -8, r: 7, grad: g2, delay: '0.6s' },
    { cx: 25, cy: -30, r: 7.5, grad: g1, delay: '1.2s' },
    { cx: 50, cy: -20, r: 6, grad: g2, delay: '1.8s' },
  ];

  return (
    <svg
      viewBox={compact ? '48 52 132 100' : '0 0 200 200'}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={g1} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={g2} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      {!compact && (
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke={`url(#${g1})`}
          strokeWidth="1.2"
          opacity="0.35"
          className={animated ? 'lg-halo' : ''}
        />
      )}
      <g transform="translate(100, 100)">
        <path
          d="M -45 30 Q -20 -20 20 -35 Q 45 -40 50 -20"
          fill="none"
          stroke={`url(#${g1})`}
          strokeWidth="3.5"
          strokeLinecap="round"
          className={animated ? 'lg-path' : ''}
        />
        <line x1="-45" y1="30" x2="-15" y2="-8" stroke={`url(#${g1})`} strokeWidth="1.5" opacity="0.45" />
        <line x1="-15" y1="-8" x2="25" y2="-30" stroke={`url(#${g2})`} strokeWidth="1.5" opacity="0.45" />
        <line x1="25" y1="-30" x2="50" y2="-20" stroke={`url(#${g1})`} strokeWidth="1.5" opacity="0.45" />
        <line x1="-45" y1="30" x2="25" y2="-30" stroke={`url(#${g1})`} strokeWidth="1" opacity="0.25" />
        {nodes.map((n) => (
          <g key={`${n.cx}-${n.cy}`} className={node} style={animated ? { animationDelay: n.delay } : undefined}>
            <circle cx={n.cx} cy={n.cy} r={n.r} fill={`url(#${n.grad})`} />
            <circle cx={n.cx} cy={n.cy} r={n.r * 0.58} fill="white" opacity="0.85" />
          </g>
        ))}
        <path
          d="M 60 0 L 75 -15 L 75 5"
          fill="none"
          stroke={`url(#${g1})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
      </g>
    </svg>
  );
}
