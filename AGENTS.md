# AGENTS.md

Instructions for AI agents working in this repository. Humans: read this too.

## What this repo is

**brand** is the source of truth for everything design at letsimpl.fyi. Any app
or tool for the org (chaikadi.fyi, eatsights, the org site, future work) takes
its tokens, CSS, components and assets from here. It also publishes the
reference site at https://brand.letsimpl.fyi, a Preact app (the one place in the
org where a framework earns its keep: it has to demo every component).

It lives beside the other org repos in the org working directory, each with its
own git repo under https://github.com/letsimplfyi.

## The content rule (non-negotiable)

**Agents create zero brand material.**

- Do not generate, draw, trace or stand in for a logo, logo mark, favicon, app
  icon, loading screen, splash, social image, illustration or photograph.
  Missing assets stay missing. They are tracked in `assets/manifest.json` with
  `"status": "missing"` and render as placeholders. When the founder supplies
  one, drop the file in `assets/`, set `status` to `ready` and fill in `path`.
- Do not write brand copy: taglines, slogans, mission or values text, button
  labels for real products. Demo labels in the showcase stay neutral ("Default",
  "Label"). Documentation prose describing the system is allowed, and the
  founder reviews it. If unsure whether something is brand copy, ask.
- Do not invent colours, fonts or components. The brand is black and white with
  no brand colour, by founder decision. The only colours are the four status
  fills and their ink variants (from Paul Tol's schemes). Do not add a fifth,
  and never use colour for decoration. The reading font is an approved addition.
- The wordmark is existing brand and is implemented as live text and CSS (the
  slip is an inverted block, no colour). Do not redraw it.

## Source of truth, in order

1. `tokens/tokens.json`: every value. Edit here, then `npm run tokens`.
2. `css/*.css`: framework-free components (`ls-` prefix).
3. `components/`: Preact wrappers that only add those classes.
4. `src/`: the showcase. It must never become a second source of truth; read
   values from `tokens.json`, do not copy them.

`tokens/tokens.css` is generated and committed. CI fails if it is stale.

## Principles (inherited)

- **Neuro-atypical first.** Low sensory load, predictable layout, short lines,
  no motion by default, no popups, no autoplay, no dark patterns.
- **No walls.** No trackers, analytics, cookie banners, CDNs or third-party
  requests. Fonts are self-hosted. CSP in `public/_headers` allows `'self'`
  only; do not loosen it. No inline `<script>`, `<style>` or `style=""` in
  built HTML (Preact style objects are fine).
- **Accessibility floor:** text 4.5:1, control edges 3:1, 44px targets, 3px
  focus ring, works at 200% text and 320px width, honours
  `prefers-reduced-motion` and `prefers-color-scheme`.
- **Open source.** AGPL-3.0-or-later. Fonts keep their OFL notices.
- Keep it small. Few dependencies (`preact`, `vite`, `@preact/preset-vite`).
  Ask before adding one.

## Layout

```
tokens/          tokens.json (source) + tokens.css (generated)
css/             base.css, components.css
components/      Preact components + icons, exported as @letsimplfyi/brand/components
fonts/           self-hosted WOFF2 + OFL notices (under 150 KB total)
assets/          brand assets + manifest.json (all missing for now)
src/             showcase app (Preact, hash routing)
public/          _headers and llms.txt, copied as-is to dist/ (llms-full.txt is generated)
tools/           build-tokens, publish, check
.github/         CI + Cloudflare Pages deploy
```

Build output `dist/` also contains `tokens/`, `css/`, `fonts/` and `assets/` at
stable URLs with open CORS, so other sites can link or copy them.

## Commands

```
nix develop        # node 24, just
npm ci
npm run dev        # regenerates tokens, then vite
npm run build      # tokens, vite build, publish stable files
npm run check      # tokens in sync, contrast, colour-vision simulation, manifest, fonts, hosts, CSP
```

Run `npm run build && npm run check` before handing over.

Keep `public/llms.txt` in step with this file: if a rule, token role or component
name changes, update it in the same change.

## Adding a component

1. Add the CSS class to `css/components.css` using tokens only.
2. Add the Preact wrapper to `components/index.jsx`.
3. Add an entry to `docs` in `src/pages/components.jsx` and to `src/nav.js`.
4. Check it in light and dark, at 320px width, at 200% text, keyboard only.

## Deploying

`.github/workflows/deploy.yml` runs build + check on every push and pull
request. A push to `main` that passes publishes `dist/` to the Cloudflare Pages
project `brand` (https://brand.letsimpl.fyi).

One-time setup (needs the founder's Cloudflare account; agents have no access):

1. `just pages-create` (or `npx wrangler pages project create brand --production-branch=main`)
2. Secrets `CLOUDFLARE_API_TOKEN` (Account > Cloudflare Pages > Edit) and
   `CLOUDFLARE_ACCOUNT_ID`, at repo level or once at org level `letsimplfyi`:
   `gh secret set CLOUDFLARE_API_TOKEN -R letsimplfyi/brand`
3. In the Pages project, add the custom domain `brand.letsimpl.fyi`.
4. Run the workflow once (push to `main` or *Run workflow*).

## Working agreements

- Credit what you use. Any borrowed colour, font, algorithm, library or idea goes
  in `CREDITS.md` (and the Credits page in `src/pages/guides.jsx`) in the same
  change: author, what we took, licence, link.
- Never commit secrets, tokens or keys.
- Small, focused commits with plain messages. Do not push, force-push or
  rewrite history unless asked.
- Ask when in doubt. Prefer fewer files, fewer lines, fewer ideas.
