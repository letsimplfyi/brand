# letsimpl.fyi brand book · v0.1

The full, browsable version is https://brand.letsimpl.fyi. The numbers live in
[`tokens/tokens.json`](tokens/tokens.json); this file is the short summary of
the decisions behind them. It contains no brand copy.

Inherited from letsimpl.fyi (org site, v0.1) and chaikadi.fyi (app, v0.3).

## Decisions

| Decision | Selected |
| --- | --- |
| Page | Pure white `#FFFFFF` (light), pitch black `#000000` (dark) |
| Interface type | Atkinson Hyperlegible Mono 400 / 700, self-hosted WOFF2 |
| Receipt type | Courier Prime 400 / 700, receipts only |
| Malayalam | Noto Serif Malayalam, loaded only when Malayalam glyphs appear |
| Colour | Crayon only, with meaning; everything else black and white |
| Theme | Light and dark, follows the device (`prefers-color-scheme`) |
| Corners | Square. Crayon fills get `2px 3px 2px 4px` |
| Borders | 2px ink for controls and key rules, 1px for hairlines |
| Motion | 120ms state changes, 200ms sheets, one wordmark stumble. Nothing else |
| Third parties | None |

## Crayon = meaning

| Crayon | Hex | Only for |
| --- | --- | --- |
| Yellow | `#FFE066` | The slip in the wordmark; the room code in apps |
| Blue | `#9FCBFF` | Outbound: links and actions that leave the page |
| Green | `#A7E3A0` | The one forward action per screen; online and role tags |

Text on crayon is always `#111111`. Colour never works alone.

## Wordmark

`letsimpl.fyi`, the **i** slid to the end and a dot left in its place. The `.`
and `i` sit on yellow crayon and swap places once on load. Live text, never
redrawn. See the Wordmark page on the reference site for the rules.

## Missing brand material

Logo, logo mark, favicon, app icons, loading screen, splash, social image and
illustration direction do not exist yet. They are listed in
[`assets/manifest.json`](assets/manifest.json) and shown as placeholders.
