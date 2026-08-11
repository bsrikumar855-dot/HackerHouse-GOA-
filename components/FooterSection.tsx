"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DATELINE, STUDIO } from "@/lib/assets";

gsap.registerPlugin(ScrollTrigger);

export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const floralRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !footerRef.current || !floralRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        floralRef.current,
        { yPercent: 15 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.3,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="relative z-10 w-full overflow-hidden border-t-2 border-hh-pink/50 bg-hh-green-dark text-hh-cream">
      {/* Mid-Page Floral Divider Band */}
      <div className="relative z-10 w-full overflow-hidden py-4 bg-hh-green-deep border-b border-hh-line">
        <div className="flex items-center justify-between gap-6 opacity-60">
          <Image src="/assets/brand/footer-trees-900.png" alt="Floral Motif" width={600} height={120} className="h-16 w-auto object-cover" />
          <p className="text-xs font-bold tracking-[0.3em] text-hh-yellow font-mono uppercase shrink-0">HACKER HOUSE GOA 2026</p>
          <Image src="/assets/brand/footer-trees-900.png" alt="Floral Motif" width={600} height={120} className="h-16 w-auto object-cover scale-x-[-1]" />
        </div>
      </div>

      {/* Palm Trees Background Bed with Parallax Drift */}
      <div ref={floralRef} className="pointer-events-none absolute bottom-0 left-0 right-0 opacity-60">
        <Image
          src="/assets/brand/footer-trees-900.png"
          alt="Goa Palm Trees & Florals"
          width={1440}
          height={887}
          className="h-auto w-full object-cover object-bottom"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 pb-12">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-hh-line pb-12 sm:flex-row">
          <div className="text-center sm:text-left">
            <Image
              src="/assets/brand/hacker-house-wordmark.png"
              alt="Hacker House"
              width={220}
              height={45}
              className="h-8 w-auto opacity-95 filter drop-shadow"
            />
            <p className="mt-3 text-xs tracking-[0.2em] text-hh-yellow font-mono">{DATELINE}</p>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold tracking-[0.14em] text-hh-cream/90 font-mono">
            <a
              href="https://x.com/search?q=%23FrameInGoa"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-hh-pink"
            >
              X / TWITTER
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-hh-pink"
            >
              TELEGRAM
            </a>
            <a
              href="https://forms.gle/jM5hTaGvsrfEfixPA"
              target="_blank"
              rel="noreferrer"
              className="transition-colors text-hh-pink font-bold hover:underline"
            >
              SUBMIT TASK ↗
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-[10px] tracking-[0.18em] text-hh-cream/60 font-mono sm:flex-row">
          <p>BUILT FOR HACKER HOUSE GOA 2026 · {STUDIO}</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded-full border border-hh-pink/60 bg-hh-pink/10 px-4 py-1.5 text-hh-pink transition-all hover:bg-hh-pink hover:text-hh-cream shadow-md"
          >
            <span>BACK TO TOP</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
