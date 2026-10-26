'use client';

import { useEffect, useRef } from 'react';

/**
 * Full-screen animated "neural network": drifting nodes, links that light up,
 * signals that travel between nodes, and a pointer that attracts the network.
 * A click (or tap) fires a burst of signals from that point.
 * Pauses when the tab is hidden and renders a still frame for reduced motion.
 */
export default function NeuralField({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      phase: number;
    }
    interface Signal {
      a: number;
      b: number;
      t: number;
      speed: number;
    }
    interface Ripple {
      x: number;
      y: number;
      age: number;
    }

    let nodes: Node[] = [];
    let signals: Signal[] = [];
    const ripples: Ripple[] = [];
    const pointer = { x: -9999, y: -9999, active: false };
    const LINK = 150;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 16000)) * density);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.8 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      }));
      signals = [];
    };

    const nearest = (i: number): number => {
      let best = -1;
      let bestD = Infinity;
      const n = nodes[i];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const d = (nodes[j].x - n.x) ** 2 + (nodes[j].y - n.y) ** 2;
        if (d < bestD && d < LINK * LINK && Math.random() > 0.35) {
          bestD = d;
          best = j;
        }
      }
      return best;
    };

    const fire = (from: number) => {
      const to = nearest(from);
      if (to >= 0) signals.push({ a: from, b: to, t: 0, speed: 0.012 + Math.random() * 0.02 });
    };

    let last = performance.now();
    let raf = 0;
    let running = true;

    const draw = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // Move nodes; the pointer gently pulls nearby nodes towards it.
      for (const n of nodes) {
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d2 = dx * dx + dy * dy;
          const d = Math.sqrt(d2);
          if (d < 220 && d > 1) {
            // Pull from a distance, push away up close: nodes orbit the pointer instead of piling up.
            const force = d < 90 ? -0.02 : 0.006;
            n.vx += (dx / d) * force * dt;
            n.vy += (dy / d) * force * dt;
          }
        }
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.vx += (Math.random() - 0.5) * 0.01;
        n.vy += (Math.random() - 0.5) * 0.01;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }

      // Links.
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          let alpha = (1 - Math.sqrt(d2) / LINK) * 0.16;
          if (pointer.active) {
            const mx = (a.x + b.x) / 2 - pointer.x;
            const my = (a.y + b.y) / 2 - pointer.y;
            const pd = Math.sqrt(mx * mx + my * my);
            if (pd < 200) alpha += (1 - pd / 200) * 0.35;
          }
          ctx.strokeStyle = `rgba(96,165,250,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Nodes.
      for (const n of nodes) {
        const glow = 0.45 + 0.35 * Math.sin(now / 900 + n.phase);
        ctx.fillStyle = `rgba(147,197,253,${glow.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Signals travelling along links ("the AI thinking").
      if (signals.length < 26 && Math.random() < 0.18 * dt) fire(Math.floor(Math.random() * nodes.length));
      signals = signals.filter((s) => {
        s.t += s.speed * dt;
        const a = nodes[s.a];
        const b = nodes[s.b];
        if (!a || !b) return false;
        if (s.t >= 1) {
          if (Math.random() < 0.55) fire(s.b);
          return false;
        }
        const x = a.x + (b.x - a.x) * s.t;
        const y = a.y + (b.y - a.y) * s.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, 'rgba(191,219,254,0.95)');
        g.addColorStop(0.35, 'rgba(96,165,250,0.55)');
        g.addColorStop(1, 'rgba(59,130,246,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // Click ripples.
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.age += dt;
        const p = r.age / 70;
        if (p >= 1) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(96,165,250,${(0.5 * (1 - p)).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 20 + p * 220, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onDown = (e: PointerEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, age: 0 });
      // Fire signals from the nodes closest to the click.
      const close = nodes
        .map((n, i) => ({ i, d: (n.x - e.clientX) ** 2 + (n.y - e.clientY) ** 2 }))
        .sort((p, q) => p.d - q.d)
        .slice(0, 6);
      for (const c of close) fire(c.i);
    };
    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    if (reduced) {
      running = false;
      draw(performance.now());
    } else {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      document.addEventListener('visibilitychange', onVisibility);
      raf = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0" aria-hidden="true" />;
}
