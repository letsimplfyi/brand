# Chaikadi brand kit

Chaikadi (chaikadi.fyi) is a flagship app of letsimpl.fyi. This folder is its identity kit.
Source of truth is this repo; apps copy from here (`https://brand.letsimpl.fyi/assets/chaikadi/...`).

Status: **ready** (signed off by the founder, 2026-11-22).

## Identity

| | |
|---|---|
| Name | **Chaikadi** (capital C, one word) |
| Tagline | **Decide, order, split.** |
| Descriptor | **Free. Free Software. Simple and Stupid.** |
| Licence line | AGPL-3.0-or-later |
| Site | chaikadi.fyi |

Say all three together wherever there is room: tagline, descriptor, licence. On small surfaces use the tagline alone.
"Free" means no price and no account. "Free Software" means the four freedoms, under the AGPL.

## The mark

A plain Kerala-style tea glass: tapered, flat rim, a thin band just below the rim, and five vertical ridges that fan
with the taper. Light line weight, no steam, no liquid, no handle, no ornament. Black on white by default; white on black
as the inverse.

Geometry (64-unit grid): top width 32 (x 16..48) at y 8, base width 22 (x 21..43) at y 56. Wall 1.8, base 3, band 1.5 at y 20,
five ridges 1.5 wide from y 22 to y 50, evenly spaced across the inside width at each height. Corners are square, as the brand
requires. Each part is a filled shape, so it scales without line-weight drift.

Small sizes: `favicon.svg` uses a chunkier two-ridge version of the same glass (wall 5, ridges 4), because 1.5 units disappears
at 16 px. Use the favicon geometry for anything under 32 px.

The wordmark is "Chaikadi" in Atkinson Hyperlegible Mono Bold (SIL OFL 1.1), converted to outlines so no file needs the font.
The glass is as tall as the type size and sits on the baseline. Gap between glass and word: about a third of the type size.

## Use

- Default: black on white (`logo-primary.svg`). On black use `logo-primary-inverse.svg`.
- Clear space: at least the width of the glass on every side.
- Minimum size: the favicon version 16 px; the full mark 32 px; the lockup 120 px wide.
- On a photo or any busy background use the one-colour logo on a solid white or black block.

Do not: add steam, tea, a lid, a handle, a drop shadow, a gradient or a colour; round the corners; add or remove ridges; rotate, outline or stretch it;
redraw the wordmark in another font; put the glass inside a rounded shape.

## Files

| File | Use |
|---|---|
| `logo-mark.svg`, `logo-mark-inverse.svg` | Symbol only, transparent |
| `logo-primary.svg`, `logo-primary-inverse.svg` | Lockup (mark + wordmark), 16:9, on page / on ink |
| `logo-mono.svg`, `logo-mono-inverse.svg` | One-colour lockup, transparent |
| `favicon.svg` | Browser tab; follows the device light/dark scheme |
| `app-icon.svg`, `app-icon-192.png`, `app-icon-512.png`, `apple-touch-icon-180.png` | App icons, full bleed, black on white |
| `app-icon-maskable.svg`, `app-icon-maskable-512.png` | Maskable icon (glass inside the 80% safe zone) |
| `splash.svg`, `splash-1080x1920.png` | PWA splash, 9:16 |
| `loading.svg`, `loading-1080x1920.png` | Loading screen, 9:16 (word "Loading") |
| `og-image.svg`, `og-image.png` | Social share image, 1200 x 630 |
| `github-social.svg`, `github-social.png` | GitHub social preview, 1280 x 640 |
| `avatar-400.png` | Profile picture |
| `empty-menu.svg`, `empty-picks.svg`, `empty-history.svg` | Empty states, 4:3, line glyphs only |

## Licence

Design assets: CC BY-SA 4.0 (see `../../LICENSING.md`). The Atkinson Hyperlegible Mono outlines keep the OFL notice in `../../fonts/`.

## Provenance

Created at the founder's direction on 2026-11-22, authored in code (SVG geometry plus outlined text) and rasterised
with a headless browser. See `../../CREDITS.md`.
