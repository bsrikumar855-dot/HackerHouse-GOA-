"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WaveDivider from "./WaveDivider";

gsap.registerPlugin(ScrollTrigger);

type AgendaDay = {
  day: string;
  date: string;
  title: string;
  tagline: string;
  highlights: string[];
};

const AGENDA: AgendaDay[] = [
  {
    day: "DAY 01",
    date: "28 OCT 2026",
    title: "GENESIS",
    tagline: "Arrival, team formation & strategic briefing",
    highlights: [
      "Check-in & Residency Pass Verification",
      "Opening Keynote & Sponsor Bounty Drop",
      "Solo Hacker Team Matching & Speed Mixer",
      "Late-Night Ideation & Architecture Mapping",
    ],
  },
  {
    day: "DAY 02",
    date: "29 OCT 2026",
    title: "DAY OF TRIANGLE",
    tagline: "Deep technical workshops & mentor reviews",
    highlights: [
      "Protocol Deep-Dives & Smart Contract Security",
      "1-on-1 Office Hours with Lead Engineers",
      "Milestone #1 Code Check-In & Feasibility Review",
      "Goan Seafood Barbecue & Networking Dinner",
    ],
  },
  {
    day: "DAY 03",
    date: "30 OCT 2026",
    title: "BUILD DAY",
    tagline: "24-hour non-stop build sprint",
    highlights: [
      "24-Hour Code Sprint Begins",
      "Live Debugging Clinics & Mentor Support",
      "Midnight Energy Drop & Hackathon Playlist",
      "Final Integration & Pitch Deck Prep",
    ],
  },
  {
    day: "DAY 04",
    date: "31 OCT 2026",
    title: "LAUNCH DAY",
    tagline: "Live demos, judging & closing celebration",
    highlights: [
      "Code Freeze & Project Submission",
      "Live Demo Pitches to Jury & VC Partners",
      "Award Ceremony & $50k+ Bounty Distribution",
      "Sunset Beach Party & Residency Closing",
    ],
  },
];

export default function AgendaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth - 80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 0.5,
          end: () => `+=${totalWidth + 400}`,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="agenda-section"
      ref={sectionRef}
      className="relative z-10 min-h-svh w-full overflow-hidden bg-hh-cream text-hh-green flex flex-col justify-between py-2 sm:py-4"
    >
      {/* Top Wave Transition: Green from StatsStrip to Cream */}
      <WaveDivider fillColor="text-hh-green-dark" flip className="shrink-0" />

      {/* Center Content */}
      <div className="my-auto flex flex-col justify-center w-full py-4">
        {/* Section Header */}
        <div className="mx-auto max-w-7xl px-6 mb-6 text-center sm:text-left">
          <p className="text-xs font-bold tracking-[0.25em] text-hh-pink uppercase font-mono">INSIDE THE ROOM</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
            <h2 className="hh-display text-4xl text-hh-green sm:text-5xl md:text-6xl">
              4-DAY AGENDA
            </h2>
            <p className="text-xs sm:text-sm text-hh-green-deep/80 font-mono max-w-md">
              Scroll vertically to scrub through the 4-day sequence →
            </p>
          </div>
        </div>

        {/* Pinned Horizontal Track */}
        <div className="relative w-full overflow-visible py-2">
          <div
            ref={trackRef}
            style={{ willChange: "transform", transform: "translateZ(0)" }}
            className="flex gap-8 px-6 sm:px-16 w-max items-center"
          >
            {AGENDA.map((item, i) => {
              const isAsymmetricTall = i % 2 === 1;

              return (
                <div
                  key={i}
                  className={[
                    "agenda-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-hh-green/20 bg-white p-6 sm:p-8 text-hh-green shadow-2xl transition-all duration-300 hover:border-hh-pink shrink-0",
                    isAsymmetricTall ? "w-[320px] sm:w-95 h-107.5 sm:h-115" : "w-75 sm:w-90 h-97.5 sm:h-105",
                  ].join(" ")}
                >
                  {/* Hot Pink Top Accent Bar */}
                  <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-hh-pink via-hh-yellow to-hh-pink" />

                  <div>
                    <div className="flex items-center justify-between border-b border-hh-green/10 pb-3 pt-1">
                      <span className="rounded-full bg-hh-pink px-3.5 py-1 text-[11px] font-bold tracking-[0.16em] text-hh-cream shadow-sm">
                        {item.day}
                      </span>
                      <span className="text-[10px] font-bold tracking-[0.14em] text-hh-green/60 font-mono">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="hh-display mt-4 text-2xl sm:text-3xl text-hh-green group-hover:text-hh-pink transition-colors">
                      {item.title}
                    </h3>

                    <p className="mt-1.5 text-xs font-bold text-hh-pink font-mono">
                      {item.tagline}
                    </p>

                    <ul className="mt-4 flex flex-col gap-2.5 font-mono">
                      {item.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-hh-green/85">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-hh-pink" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-hh-green/10 pt-3 text-right">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-hh-green/50 font-mono">
                      DAY {i + 1} OF 4
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Wave Transition: Cream to Dark Green TaskSection */}
      <WaveDivider fillColor="text-hh-green-deep" className="shrink-0" />
    </section>
  );
}

