"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Transform } from "@/lib/canvasCompose";

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  aspect: number;
  interactive: boolean;
  transform: Transform;
  onTransform: (t: Transform) => void;
  onReset: () => void;
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function PhotoStage({
  canvasRef,
  aspect,
  interactive,
  transform,
  onTransform,
  onReset,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; tx: number; ty: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      drag.current = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        tx: transform.x,
        ty: transform.y,
      };
    },
    [interactive, transform.x, transform.y],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!d || d.id !== e.pointerId || !rect) return;
      e.preventDefault();
      // A full-width drag sweeps the photo's entire pan range.
      const nx = clamp(d.tx + ((e.clientX - d.x) / rect.width) * 2, -1, 1);
      const ny = clamp(d.ty + ((e.clientY - d.y) / rect.height) * 2, -1, 1);
      onTransform({ scale: transform.scale, x: nx, y: ny });
    },
    [onTransform, transform.scale],
  );

  const endDrag = useCallback(() => {
    drag.current = null;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !interactive) return;
    // Passive-listener default would let the page scroll during a reposition drag.
    const block = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", block, { passive: false });
    return () => el.removeEventListener("touchmove", block);
  }, [interactive]);

  return (
    <div className="w-full">
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ aspectRatio: String(aspect), touchAction: interactive ? "none" : "auto" }}
        className={[
          "relative w-full overflow-hidden rounded-2xl border-2 border-hh-cream/20 bg-hh-green-deep",
          interactive ? "cursor-grab active:cursor-grabbing" : "",
        ].join(" ")}
      >
        <canvas ref={canvasRef} className="block h-full w-full select-none" />
      </div>

      {interactive && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[10px] tracking-[0.16em] text-hh-cream/55">ZOOM</span>
          <input
            type="range"
            min={1}
            max={2.5}
            step={0.01}
            value={transform.scale}
            onChange={(e) => onTransform({ ...transform, scale: Number(e.target.value) })}
            className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-hh-cream/25 accent-hh-yellow"
            aria-label="Zoom photo"
          />
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-hh-yellow/40 bg-hh-yellow/10 px-3 py-1 text-[10px] sm:text-xs font-bold tracking-[0.14em] text-hh-yellow transition-all hover:bg-hh-yellow hover:text-hh-green active:scale-95"
          >
            RESET
          </button>
        </div>
      )}
    </div>
  );
}
