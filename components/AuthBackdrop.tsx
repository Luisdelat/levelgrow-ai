'use client';

import NeuralField from './NeuralField';
import FloatingLogos from './FloatingLogos';

/** Animated AI background for the sign-in and sign-up pages. */
export default function AuthBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="app-grid absolute inset-0" />
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      <NeuralField density={0.8} />
      <FloatingLogos variant="compact" />
    </div>
  );
}
