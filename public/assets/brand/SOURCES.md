# Brand Asset Sources

Pulled 2026-08-11 by live browser render of https://hhgoa.com/ (JS-executed, not static fetch) plus the official Task #1 PDF linked from the site's Notice Board / Tasks section.

## Logo & imagery assets

| File | Source URL | Notes |
|---|---|---|
| `hacker-house-wordmark.png` | https://hhgoa.com/assets/Hacker%20house.png | Primary "Hacker House" wordmark, 1148x237 |
| `247-studio-mark.svg` | https://hhgoa.com/assets/2-47.svg | 2:47PM Studio organizer mark, 546x335 |
| `goa-hindi.svg` | https://hhgoa.com/assets/goa_hindi.svg | Devanagari "गोवा" wordmark, 181x180 |
| `sun-rise.png` | https://hhgoa.com/assets/Sun%20rise.png | Hero sunrise graphic, 1440x1438 |
| `footer-trees.png` | https://hhgoa.com/assets/footer%20trees.png | Palm tree footer motif, 1440x887 |
| `favicon.webp` | https://hhgoa.com/favicon.webp | Site favicon |

## Colors (computed styles, actual rendered page — not guessed)

| Token | Hex | Source |
|---|---|---|
| Primary background | `#0B6839` (dark green) | `body`/`main`/footer computed `background-color` |
| Primary text | `#FFFFFF` | body computed `color` |
| Accent (CTA / Apply button) | `#FEE101` (yellow) | `a[href*=devfolio]` computed `background-color` |
| Card surface (task card, notice board bg) | `#FFFBE8` (warm cream) | task-card ancestor computed `background-color` |
| Heading-on-cream | `#0B6839` | h2/h3 computed `color` when on cream card background |
| Accent outline | `#FF0080` (hot pink) | `stroke` value inside `goa_hindi.svg` — the Devanagari wordmark is yellow fill with a heavy pink outline |

These directly contradict the earlier `[INFER]` guesses (navy `#0A0E12` + orange `#FF6B35` sunrise gradient) circulated in the design-doc draft — the real palette is **forest green + yellow + cream**, not navy + orange. Do not use the inferred palette.

## Typography (computed `font-family`, actual rendered page)

| Role | Font | Notes |
|---|---|---|
| Body / mono | `Victor Mono` (+ `Victor Mono Fallback`) | Applied to `body`/`main` — monospace, fits "lives in terminal" builder voice |
| Headings | `Imbue` (+ `Imbue Fallback`) | h1-h4, weight 700 — display serif, contrast pairing with the mono body |

Both are loaded via Next.js font optimization (the `Fallback` suffix is the Next `next/font` metric-adjusted fallback naming convention), confirming the live site itself is a Next.js app using `next/font` — same approach we'll use.

## Meta / OG

- No `og:image` or `theme-color` meta tag present on the live site at fetch time — nothing to imitate/reuse there, our OG pipeline is genuinely new work.
- Favicon: `https://hhgoa.com/favicon.webp`

## Task copy (verified against live task card, `hhgoa.com` Tasks section)

- Title: "HH Goa Frame / ID Card Generator", Task #1
- Deadline banner on-site: "CLOSES IN ... · AUG 13, 11:59 PM IST" — confirms IST timezone for the 11:59 PM Aug 13 2026 deadline
- Hashtag: `#FrameInGoa`
- Submit form: https://forms.gle/jM5hTaGvsrfEfixPA

## Official task PDF

Downloaded from the "TASK DETAILS ↗" link inside the live Tasks card (`https://drive.google.com/file/d/11aAIBCdhngT0QWLPBNc2bJGLqXhghN3H/view`) to `docs/HH_Goa_2026_Shortlisting_Task.pdf` in this repo. This is the authoritative grading spec — see that file for full text.
