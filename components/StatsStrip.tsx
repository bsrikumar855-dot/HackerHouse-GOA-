"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
};

const STATS: Stat[] = [
  { value: 2500, suffix: "+", label: "REGISTRATIONS" },
  { value: 150, suffix: "+", label: "PROJECTS SHIPPED" },
  { value: 300, suffix: "+", label: "HACKERS IN ROOM" },
  { value: 50, prefix: "$", suffix: "k+", label: "BOUNTY POOL" },
];

export default function StatsStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(STATS.map((s) => s.value));

  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);

          const startTime = performance.now();
          const duration = 1400;

          const update = (now: number) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounts(STATS.map((s) => Math.floor(s.value * easeProgress)));

            if (progress < 1) {
              requestAnimationFrame(update);
            }
          };

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full overflow-hidden border-y border-hh-pink/30 bg-hh-green-dark px-4 py-12 sm:py-16"
    >
      {/* Background Subtle Sun Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-15">
        <div className="h-100 w-100 rounded-full bg-[radial-gradient(circle,var(--color-hh-yellow)_0%,transparent_70%)] animate-pulse" />
      </div>

      {/* Sleek 4-Card Responsive Grid */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="group relative flex flex-col items-center justify-center rounded-2xl border border-hh-pink/25 bg-hh-green-deep/90 p-5 sm:p-7 text-center shadow-xl backdrop-blur-md transition-all hover:border-hh-pink hover:-translate-y-1"
          >
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-linear-to-r from-hh-pink via-hh-yellow to-hh-pink opacity-70 group-hover:opacity-100 transition-opacity" />

            {/* Stat Number & Prefix/Suffix */}
            <div className="flex items-baseline justify-center gap-0.5 font-bold tracking-tight text-hh-yellow">
              {stat.prefix && (
                <span className="hh-display text-2xl sm:text-3xl font-bold text-hh-pink mr-0.5">
                  {stat.prefix}
                </span>
              )}
              <span className="hh-display text-4xl sm:text-5xl lg:text-6xl font-bold text-hh-yellow leading-none drop-shadow-md">
                {counts[i].toLocaleString()}
              </span>
              {stat.suffix && (
                <span className="hh-display text-xl sm:text-2xl font-bold text-hh-pink ml-0.5">
                  {stat.suffix}
                </span>
              )}
            </div>

            {/* Stat Label */}
            <p className="mt-3 w-full border-t border-hh-pink/20 pt-3 text-[11px] sm:text-xs font-bold tracking-[0.2em] text-hh-cream/85 uppercase font-mono">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

