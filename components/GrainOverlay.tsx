"use client";

export default function GrainOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-99 h-full w-full opacity-[0.06] mix-blend-overlay overflow-hidden">
      <svg className="h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
