import Link from "next/link";
import Image from "next/image";
import FrameStudio from "@/components/FrameStudio";
import { DATELINE, HASHTAG } from "@/lib/assets";

export const metadata = {
  title: "Generate Builder ID & Badge — HH Goa 2026",
  description: "Turn any photo into an official HH Goa 2026 PFP frame, Builder ID card, or team frame.",
};

export default function GeneratePage() {
  return (
    <main className="min-h-dvh bg-hh-green text-hh-cream">
      {/* Top Header Rail */}
      <header className="sticky top-0 z-50 border-b border-hh-line bg-hh-green-dark/90 backdrop-blur-md px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-hh-yellow hover:underline">
              <span>←</span>
              <span>BACK TO SITE</span>
            </Link>
            <span className="hidden text-hh-cream/30 sm:inline">|</span>
            <div className="hidden items-center gap-3 sm:flex">
              <Image src="/assets/brand/goa-hindi.svg" alt="गोवा" width={32} height={32} className="h-7 w-auto" />
              <span className="text-xs font-bold tracking-[0.18em] text-hh-cream">{HASHTAG}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs tracking-[0.16em] text-hh-cream/60 md:inline">{DATELINE}</span>
            <a
              href="https://forms.gle/jM5hTaGvsrfEfixPA"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-hh-yellow/15 border border-hh-yellow px-4 py-1.5 text-xs font-bold tracking-[0.14em] text-hh-yellow hover:bg-hh-yellow hover:text-hh-green transition-colors"
            >
              SUBMIT FORM ↗
            </a>
          </div>
        </div>
      </header>

      {/* Generator Workspace Container */}
      <div className="mx-auto max-w-7xl px-5 pt-8 pb-16">
        {/* Task Title Header */}
        <div className="mb-8 rounded-3xl border border-hh-yellow/40 bg-hh-green-deep/90 p-6 shadow-xl backdrop-blur-md sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hh-line pb-4">
            <div>
              <span className="rounded-full bg-hh-yellow px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-hh-green">
                TASK #1 GENERATOR
              </span>
              <h1 className="hh-display mt-2 text-3xl text-hh-cream sm:text-4xl md:text-5xl">
                CLAIM YOUR BUILDER BADGE
              </h1>
            </div>

            <div className="rounded-xl border border-hh-pink/50 bg-hh-pink/10 px-3.5 py-2 text-right">
              <p className="text-[9px] font-bold tracking-[0.2em] text-hh-pink">DEADLINE</p>
              <p className="text-xs font-bold text-hh-cream">AUG 13, 2026 · 11:59 PM IST</p>
            </div>
          </div>

          <p className="mt-4 text-xs font-mono text-hh-cream/80">
            Upload your photo, pick your frame mode, add your stack & handle, then download or share directly to X.
          </p>
        </div>

        {/* Studio Tool */}
        <FrameStudio />
      </div>
    </main>
  );
}
