import { ASSET, BRAND, DATELINE, STUDIO, loadImage } from "./assets";
import { ensureFonts, type FontFamilies } from "./fonts";
import { builderNumber, builderTitle } from "./builderTitle";

export type Transform = { x: number; y: number; scale: number };
export const IDENTITY: Transform = { x: 0, y: 0, scale: 1 };

/**
 * Centre-cropping a tall phone photo into a square slices the top off, which is
 * exactly where faces sit. Bias portrait uploads upward so the default framing
 * is usable without the user touching anything.
 */
export function defaultTransform(img: HTMLImageElement): Transform {
  const ratio = img.naturalHeight / img.naturalWidth;
  if (ratio < 1.15) return { ...IDENTITY };
  const bias = Math.min(0.42, (ratio - 1) * 0.55);
  return { x: 0, y: bias, scale: 1 };
}

export type Person = {
  image: HTMLImageElement | null;
  transform: Transform;
  name: string;
};

export type Spec =
  | { mode: "pfp"; person: Person }
  | { mode: "id"; person: Person; role: string; handle: string }
  | { mode: "team"; people: Person[]; teamName: string };

export const SIZES = {
  pfp: { w: 1080, h: 1080 },
  id: { w: 1200, h: 630 },
  team: { w: 1200, h: 630 },
} as const;

type Box = { x: number; y: number; w: number; h: number };

/* ---------- primitives ---------- */

function coverRect(img: HTMLImageElement, box: Box, t: Transform) {
  const base = Math.max(box.w / img.naturalWidth, box.h / img.naturalHeight);
  const s = base * t.scale;
  const dw = img.naturalWidth * s;
  const dh = img.naturalHeight * s;
  // Pan is clamped to the overflow, so a drag can never expose empty canvas.
  const maxDX = Math.max(0, (dw - box.w) / 2);
  const maxDY = Math.max(0, (dh - box.h) / 2);
  return {
    dx: box.x + (box.w - dw) / 2 + t.x * maxDX,
    dy: box.y + (box.h - dh) / 2 + t.y * maxDY,
    dw,
    dh,
  };
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  box: Box,
  t: Transform,
) {
  const { dx, dy, dw, dh } = coverRect(img, box, t);
  ctx.drawImage(img, dx, dy, dw, dh);
}

function roundRect(ctx: CanvasRenderingContext2D, b: Box, r: number) {
  ctx.beginPath();
  ctx.roundRect(b.x, b.y, b.w, b.h, r);
}

function tracking(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  space: number,
  align: "left" | "center" = "left",
) {
  const chars = [...text];
  const total =
    chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0) + space * (chars.length - 1);
  let cx = align === "center" ? x - total / 2 : x;
  for (const c of chars) {
    ctx.fillText(c, cx, y);
    cx += ctx.measureText(c).width + space;
  }
  return total;
}

function trackedWidth(ctx: CanvasRenderingContext2D, text: string, space: number) {
  const chars = [...text];
  return chars.reduce((s, c) => s + ctx.measureText(c).width, 0) + space * (chars.length - 1);
}

/** Shrinks the font until the text fits, so long names never overflow the card. */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  family: string,
  weight: string,
  startPx: number,
  minPx: number,
) {
  let px = startPx;
  for (; px > minPx; px -= 2) {
    ctx.font = `${weight} ${px}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
  }
  ctx.font = `${weight} ${px}px ${family}`;
  return px;
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > maxWidth) out = out.slice(0, -1);
  return `${out}…`;
}

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, step = 26) {
  ctx.save();
  ctx.fillStyle = "rgba(255,251,232,0.07)";
  for (let y = step; y < h; y += step) {
    for (let x = step; x < w; x += step) {
      ctx.fillRect(x, y, 2, 2);
    }
  }
  ctx.restore();
}

function placeholder(ctx: CanvasRenderingContext2D, box: Box, fams: FontFamilies) {
  ctx.save();
  ctx.fillStyle = BRAND.greenDeep;
  ctx.fillRect(box.x, box.y, box.w, box.h);
  ctx.fillStyle = "rgba(255,251,232,0.45)";
  ctx.font = `400 ${Math.round(box.w * 0.075)}px ${fams.mono}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ADD PHOTO", box.x + box.w / 2, box.y + box.h / 2);
  ctx.restore();
}

/* ---------- shared brand furniture ---------- */

async function treeBed(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number) {
  const trees = await loadImage(ASSET.trees).catch(() => null);
  if (!trees) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  const s = w / trees.naturalWidth;
  const dh = trees.naturalHeight * s;
  ctx.drawImage(trees, 0, h - dh, w, dh);
  ctx.restore();
}

/** The site's sunrise art is a full beach scene, so the spot mark is drawn instead. */
function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.strokeStyle = BRAND.yellow;
  ctx.lineWidth = Math.max(2, r * 0.055);
  ctx.lineCap = "round";
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI + (i / 10) * Math.PI;
    const inner = r * 1.35;
    const outer = r * 1.72;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
    ctx.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
    ctx.stroke();
  }
  ctx.fillStyle = BRAND.yellow;
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

async function drawWordmark(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  width: number,
) {
  const wm = await loadImage(ASSET.wordmark).catch(() => null);
  if (!wm) return 0;
  const h = (wm.naturalHeight / wm.naturalWidth) * width;
  ctx.drawImage(wm, centerX - width / 2, y, width, h);
  return h;
}

/* ---------- PFP ---------- */

async function renderPfp(ctx: CanvasRenderingContext2D, spec: Extract<Spec, { mode: "pfp" }>, fams: FontFamilies) {
  const { w, h } = SIZES.pfp;
  const cx = w / 2;
  const cy = h / 2;
  const r = 498;

  ctx.fillStyle = BRAND.green;
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h);
  await treeBed(ctx, w, h, 0.95);

  // Photo, clipped to the avatar circle.
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const box: Box = { x: cx - r, y: cy - r, w: r * 2, h: r * 2 };
  if (spec.person.image) drawCover(ctx, spec.person.image, box, spec.person.transform);
  else placeholder(ctx, box, fams);

  // Legibility scrim behind the banner, still inside the clip.
  const scrim = ctx.createLinearGradient(0, cy + r * 0.16, 0, cy + r);
  scrim.addColorStop(0, "rgba(6,58,32,0)");
  scrim.addColorStop(0.55, "rgba(6,58,32,0.72)");
  scrim.addColorStop(1, "rgba(6,58,32,0.97)");
  ctx.fillStyle = scrim;
  ctx.fillRect(box.x, cy + r * 0.16, box.w, r * 0.84);
  ctx.restore();

  // Branding sits inside the circle so it survives X's circular avatar crop.
  await drawWordmark(ctx, cx, cy + r * 0.44, 430);

  ctx.save();
  ctx.fillStyle = BRAND.yellow;
  ctx.font = `400 27px ${fams.mono}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  tracking(ctx, DATELINE, cx, cy + r * 0.72, 2.6, "center");
  ctx.restore();

  // Rings.
  ctx.save();
  ctx.strokeStyle = BRAND.pink;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 17, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = BRAND.yellow;
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Corner marks, visible when the square image is posted rather than used as an avatar.
  const hindi = await loadImage(ASSET.goaHindi).catch(() => null);
  if (hindi) {
    const size = 118;
    ctx.drawImage(hindi, 34, 34, size, size);
  }
  drawSun(ctx, w - 96, 118, 42);
}

/* ---------- Builder ID ---------- */

async function renderId(ctx: CanvasRenderingContext2D, spec: Extract<Spec, { mode: "id" }>, fams: FontFamilies) {
  const { w, h } = SIZES.id;
  const name = spec.person.name.trim() || "Your Name";
  const role = spec.role.trim() || "Builder";
  const handle = spec.handle.trim().replace(/^@/, "");
  const title = builderTitle(name, role);
  const no = builderNumber(name, role);

  ctx.fillStyle = BRAND.cream;
  ctx.fillRect(0, 0, w, h);

  // Green header rail.
  const headerH = 96;
  ctx.fillStyle = BRAND.green;
  ctx.fillRect(0, 0, w, headerH);
  await drawWordmark(ctx, 196, 26, 268);

  ctx.save();
  ctx.fillStyle = BRAND.yellow;
  ctx.font = `400 22px ${fams.mono}`;
  ctx.textBaseline = "middle";
  const badgeW = trackedWidth(ctx, "BUILDER ID", 3.4);
  tracking(ctx, "BUILDER ID", w - 56 - badgeW, headerH / 2, 3.4);
  ctx.restore();

  // Photo panel.
  const photo: Box = { x: 56, y: 152, w: 336, h: 336 };
  ctx.save();
  roundRect(ctx, { x: photo.x - 8, y: photo.y - 8, w: photo.w + 16, h: photo.h + 16 }, 26);
  ctx.fillStyle = BRAND.green;
  ctx.fill();
  roundRect(ctx, photo, 20);
  ctx.clip();
  if (spec.person.image) drawCover(ctx, spec.person.image, photo, spec.person.transform);
  else placeholder(ctx, photo, fams);
  ctx.restore();

  ctx.save();
  roundRect(ctx, photo, 20);
  ctx.strokeStyle = BRAND.yellow;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.restore();

  // Pass number tab under the photo.
  ctx.save();
  ctx.fillStyle = BRAND.pink;
  roundRect(ctx, { x: photo.x - 8, y: photo.y + photo.h + 18, w: photo.w + 16, h: 46 }, 12);
  ctx.fill();
  ctx.fillStyle = BRAND.cream;
  ctx.font = `400 21px ${fams.mono}`;
  ctx.textBaseline = "middle";
  tracking(ctx, `PASS NO. ${no} / 247`, photo.x + photo.w / 2, photo.y + photo.h + 42, 2.2, "center");
  ctx.restore();

  // Details column.
  const colX = 452;
  const colW = w - colX - 56;

  ctx.save();
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(11,104,57,0.62)";
  ctx.font = `400 19px ${fams.mono}`;
  tracking(ctx, "NAME", colX, 186, 3);

  ctx.fillStyle = BRAND.green;
  fitFont(ctx, name, colW, fams.display, "700", 96, 42);
  ctx.fillText(name, colX, 262);

  ctx.fillStyle = "rgba(11,104,57,0.62)";
  ctx.font = `400 19px ${fams.mono}`;
  tracking(ctx, "STACK / ROLE", colX, 310, 3);

  ctx.fillStyle = BRAND.green;
  fitFont(ctx, role, colW, fams.mono, "700", 34, 20);
  ctx.fillText(truncate(ctx, role, colW), colX, 348);
  ctx.restore();

  // Builder title chip.
  ctx.save();
  ctx.font = `700 28px ${fams.mono}`;
  const chipTextW = trackedWidth(ctx, title.toUpperCase(), 2);
  const chip: Box = { x: colX, y: 386, w: Math.min(chipTextW + 52, colW), h: 60 };
  roundRect(ctx, chip, 30);
  ctx.fillStyle = BRAND.yellow;
  ctx.fill();
  ctx.strokeStyle = BRAND.pink;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = BRAND.green;
  ctx.textBaseline = "middle";
  tracking(ctx, title.toUpperCase(), chip.x + chip.w / 2, chip.y + chip.h / 2 + 1, 2, "center");
  ctx.restore();

  if (handle) {
    ctx.save();
    ctx.fillStyle = "rgba(11,104,57,0.78)";
    ctx.font = `400 26px ${fams.mono}`;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(truncate(ctx, `@${handle}`, colW), colX, 494);
    ctx.restore();
  }

  await idFooter(ctx, w, h, fams);
}

async function idFooter(ctx: CanvasRenderingContext2D, w: number, h: number, fams: FontFamilies) {
  const y = h - 62;
  ctx.save();
  ctx.strokeStyle = "rgba(11,104,57,0.28)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 9]);
  ctx.beginPath();
  ctx.moveTo(56, y - 16);
  ctx.lineTo(w - 56, y - 16);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = BRAND.green;
  ctx.font = `400 21px ${fams.mono}`;
  ctx.textBaseline = "middle";
  tracking(ctx, DATELINE, 56, y + 14, 2.2);

  ctx.fillStyle = "rgba(11,104,57,0.66)";
  ctx.font = `400 19px ${fams.mono}`;
  const sw = trackedWidth(ctx, STUDIO, 2.2);
  tracking(ctx, STUDIO, w - 56 - sw, y + 14, 2.2);
  ctx.restore();
}

/* ---------- Team ---------- */

async function renderTeam(ctx: CanvasRenderingContext2D, spec: Extract<Spec, { mode: "team" }>, fams: FontFamilies) {
  const { w, h } = SIZES.team;
  const people = spec.people.slice(0, 3);
  const teamName = spec.teamName.trim();

  ctx.fillStyle = BRAND.green;
  ctx.fillRect(0, 0, w, h);
  grain(ctx, w, h, 24);
  await treeBed(ctx, w, h, 0.92);

  await drawWordmark(ctx, w / 2, 26, 330);
  drawSun(ctx, 96, 62, 34);
  drawSun(ctx, w - 96, 62, 34);

  // Dateline sits under the wordmark; the bottom of the frame is dense florals.
  ctx.save();
  ctx.fillStyle = BRAND.yellow;
  ctx.font = `400 22px ${fams.mono}`;
  ctx.textBaseline = "alphabetic";
  tracking(ctx, DATELINE, w / 2, 128, 2.6, "center");
  ctx.restore();

  const n = Math.max(people.length, 1);
  const r = n >= 3 ? 116 : 134;
  const gap = n >= 3 ? 56 : 90;
  const totalW = n * r * 2 + (n - 1) * gap;
  const startX = (w - totalW) / 2 + r;
  const cy = 300;

  for (let i = 0; i < n; i++) {
    const person = people[i];
    const cx = startX + i * (r * 2 + gap);
    const box: Box = { x: cx - r, y: cy - r, w: r * 2, h: r * 2 };

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    if (person?.image) drawCover(ctx, person.image, box, person.transform);
    else placeholder(ctx, box, fams);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = BRAND.pink;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 13, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = BRAND.yellow;
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    const label = (person?.name || "").trim();
    if (label) {
      ctx.save();
      ctx.fillStyle = BRAND.cream;
      const size = fitFont(ctx, label, r * 2 + gap * 0.6, fams.mono, "700", 26, 15);
      ctx.textAlign = "center";
      ctx.fillText(truncate(ctx, label, r * 2 + gap * 0.6), cx, cy + r + 48);
      ctx.textAlign = "left";
      void size;
      ctx.restore();
    }
  }

  // Team name chip.
  if (teamName) {
    ctx.save();
    ctx.font = `700 26px ${fams.mono}`;
    const tw = trackedWidth(ctx, teamName.toUpperCase(), 2.4);
    const chip: Box = { x: w / 2 - (tw + 56) / 2, y: cy + r + 76, w: tw + 56, h: 54 };
    roundRect(ctx, chip, 27);
    ctx.fillStyle = BRAND.yellow;
    ctx.fill();
    ctx.strokeStyle = BRAND.pink;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = BRAND.green;
    ctx.textBaseline = "middle";
    tracking(ctx, teamName.toUpperCase(), w / 2, chip.y + chip.h / 2 + 1, 2.4, "center");
    ctx.restore();
  }
}

/* ---------- entry point ---------- */

export async function renderSpec(canvas: HTMLCanvasElement, spec: Spec): Promise<void> {
  const fams = await ensureFonts();
  const size = SIZES[spec.mode];
  canvas.width = size.w;
  canvas.height = size.h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D unavailable");
  ctx.clearRect(0, 0, size.w, size.h);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  if (spec.mode === "pfp") await renderPfp(ctx, spec, fams);
  else if (spec.mode === "id") await renderId(ctx, spec, fams);
  else await renderTeam(ctx, spec, fams);
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not export image"))),
      "image/png",
    );
  });
}
