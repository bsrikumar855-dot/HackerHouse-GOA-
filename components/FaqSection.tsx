"use client";

import { useState } from "react";
import Image from "next/image";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "Who can participate in Hacker House Goa 2026?",
    answer: "Open to software engineers, product designers, protocol researchers, security analysts, and ambitious builders. Whether you build full-stack apps, smart contracts, AI models, or low-level systems, you are welcome.",
  },
  {
    question: "What is the selection process?",
    answer: "Selection is based on past proof-of-work, GitHub portfolio, technical depth, and completion of trial tasks — including Task #1 (generating and sharing your builder badge).",
  },
  {
    question: "Is there any registration or residency fee?",
    answer: "No, participation in Hacker House Goa 2026 is completely free for all shortlisted hackers. Accommodation and meals during the residency are covered by sponsors.",
  },
  {
    question: "What should I bring to the venue?",
    answer: "Bring your laptop, charger, hardware components (if building hardware hacks), valid government ID, and enthusiasm to build high-impact projects.",
  },
  {
    question: "How does team formation work?",
    answer: "You can apply as an individual or in teams of up to 3 builders. Solo hackers will participate in speed-matching sessions on Day 1 to form or join teams.",
  },
  {
    question: "Are we expected to do pre-event work?",
    answer: "Ideation, research, and setting up development tools are encouraged beforehand, but all project code submitted for hackathon judging must be written during the event.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section
      id="faq-section"
      className="relative z-10 w-full overflow-hidden bg-linear-to-b from-hh-green-dark via-hh-green-deep to-hh-green-dark px-5 py-24 text-hh-cream"
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

      {/* Tech Grid Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 hh-tech-grid opacity-25" />

      {/* Ambient Neon Spotlight Glows */}
      <div className="pointer-events-none absolute top-1/3 right-[-5%] h-112.5 w-112.5 rounded-full bg-hh-pink/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 left-[-5%] h-112.5 w-112.5 rounded-full bg-hh-yellow/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Asymmetric Two-Column Sticky Layout */}
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left Column (Sticky Title on Desktop) */}
          <div className="w-full md:w-1/3 md:sticky md:top-28">
            <p className="text-xs font-bold tracking-[0.25em] text-hh-pink uppercase font-mono">GOT QUESTIONS?</p>
            <h2 className="hh-display mt-2 text-4xl sm:text-5xl md:text-6xl text-hh-cream leading-tight">
              FREQUENTLY ASKED
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-hh-cream/80 font-mono leading-relaxed max-w-sm">
              Everything you need to know about the shortlisting task, team formation, fees, and the 4-day Goa residency.
            </p>
          </div>

          {/* Right Column (Scrolling Accordion Stack) */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            {FAQS.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="group overflow-hidden rounded-3xl border-2 border-hh-cream/20 bg-hh-green-dark/95 transition-all hover:border-hh-pink/70 shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="flex w-full items-center justify-between p-7 text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-bold text-hh-cream sm:text-lg group-hover:text-hh-yellow transition-colors font-mono">
                      {faq.question}
                    </span>
                    <span
                      className={[
                        "ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 font-bold",
                        isOpen
                          ? "rotate-180 bg-hh-pink border-hh-pink text-hh-cream shadow-md"
                          : "border-hh-pink/50 text-hh-pink group-hover:bg-hh-pink group-hover:text-hh-cream",
                      ].join(" ")}
                    >
                      ↓
                    </span>
                  </button>

                  <div
                    className={[
                      "transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100 p-7 pt-0" : "max-h-0 opacity-0 overflow-hidden",
                    ].join(" ")}
                  >
                    <p className="border-t border-hh-line pt-5 text-xs sm:text-sm text-hh-cream/90 leading-relaxed font-mono">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
