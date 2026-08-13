import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DATELINE, HASHTAG } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Official Builder Pass Verification — HH Goa 2026",
  description: "Authentic Builder Pass Verification for Hacker House Goa 2026.",
};

type Props = {
  searchParams: Promise<{
    name?: string;
    role?: string;
    team?: string;
    no?: string;
    handle?: string;
    title?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const name = params.name || "Hacker House Builder";
  const role = params.role || "Builder";
  const team = params.team || "Independent Builder";
  const no = params.no || "001";
  const handle = params.handle ? params.handle.replace(/^@/, "") : "";
  const title = params.title || "VERIFIED BUILDER";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center bg-hh-green px-4 py-12 text-hh-cream">
      {/* Soft radiant background glow */}
      <div className="pointer-events-none absolute inset-0 hh-grain opacity-25" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-hh-yellow/20 blur-[100px]" />

      {/* Main Verification Card */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border-2 border-hh-yellow/60 bg-hh-green-dark/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        {/* Top Header Rail */}
        <div className="flex items-center justify-between border-b border-hh-line pb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/brand/goa-hindi.svg"
              alt="गोवा"
              width={42}
              height={42}
              className="h-10 w-auto"
            />
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] text-hh-yellow">HACKER HOUSE GOA</p>
              <p className="text-[9px] tracking-[0.16em] text-hh-cream/70">{HASHTAG}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-hh-pink/50 bg-hh-pink/15 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-hh-pink">
            <span className="h-2 w-2 rounded-full bg-hh-pink animate-pulse" />
            <span>VERIFIED PASS</span>
          </div>
        </div>

        {/* Verification Check Mark Animation */}
        <div className="my-8 flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-hh-pink bg-hh-yellow text-hh-green shadow-lg">
            <svg
              className="h-10 w-10 text-hh-green stroke-current stroke-[3]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="hh-display mt-4 text-2xl text-hh-cream sm:text-3xl">
            BUILDER BADGE VERIFIED
          </h1>
          <p className="mt-1 font-mono text-xs tracking-wider text-hh-yellow uppercase">
            AUTHENTIC ATTENDEE PASS #{no} / 247
          </p>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 rounded-2xl border border-hh-line bg-hh-green-deep/70 p-5 font-mono text-sm">
          <div className="flex flex-col justify-between border-b border-hh-line/40 pb-3 sm:flex-row sm:items-center">
            <span className="text-xs tracking-widest text-hh-cream/55">BUILDER NAME</span>
            <span className="text-base font-bold text-hh-cream sm:text-right">{name}</span>
          </div>

          <div className="flex flex-col justify-between border-b border-hh-line/40 pb-3 sm:flex-row sm:items-center">
            <span className="text-xs tracking-widest text-hh-cream/55">STACK / ROLE</span>
            <span className="font-bold text-hh-yellow sm:text-right">{role}</span>
          </div>

          <div className="flex flex-col justify-between border-b border-hh-line/40 pb-3 sm:flex-row sm:items-center">
            <span className="text-xs tracking-widest text-hh-cream/55">TEAM NAME</span>
            <span className="font-bold text-hh-cream sm:text-right">{team}</span>
          </div>

          <div className="flex flex-col justify-between border-b border-hh-line/40 pb-3 sm:flex-row sm:items-center">
            <span className="text-xs tracking-widest text-hh-cream/55">BUILDER CLASS</span>
            <span className="inline-block rounded-full bg-hh-yellow px-3 py-0.5 text-xs font-bold text-hh-green uppercase">
              {title}
            </span>
          </div>

          {handle && (
            <div className="flex flex-col justify-between border-b border-hh-line/40 pb-3 sm:flex-row sm:items-center">
              <span className="text-xs tracking-widest text-hh-cream/55">X HANDLE</span>
              <a
                href={`https://x.com/${handle}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-hh-yellow underline hover:text-white sm:text-right"
              >
                @{handle}
              </a>
            </div>
          )}

          <div className="flex flex-col justify-between pt-1 sm:flex-row sm:items-center">
            <span className="text-xs tracking-widest text-hh-cream/55">EVENT</span>
            <span className="text-xs text-hh-cream/80 sm:text-right">{DATELINE}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/generate"
            className="w-full rounded-2xl bg-hh-yellow px-6 py-3.5 text-center text-xs font-bold tracking-[0.14em] text-hh-green transition-transform active:scale-95 shadow-xl hover:bg-white"
          >
            GENERATE YOUR BUILDER BADGE →
          </Link>
          <p className="text-[10px] tracking-[0.18em] text-hh-cream/40">
            OFFICIAL HACKER HOUSE GOA 2026 DECENTRALIZED IDENTITY SYSTEM
          </p>
        </div>
      </div>
    </main>
  );
}
