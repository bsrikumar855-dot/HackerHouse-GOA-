# Frame In Goa — HH Goa 2026 Frame / ID Generator

Upload a photo, get a branded Hacker House Goa 2026 graphic back in a couple of
seconds. Three formats, no signup, no cropping step.

Built for HH Goa 2026 Shortlisting Task #1. Post output with **#FrameInGoa**.

## Modes

| Mode | Export | What it is |
|---|---|---|
| PFP Frame | 1080×1080 | Circular frame that survives X's avatar crop — branding sits inside the circle |
| Builder ID | 1200×630 | Event-pass layout: photo, name, stack/role, generated builder class, pass number |
| Team Frame | 1200×630 | 2–3 teammates composited into one frame with names and a team chip |

## Brand accuracy

Colours, fonts and logo files were extracted from a live JS render of
`hhgoa.com` rather than guessed — see
[`public/assets/brand/SOURCES.md`](public/assets/brand/SOURCES.md) for the
per-asset provenance and the computed-style values behind each token.

- Green `#0B6839` · Yellow `#FEE101` · Cream `#FFFBE8` · Pink `#FF0080`
- Display: **Imbue** · Mono: **Victor Mono** (both via `next/font`)

## Running locally

```bash
npm install
npm run dev
```

Sharing to X needs a Vercel Blob store. Without one everything still works —
download included — but the tweet opens without a link preview.

```bash
cp .env.example .env.local   # then fill in BLOB_READ_WRITE_TOKEN
```

## Deploying

```bash
npx vercel login
npx vercel link
npx vercel deploy --prod
```

Then in the Vercel dashboard: **Storage → Create Blob store → connect it to this
project**, and redeploy so `BLOB_READ_WRITE_TOKEN` is present at runtime.

## How the pieces fit

```
app/page.tsx              main tool, mode switch
app/r/[id]/page.tsx       share landing page + dynamic OG metadata
app/api/upload/route.ts   persists the PNG to Blob, returns a share id
app/api/convert/route.ts  server-side image decode fallback
lib/canvasCompose.ts      all three renderers (pure canvas draw calls)
lib/heic.ts               HEIC decode
lib/share.ts              download / Web Share / X intent
lib/builderTitle.ts       deterministic builder class + pass number
```

### Notes on the tricky parts

**Off-centre photos.** Cover-fit centre-cropping slices the top off a tall phone
photo, which is where faces are. `defaultTransform()` biases portrait uploads
upward proportionally to their aspect ratio, so the common case is framed
correctly before the user touches anything. Drag and zoom adjust from there, and
panning is clamped so you can never expose blank canvas.

**Canvas text.** `ctx.fillText` silently falls back to a system font if the
webfont has not finished loading. Every render awaits `ensureFonts()` first.

**iOS downloads.** Safari ignores `<a download>`. Saving goes through the Web
Share API there, with a long-press-to-save image as the final fallback.

**Popup blocking.** The share tab is opened synchronously inside the click
handler and its URL is replaced once the upload resolves — opening it after the
`await` gets blocked by Safari.

**HEIC.** Decoded in-browser with `heic2any`. Note that the `/api/convert` sharp
fallback cannot decode HEIC (prebuilt sharp binaries ship without libheif), so it
only covers other formats the browser rejects.
