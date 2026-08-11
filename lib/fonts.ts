export type FontFamilies = { display: string; mono: string };

const FALLBACK: FontFamilies = {
  display: "Georgia, serif",
  mono: "ui-monospace, monospace",
};

let ready: Promise<FontFamilies> | null = null;

function resolve(): FontFamilies {
  if (typeof window === "undefined") return FALLBACK;
  const root = getComputedStyle(document.documentElement);
  const displayRaw = root.getPropertyValue("--font-imbue").trim();
  const monoRaw = root.getPropertyValue("--font-victor-mono").trim();

  const display = displayRaw ? `${displayRaw}, ${FALLBACK.display}` : FALLBACK.display;
  const mono = monoRaw ? `${monoRaw}, ${FALLBACK.mono}` : FALLBACK.mono;

  return { display, mono };
}

/**
 * Canvas silently falls back to a system font if fillText runs before the
 * webfont is downloaded, so every render must await this first.
 */
export function ensureFonts(): Promise<FontFamilies> {
  if (!ready) {
    ready = (async () => {
      const fams = resolve();
      const specs = [
        `700 96px ${fams.display}`,
        `400 96px ${fams.display}`,
        `400 48px ${fams.mono}`,
        `700 48px ${fams.mono}`,
      ];
      await Promise.all(specs.map((s) => document.fonts.load(s).catch(() => undefined)));
      await document.fonts.ready.catch(() => undefined);
      return fams;
    })();
  }
  return ready;
}

