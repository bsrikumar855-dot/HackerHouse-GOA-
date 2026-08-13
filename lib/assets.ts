export const BRAND = {
  green: "#0b6839",
  greenDeep: "#084d2a",
  greenDark: "#063a20",
  yellow: "#fee101",
  pink: "#ff0080",
  cream: "#fffbe8",
  white: "#ffffff",
} as const;

export const DATELINE = "GOA, INDIA · 28 – 31 OCT 2026";
export const STUDIO = "2:47 PM STUDIO";
export const HASHTAG = "#FrameInGoa";

export const ASSET = {
  wordmark: "/assets/brand/hacker-house-wordmark.png",
  goaHindi: "/assets/brand/goa-hindi.svg",
  studio: "/assets/brand/247-studio-mark.svg",
  sun: "/assets/brand/sun-rise-720.png",
  trees: "/assets/brand/footer-trees-900.png",
  passTemplate: "/assets/brand/goa-pass-template.png",
} as const;

const cache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = cache.get(src);
  if (!p) {
    p = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
    cache.set(src, p);
  }
  return p;
}

export function preloadBrandAssets() {
  return Promise.all(Object.values(ASSET).map((s) => loadImage(s).catch(() => null)));
}
