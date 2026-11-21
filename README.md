# brand

Source of truth for design across the [letsimpl.fyi](https://letsimpl.fyi)
projects: design tokens, CSS, Preact components, fonts and brand assets. The
reference site at **https://brand.letsimpl.fyi** shows everything live.

## Use it

```html
<link rel="stylesheet" href="https://brand.letsimpl.fyi/tokens/tokens.css">
<link rel="stylesheet" href="https://brand.letsimpl.fyi/css/base.css">
<link rel="stylesheet" href="https://brand.letsimpl.fyi/css/components.css">
```

```sh
npm i github:letsimplfyi/brand
```

```js
import "@letsimplfyi/brand/tokens.css";
import "@letsimplfyi/brand/base.css";
import "@letsimplfyi/brand/components.css";
import { Button, Wordmark } from "@letsimplfyi/brand/components";
```

Sites with a strict CSP should copy the files and fonts rather than link out.

## Work on it

```sh
nix develop     # or any Node 24
npm ci
npm run dev     # http://localhost:5173
npm run build   # dist/
npm run check   # CI checks
```

Edit `tokens/tokens.json`, never `tokens/tokens.css` (generated). Agents: read
[AGENTS.md](AGENTS.md) first. In short, agents do not create logos, icons,
loading screens or brand copy. Those are placeholders until supplied.

See [DESIGN.md](DESIGN.md) for the decisions and AGENTS.md for deploy setup.

## Status

| Asset | State |
| --- | --- |
| Tokens, CSS, components, fonts | Done, v0.1 |
| Logo, mark, favicon, app icons | Placeholder |
| Loading screen, splash, social image | Placeholder |
| Illustration and photography direction | Placeholder |

## Licence

AGPL-3.0-or-later. Fonts in `fonts/` are SIL OFL 1.1; see the notices beside
them.
