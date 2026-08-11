"use client";

import { useCallback, useRef, useState } from "react";

type Props = {
  onFile: (file: File) => void;
  label: string;
  hint?: string;
  compact?: boolean;
  busy?: boolean;
  filled?: boolean;
};

const ACCEPT = "image/*,.heic,.heif";

export default function Uploader({ onFile, label, hint, compact, busy, filled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file) onFile(file);
  }, [onFile]);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        pick(e.dataTransfer.files);
      }}
      className={[
        "relative w-full rounded-2xl border-2 border-dashed transition-colors",
        dragging ? "border-hh-yellow bg-hh-yellow/10" : "border-hh-cream/30 bg-hh-green-deep/50",
        compact ? "p-4" : "p-7",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full flex-col items-center gap-1.5 text-center disabled:opacity-60"
      >
        <span
          className={[
            "font-bold tracking-[0.1em] text-hh-yellow",
            compact ? "text-xs" : "text-sm",
          ].join(" ")}
        >
          {busy ? "READING PHOTO…" : filled ? `↻ ${label}` : `+ ${label}`}
        </span>
        {hint && !compact && <span className="text-xs text-hh-cream/55">{hint}</span>}
      </button>
    </div>
  );
}
