"use client";

import Link from "next/link";
import Image from "next/image";
import { HASHTAG } from "@/lib/assets";
import MagneticButton from "./MagneticButton";

export default function TaskSection() {
  return (
    <section
      id="generator-section"
      className="relative z-10 w-full overflow-hidden bg-linear-to-b from-hh-green-dark via-hh-green-deep to-hh-green-dark px-5 py-24 text-hh-cream"
    >
      {/* Full-Bleed Blended Goan Palm Landscape Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20">
        <Image
          src="/assets/brand/footer-trees-900.png"
          alt=""
          fill
          sizes="100vw"
          className="h-full w-full object-cover object-bottom"
        />
        {/* Soft Feathering Gradient Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-hh-green-dark via-hh-green-deep/60 to-hh-green-dark" />
      </div>

      {/* Tech Grid Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 hh-tech-grid opacity-25" />

      {/* Ambient Neon Radial Glow Spotlights */}
      <div className="pointer-events-none absolute top-10 left-[-10%] h-125 w-125 rounded-full bg-hh-pink/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-[-10%] h-125 w-125 rounded-full bg-hh-yellow/15 blur-[120px]" />

      {/* Full-Bleed Edge-to-Edge Container */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Asymmetric 60/40 Split Layout */}
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column (~60% Width): Oversized Headline & Task Intro */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <span className="rounded-full bg-hh-pink px-4 py-1.5 text-xs font-bold tracking-[0.22em] text-hh-cream shadow-lg uppercase">
              SHORTLISTING TASK #1
            </span>

            <h2 className="hh-display mt-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.92] text-hh-cream drop-shadow-lg">
              CLAIM YOUR <br />
              <span className="text-hh-yellow">BUILDER BADGE</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-hh-cream/90 font-mono leading-relaxed max-w-xl">
              Turn any photo into an official HH Goa 2026 PFP frame, Builder ID card, or Team Frame in seconds. Post your badge with <strong className="text-hh-yellow">{HASHTAG}</strong> to complete Task #1 and claim your shortlisted pass.
            </p>

            <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border-2 border-hh-pink bg-hh-pink/15 px-6 py-4 shadow-xl">
              <span className="h-3 w-3 rounded-full bg-hh-pink animate-pulse" />
              <div>
                <p className="text-[10px] font-bold tracking-[0.22em] text-hh-pink font-mono">DEADLINE IST</p>
                <p className="text-sm font-bold text-hh-cream font-mono">AUG 13, 2026 · 11:59 PM IST</p>
              </div>
            </div>
          </div>

          {/* Right Column (~40% Width): Task Instructions & Generator CTA Block */}
          <div className="lg:col-span-5 flex flex-col gap-8 rounded-3xl border-2 border-hh-yellow/40 bg-hh-green-dark p-8 shadow-2xl backdrop-blur-md">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-hh-yellow uppercase">INSTRUCTIONS</p>
              <ul className="mt-4 flex flex-col gap-3 text-xs text-hh-cream/90 font-mono">
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-hh-pink">01.</span>
                  <span>Select PFP Frame, Builder ID card, or Team Frame mode.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-hh-pink">02.</span>
                  <span>Upload your photo (JPG, PNG, or iPhone HEIC supported).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-hh-pink">03.</span>
                  <span>Enter your name, primary tech stack/role, and X handle.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="font-bold text-hh-pink">04.</span>
                  <span>Download your graphic & post with <strong className="text-hh-yellow">{HASHTAG}</strong>.</span>
                </li>
              </ul>
            </div>

            <div className="border-t border-hh-line pt-6 flex flex-col gap-4">
              <MagneticButton className="w-full">
                <Link
                  href="/generate"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-hh-yellow px-6 py-4 text-sm font-bold tracking-[0.14em] text-hh-green transition-all hover:bg-hh-cream hover:shadow-2xl active:scale-95 shadow-xl"
                >
                  <span>LAUNCH BADGE STUDIO</span>
                  <span>→</span>
                </Link>
              </MagneticButton>

              <a
                href="https://forms.gle/jM5hTaGvsrfEfixPA"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-hh-pink/60 bg-hh-pink/15 px-6 py-3.5 text-xs font-bold tracking-[0.14em] text-hh-cream transition-all hover:bg-hh-pink shadow-md"
              >
                <span>SUBMIT FORM LINK</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
