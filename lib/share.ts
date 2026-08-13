import { HASHTAG } from "./assets";

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as a Mac but is the only Mac with touch input
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function canShareFile(file: File): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

export function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type || "image/png" });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export type ShareOutcome = "shared" | "downloaded" | "cancelled";

/**
 * iOS Safari ignores the <a download> attribute, so the native share sheet is
 * the only reliable "save this file" path there.
 */
export async function saveOrShare(blob: Blob, filename: string): Promise<ShareOutcome> {
  const file = blobToFile(blob, filename);

  if (isIos() && canShareFile(file)) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // Fall through to the download path on any non-cancel failure.
    }
  }

  downloadBlob(blob, filename);
  return "downloaded";
}

export function tweetIntent(caption: string, url?: string): string {
  const text = caption.includes(HASHTAG) ? caption : `${caption} ${HASHTAG}`;
  const params = new URLSearchParams({ text });
  if (url) params.set("url", url);
  return `https://x.com/intent/tweet?${params.toString()}`;
}

export const CAPTIONS = {
  pfp: "Just made my HH Goa 2026 profile frame. Drop your photo in, get one in seconds — no signup, works on mobile.",
  id: "Got my HH Goa 2026 Builder ID. Upload a photo, add your stack, download it in seconds — no signup.",
  id_vert: "Got my HH Goa 2026 Vertical Builder ID pass. Upload a photo, add your stack, download it in seconds — no signup.",
  team: "Our team just got framed for HH Goa 2026. Bring 2-3 teammates into one frame in seconds — no signup.",
} as const;
