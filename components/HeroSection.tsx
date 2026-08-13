"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DATELINE, HASHTAG } from "@/lib/assets";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      // Staggered load animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        sunRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2 }
      )
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.8"
        )
        .fromTo(
          ".hero-anim-item",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
          "-=0.5"
        );

      // Multi-layer Parallax scroll depth on background illustration
      if (sunRef.current && containerRef.current) {
        gsap.to(sunRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.3,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-svh w-full flex-col items-center justify-between overflow-hidden bg-hh-green px-5 pt-8 pb-16 text-center"
    >
      {/* Background Illustration with Bright Yellow Sun & Parallax */}
      <div
        ref={sunRef}
        style={{ willChange: "transform", transform: "translateZ(0)" }}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      >
        {/* Full-Color Background Illustration */}
        <Image
          src="/assets/brand/sun-rise.webp"
          alt="HH Goa Sunrise Motif"
          fill
          priority
          sizes="100vw"
          className="h-full w-full object-cover object-bottom"
        />

        {/* Radiant Bright Yellow Radial Sun Glow Filter over central sun focal point */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 h-85 w-85 rounded-full bg-hh-yellow/40 blur-[80px] pointer-events-none" />

        {/* Soft Feathered Sky Atmosphere Gradient (Top Only) - Feathered edgeless sky */}
        <div className="absolute inset-x-0 top-0 h-[60vh] bg-linear-to-b from-hh-green via-hh-green/50 to-transparent pointer-events-none" />
      </div>

      {/* Subtle Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 hh-grain opacity-25" />

      {/* Top Header Rail */}
      <header className="relative z-10 flex w-full max-w-7xl items-center justify-between py-2 px-2 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/brand/goa-hindi.svg"
            alt="गोवा"
            width={48}
            height={48}
            className="h-10 w-auto sm:h-12 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          />
          <div className="hidden text-left sm:block">
            <p className="text-[10px] font-bold tracking-[0.25em] text-hh-yellow">HACKER HOUSE</p>
            <p className="text-[9px] tracking-[0.2em] text-hh-cream/70">GOA · OCT 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden rounded-full border border-hh-line bg-hh-green-deep/90 px-4 py-1.5 text-[10px] font-bold tracking-[0.18em] text-hh-cream/90 md:inline-block shadow-md">
            {DATELINE}
          </span>
          <MagneticButton>
            <Link
              href="/generate"
              className="block rounded-full bg-hh-yellow px-6 py-2.5 text-xs font-bold tracking-[0.14em] text-hh-green transition-all hover:scale-105 hover:bg-white active:scale-95 shadow-xl"
            >
              CLAIM BADGE
            </Link>
          </MagneticButton>
        </div>
      </header>

      {/* Hero Central Content (Positioned in calm upper water/sky zone) */}
      <div ref={textContainerRef} className="relative z-10 my-auto flex max-w-5xl flex-col items-center pt-4 pb-6 px-4 text-center">
        {/* Pill Badge */}
        <div ref={badgeRef} className="mb-4 inline-flex items-center gap-2.5 rounded-full border border-hh-pink/60 bg-hh-green-dark/90 px-4 py-1.5 backdrop-blur-md shadow-lg">
          <span className="h-2 w-2 rounded-full bg-hh-pink animate-pulse" />
          <span className="text-[11px] font-bold tracking-[0.22em] text-hh-yellow">{HASHTAG}</span>
          <span className="text-hh-cream/40">·</span>
          <span className="text-[11px] font-bold tracking-[0.16em] text-hh-pink uppercase">TASK #1 LIVE</span>
        </div>

        {/* Single-Weight Kicker Line */}
        <p className="hero-anim-item text-xs font-bold tracking-[0.35em] text-hh-yellow uppercase drop-shadow">
          HACKER HOUSE GOA 2026
        </p>

        {/* GIGANTIC Single Dominant Display Headline */}
        <h1
          className="hero-anim-item hh-display mt-3 text-5xl text-hh-cream sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
        >
          FRAME IN GOA
        </h1>

        {/* High-Contrast Subheadline in Calm Upper Atmosphere */}
        <p className="hero-anim-item mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-hh-cream font-mono font-medium leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          The premier residency for elite builders & hackers. 4 days of intense code, high-stakes bounties, and ocean waves.
        </p>

        {/* CTA Buttons */}
        <div className="hero-anim-item mt-8 flex flex-wrap items-center justify-center gap-5">
          <MagneticButton>
            <Link
              href="/generate"
              className="group flex items-center gap-3 rounded-2xl bg-hh-yellow px-8 py-4 text-sm font-bold tracking-[0.14em] text-hh-green transition-all hover:bg-hh-cream hover:shadow-2xl active:scale-95 shadow-xl"
            >
              <span>GENERATE BADGE</span>
              <span className="transition-transform group-hover:translate-x-1.5">→</span>
            </Link>
          </MagneticButton>

          <button
            onClick={() => scrollToSection("agenda-section")}
            className="rounded-2xl border-2 border-hh-cream/40 bg-hh-green-dark/80 px-8 py-4 text-sm font-bold tracking-[0.14em] text-hh-cream backdrop-blur-md transition-all hover:border-hh-pink hover:text-hh-pink active:scale-95 shadow-lg"
          >
            VIEW AGENDA
          </button>
        </div>
      </div>

      {/* Hero Bottom Bar & Dateline */}
      <div className="relative z-10 flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-hh-line pt-6 px-2 sm:px-6 sm:flex-row">
        <p className="text-[11px] tracking-[0.2em] text-hh-cream/70 drop-shadow">
          GOA, INDIA · 28 – 31 OCT 2026
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.18em] text-hh-cream/60">ORGANIZED BY</span>
          <Image
            src="/assets/brand/247-studio-mark.svg"
            alt="2:47PM Studio"
            width={80}
            height={30}
            className="h-4 w-auto opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </section>
  );
}
