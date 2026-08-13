import sharp from "sharp";

const W = 1200;
const H = 630;

async function generateOg() {
  // 1. Create dark green base canvas
  const base = sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 11, g: 104, b: 57, alpha: 1 }, // #0b6839
    },
  });

  // 2. Resize sun-rise background
  const sunBg = await sharp("public/assets/brand/sun-rise-720.png")
    .resize(W, H, { fit: "cover", position: "center" })
    .toBuffer();

  // 3. Resize wordmark
  const wordmark = await sharp("public/assets/brand/hacker-house-wordmark.png")
    .resize(450)
    .toBuffer();

  // 4. Resize Hindi logo
  const hindi = await sharp("public/assets/brand/goa-hindi.svg")
    .resize(80, 80)
    .toBuffer();

  // 5. Trees bed at bottom
  const trees = await sharp("public/assets/brand/footer-trees-900.png")
    .resize(W, 320, { fit: "cover" })
    .toBuffer();

  // 6. SVG Overlay for text and chips
  const svgOverlay = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs fill="none">
        <style>
          .title { font-family: sans-serif; font-weight: 800; font-size: 54px; fill: #fffbe8; letter-spacing: -1px; }
          .subtitle { font-family: monospace; font-weight: 700; font-size: 24px; fill: #fee101; letter-spacing: 4px; }
          .dateline { font-family: monospace; font-weight: 700; font-size: 20px; fill: #fffbe8; opacity: 0.85; letter-spacing: 3px; }
          .badge { font-family: monospace; font-weight: 800; font-size: 16px; fill: #0b6839; letter-spacing: 2px; }
        </style>
      </defs>

      <!-- Scrim overlay -->
      <rect x="0" y="0" width="${W}" height="${H}" fill="#063a20" opacity="0.45" />

      <!-- Top Badge -->
      <rect x="80" y="70" width="220" height="38" rx="19" fill="#fee101" />
      <text x="190" y="94" class="badge" text-anchor="middle">#FRAMEINGOA</text>

      <!-- Subtitle -->
      <text x="80" y="160" class="subtitle">HACKER HOUSE GOA 2026</text>

      <!-- Title -->
      <text x="80" y="235" class="title">BUILDER BADGE &amp; ID CARD</text>

      <!-- Description text -->
      <text x="80" y="285" font-family="sans-serif" font-size="20" fill="#fffbe8" opacity="0.9">
        Turn any photo into an official PFP frame, Builder ID, or Team Frame.
      </text>

      <!-- Dateline -->
      <text x="80" y="550" class="dateline">GOA, INDIA · 28 – 31 OCT 2026 · 2:47 PM STUDIO</text>
    </svg>
  `);

  await base
    .composite([
      { input: sunBg, blend: "over" },
      { input: trees, top: H - 320, left: 0, blend: "over" },
      { input: svgOverlay, blend: "over" },
      { input: wordmark, top: 60, left: W - 530, blend: "over" },
      { input: hindi, top: 55, left: W - 110, blend: "over" },
    ])
    .png()
    .toFile("public/og-image.png");

  console.log("Successfully generated public/og-image.png (1200x630)");
}

generateOg().catch(console.error);
