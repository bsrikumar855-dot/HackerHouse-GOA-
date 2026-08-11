"use client";

type Props = {
  fillColor?: string;
  flip?: boolean;
  className?: string;
};

export default function WaveDivider({
  fillColor = "text-hh-cream",
  flip = false,
  className = "",
}: Props) {
  return (
    <div
      className={`pointer-events-none relative z-10 w-full overflow-hidden leading-none ${
        flip ? "rotate-180" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`relative block h-10 w-full sm:h-16 md:h-20 fill-current ${fillColor}`}
      >
        <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z" />
      </svg>
    </div>
  );
}

