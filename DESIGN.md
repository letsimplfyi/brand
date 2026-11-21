# letsimpl.fyi brand book · v0.2

The full, browsable version is https://brand.letsimpl.fyi. The numbers live in
[`tokens/tokens.json`](tokens/tokens.json); this file is the short summary of
the decisions behind them. It contains no brand copy.

Inherited from letsimpl.fyi (org site, v0.1) and chaikadi.fyi (app, v0.3).

## Decisions

| Decision | Selected |
| --- | --- |
| Page | Pure white `#FFFFFF` (light), pitch black `#000000` (dark) |
| Interface type | Atkinson Hyperlegible Mono 400 / 500 / 700, self-hosted WOFF2 |
| Reading type | Atkinson Hyperlegible Next, for paragraphs of prose |
| Receipt type | Courier Prime 400 / 700, receipts only |
| Malayalam | Noto Serif Malayalam, loaded only when Malayalam glyphs appear |
| Colour | Six crayons, each with a meaning and a non-colour twin; everything else black and white |
| Text size | 18px body; 16px floor for read text, 14px for short optional labels; weight 500 below 18px |
| Display settings | Larger text (20px), high contrast, reduced colour: `data-text`, `data-contrast`, `data-colour` on `<html>` |
| Theme | Light and dark, follows the device (`prefers-color-scheme`) |
| Corners | Square. Crayon fills get `2px 3px 2px 4px` |
| Borders | 2px ink for controls and key rules, 1px for hairlines |
| Motion | 120ms state changes, 200ms sheets, one wordmark stumble. Nothing else |
| Third parties | None |

## Crayon = meaning

| Crayon | Hex | Only for | Non-colour twin |
| --- | --- | --- | --- |
| Yellow | `#FFE066` | The slip in the wordmark; the room code in apps. Brand only | The dot and the i |
| Green | `#A7E3A0` | The one forward action; success; online and role tags | Check icon |
| Blue | `#9FCBFF` | Outbound links and actions | Trailing arrow |
| Coral | `#F76C5A` | Destructive actions and errors | Dashed edge, cross or triangle icon |
| Amber | `#FFB35C` | Warning and attention | Triangle icon, double border |
| Teal | `#7ED6C9` | Information and neutral highlight | Info icon |

Text on crayon is always `#111111`. Colour never works alone.

Ink variants (`danger-ink`, `success-ink`, `warning-ink`, `info-ink`) are for text, icons
and borders on the bare page, all at least 4.5:1. The pastels are never text.

CI simulates protan, deutan and tritan vision: a crayon pair under ΔE 8 fails the build, and
under 15 must carry an icon or shape. Rationale: WCAG 1.4.1, and Okabe and Ito's colour universal
design (red-green confusion, pale low-saturation pairs, red reading as black to protanopes).

## Wordmark

`letsimpl.fyi`, the **i** slid to the end and a dot left in its place. The `.`
and `i` sit on yellow crayon and swap places once on load. Live text, never
redrawn. See the Wordmark page on the reference site for the rules.

## Missing brand material

Logo, logo mark, favicon, app icons, loading screen, splash, social image and
illustration direction do not exist yet. They are listed in
[`assets/manifest.json`](assets/manifest.json) and shown as placeholders.
