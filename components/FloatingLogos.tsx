'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import LogoMark from './LogoMark';

interface Floater {
  top: string;
  left: string;
  size: number;
  /** 0 = far (small parallax, blurred, faint), 1 = near. */
  depth: number;
  duration: number;
  delay: number;
  spin?: boolean;
  animated?: boolean;
  hideOnMobile?: boolean;
}

const LANDING: Floater[] = [
  { top: '8%', left: '72%', size: 620, depth: 0.15, duration: 22, delay: 0, animated: true },
  { top: '62%', left: '-8%', size: 300, depth: 0.35, duration: 18, delay: -4, spin: true },
  { top: '20%', left: '6%', size: 90, depth: 0.7, duration: 12, delay: -2, animated: true, hideOnMobile: true },
  { top: '78%', left: '78%', size: 140, depth: 0.55, duration: 15, delay: -7, animated: true },
  { top: '44%', left: '48%', size: 60, depth: 0.9, duration: 10, delay: -1, hideOnMobile: true },
  { top: '4%', left: '36%', size: 46, depth: 1, duration: 9, delay: -3, animated: true, hideOnMobile: true },
  { top: '88%', left: '30%', size: 72, depth: 0.8, duration: 11, delay: -5, spin: true },
  { top: '34%', left: '90%', size: 54, depth: 0.95, duration: 8, delay: -6, animated: true, hideOnMobile: true },
];

const COMPACT: Floater[] = [
  { top: '-6%', left: '62%', size: 520, depth: 0.15, duration: 22, delay: 0, animated: true },
  { top: '64%', left: '-10%', size: 280, depth: 0.35, duration: 18, delay: -4, spin: true },
  { top: '14%', left: '8%', size: 80, depth: 0.75, duration: 11, delay: -2, animated: true },
  { top: '80%', left: '80%', size: 110, depth: 0.6, duration: 14, delay: -6, animated: true },
  { top: '46%', left: '88%', size: 48, depth: 1, duration: 9, delay: -3, hideOnMobile: true },
  { top: '90%', left: '36%', size: 56, depth: 0.85, duration: 10, delay: -5, spin: true, hideOnMobile: true },
];

/**
 * LEVELGROW logos floating at different depths. They drift on their own and
 * shift with the pointer (parallax), so near logos move more than far ones.
 */
export default function FloatingLogos({ variant = 'landing' }: { variant?: 'landing' | 'compact' }) {
  const ref = useRef<HTMLDivElement>(null);
  const floaters = variant === 'landing' ? LANDING : COMPACT;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty('--px', x.toFixed(4));
      el.style.setProperty('--py', y.toFixed(4));
      el.style.setProperty('--sy', String(window.scrollY));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {floaters.map((f, i) => (
        <div
          key={i}
          className={`lg-parallax absolute ${f.hideOnMobile ? 'hidden sm:block' : ''}`}
          style={
            {
              top: f.top,
              left: f.left,
              '--depth': f.depth,
              opacity: 0.1 + f.depth * 0.22,
              filter: f.depth < 0.3 ? 'blur(1px)' : f.depth < 0.5 ? 'blur(0.5px)' : undefined,
            } as CSSProperties
          }
        >
          <div
            className={f.spin ? 'lg-drift lg-spin' : 'lg-drift'}
            style={{ animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s` }}
          >
            <LogoMark size={f.size} animated={f.animated} />
          </div>
        </div>
      ))}
    </div>
  );
}
