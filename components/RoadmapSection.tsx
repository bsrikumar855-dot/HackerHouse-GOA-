"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type StageStatus = "COMPLETED" | "ACTIVE" | "UPCOMING";

type Stage = {
  num: string;
  title: string;
  desc: string;
  status: StageStatus;
};

// Timeline State Logic: Exactly ONE stage is CURRENT/ACTIVE (Stage 02), prior is COMPLETED, future are UPCOMING
const STAGES: Stage[] = [
  { num: "01", title: "Registration", desc: "Open applications & initial profile evaluation.", status: "COMPLETED" },
  { num: "02", title: "Open Trials", desc: "Async coding challenges & Task #1 badge submission.", status: "ACTIVE" },
  { num: "03", title: "Alpha Selection", desc: "First wave of invited builders confirmed & notified.", status: "UPCOMING" },
  { num: "04", title: "Beta Selection", desc: "Second wave invitations & team pairing sessions.", status: "UPCOMING" },
  { num: "05", title: "Charlie Selection", desc: "Final competitive slot assignments.", status: "UPCOMING" },
  { num: "06", title: "Partner Trials", desc: "Sponsor bounty prep & technical architecture alignment.", status: "UPCOMING" },
  { num: "07", title: "Residency (Goa)", desc: "4 days of live building at Hacker House Goa (Oct 28–31).", status: "UPCOMING" },
];

export default function RoadmapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 0.3,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-10 w-full overflow-hidden bg-linear-to-b from-hh-green-dark via-hh-green to-hh-green-dark px-5 py-24"
    >
      {/* Full-Bleed Blended Goan Palm Landscape Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-15">
        <Image
          src="/assets/brand/footer-trees-900.png"
          alt=""
          fill
          sizes="100vw"
          className="h-full w-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-linear-to-b from-hh-green-dark via-transparent to-hh-green-dark" />
      </div>

      {/* Dot Matrix Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 hh-dot-grid opacity-25" />

      {/* Central Radiant Glow Behind Timeline Spine */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-150 w-75 rounded-full bg-hh-pink/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="mb-20 text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-hh-pink uppercase font-mono">ROADMAP</p>
          <h2 className="hh-display mt-2 text-4xl text-hh-cream sm:text-5xl md:text-6xl">
            SELECTION TIMELINE
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-hh-cream/80 font-mono">
            7 stages from open registration to the oceanfront residency in Goa.
          </p>
        </div>

        {/* Responsive Timeline Spine Track */}
        <div className="relative">
          {/* Background Spine Line (Left-aligned on mobile, centered on desktop) */}
          <div className="absolute top-0 bottom-0 left-5 md:left-1/2 w-1 -translate-x-1/2 bg-hh-line" />

          {/* Animated Fill Spine Line */}
          <div
            ref={lineRef}
            className="absolute top-0 bottom-0 left-5 md:left-1/2 w-1 -translate-x-1/2 bg-linear-to-b from-hh-yellow via-hh-pink to-hh-pink shadow-[0_0_20px_rgba(255,0,128,0.8)]"
          />

          <div className="flex flex-col gap-8 sm:gap-12">
            {STAGES.map((stage, i) => {
              const isCompleted = stage.status === "COMPLETED";
              const isActive = stage.status === "ACTIVE";
              const isEven = i % 2 === 0;

              return (
                <div
                  key={i}
                  className={[
                    "relative flex items-center w-full",
                    isEven ? "md:flex-row" : "md:flex-row-reverse",
                  ].join(" ")}
                >
                  {/* Node Marker (Left-aligned on mobile, centered on desktop) */}
                  <div
                    className={[
                      "absolute left-5 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xl z-20",
                      isActive
                        ? "bg-hh-pink text-hh-cream ring-4 ring-hh-pink/50 animate-pulse scale-110 sm:scale-125"
                        : isCompleted
                        ? "bg-hh-yellow text-hh-green"
                        : "border-2 border-hh-line bg-hh-green-deep text-hh-cream/50",
                    ].join(" ")}
                  >
                    {isCompleted ? "✓" : stage.num}
                  </div>

                  {/* Card Content (Indented left on mobile, alternating on desktop) */}
                  <div
                    className={[
                      "w-full md:w-1/2 pl-14 pr-2 sm:pl-16 sm:pr-4 md:px-8",
                      isEven ? "md:text-right" : "md:text-left",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "rounded-2xl sm:rounded-3xl border p-5 sm:p-7 backdrop-blur-md transition-all shadow-xl",
                        isActive
                          ? "border-2 border-hh-pink bg-hh-green-dark/95 shadow-[0_0_30px_rgba(255,0,128,0.3)]"
                          : isCompleted
                          ? "border-hh-yellow/60 bg-hh-green-deep/80"
                          : "border-hh-line bg-hh-green-dark/40 opacity-70",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex flex-wrap items-center gap-2.5",
                          isEven ? "md:justify-end" : "md:justify-start",
                        ].join(" ")}
                      >
                        <h3
                          className={[
                            "hh-display text-xl sm:text-2xl md:text-3xl",
                            isActive ? "text-hh-yellow" : isCompleted ? "text-hh-cream" : "text-hh-cream/70",
                          ].join(" ")}
                        >
                          {stage.title}
                        </h3>

                        <span
                          className={[
                            "rounded-full px-2.5 sm:px-3.5 py-0.5 sm:py-1 text-[9px] font-bold tracking-[0.18em] uppercase font-mono",
                            isActive
                              ? "bg-hh-pink text-hh-cream shadow-md"
                              : isCompleted
                              ? "bg-hh-yellow/20 text-hh-yellow border border-hh-yellow/40"
                              : "border border-hh-line text-hh-cream/40",
                          ].join(" ")}
                        >
                          {stage.status}
                        </span>
                      </div>

                      <p className="mt-2.5 text-xs sm:text-sm text-hh-cream/85 leading-relaxed font-mono">
                        {stage.desc}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for 50% split on desktop */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
