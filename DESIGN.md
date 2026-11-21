# letsimpl.fyi brand book · v0.3

The full, browsable version is https://brand.letsimpl.fyi. The numbers live in
[`tokens/tokens.json`](tokens/tokens.json); this file is the short summary of
the decisions behind them. It contains no brand copy.

Inherited from letsimpl.fyi (org site, v0.1) and chaikadi.fyi (app, v0.3), minus their colour.

## Decisions

| Decision | Selected |
| --- | --- |
| Page | Pure white `#FFFFFF` (light), pitch black `#000000` (dark) |
| Interface type | Atkinson Hyperlegible Mono 400 / 500 / 700, self-hosted WOFF2 |
| Reading type | Atkinson Hyperlegible Next, for paragraphs of prose |
| Receipt type | Courier Prime 400 / 700, receipts only |
| Malayalam | Noto Serif Malayalam, loaded only when Malayalam glyphs appear |
| Colour | Black and white. No brand colour. Four functional status colours only |
| Text size | 18px body; 16px floor for read text, 14px for short optional labels; weight 500 below 18px |
| Display settings | Larger text (20px), high contrast, reduced colour: `data-text`, `data-contrast`, `data-colour` on `<html>` |
| Theme | Light and dark, follows the device (`prefers-color-scheme`) |
| Corners | Square |
| Borders | 2px ink for controls and key rules, 1px for hairlines |
| Motion | 120ms state changes, 200ms sheets, one wordmark stumble. Nothing else |
| Third parties | None |

## Colour is function, not brand

The identity is plain black and white: function over form, utility over aesthetics. The primary
action is a solid ink button, links are underlined ink, the wordmark is an inverted block.
Yellow, blue and green from letsimpl.fyi and chaikadi.fyi are dropped.

Four flat status fills, text on them always `#111111`, from Paul Tol's "light" scheme:

| State | Hex | Only for | Non-colour twin |
| --- | --- | --- | --- |
| Danger | `#EE8866` | Destructive actions and errors | Cross icon, 8px bar; dashed edge on buttons |
| Warning | `#EEDD88` | Warning and attention | Triangle icon, double border |
| Success | `#44BB99` | Success and confirmed | Check icon |
| Info | `#99DDFF` | Information | `i` icon, hairline border |

Ink variants (`danger-ink`, `success-ink`, `warning-ink`, `info-ink`) are for text, icons and borders
on the bare page, all at least 4.5:1. The fills are never text. In dark mode the ink variants are the fills.

CI simulates protan, deutan and tritan vision: a pair of status colours under ΔE 12 in any of them fails
the build, and under 15 must carry an icon or shape. Today the closest pair is ΔE 18 apart under every vision type. Colour is never the only cue (WCAG 1.4.1). The fills sit at
similar lightness, so in greyscale they look alike; icons and border shapes carry the meaning.
Rationale: WCAG 1.4.1, Okabe and Ito's colour universal design, Paul Tol's schemes.

## Wordmark

`letsimpl.fyi`, the **i** slid to the end and a dot left in its place. The `.` and `i` sit on
inverted blocks (page colour on ink) and swap places once on load. Live text, never redrawn. See
the Wordmark page on the reference site for the rules.

## Missing brand material

Logo, logo mark, favicon, app icons, loading screen, splash, social image and
illustration direction do not exist yet. They are listed in
[`assets/manifest.json`](assets/manifest.json) and shown as placeholders.
