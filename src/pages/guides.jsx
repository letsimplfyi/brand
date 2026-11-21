import tokens from "../../tokens/tokens.json";
import manifest from "../../assets/manifest.json";
import { Wordmark, OutLink } from "../../components/index.jsx";
import { nav } from "../nav.js";
import { Code, Page, Table } from "../ui.jsx";

export function Overview() {
  const ready = manifest.assets.filter((a) => a.status === "ready").length;
  return (
    <>
      <div class="hero"><Wordmark as="h1" /></div>
      <p class="lead">Source of truth for design across letsimpl.fyi projects: tokens, CSS, Preact components and brand assets.</p>
      <p><span class="stat">Assets {ready} / {manifest.assets.length} ready</span></p>
      <ul class="cards">
        {nav.filter((g) => g.group !== "Start").map((g) => (
          <li key={g.group} class="ls-card">
            <h2 style={{ padding: 0, border: 0, margin: "0 0 var(--space-2)", fontSize: "1.125rem" }}>{g.group}</h2>
            <ul style={{ margin: 0, paddingLeft: "1.25em" }}>
              {g.items.slice(0, 4).map((i) => <li key={i.id}><a href={`#/${i.id}`}>{i.title}</a></li>)}
            </ul>
          </li>
        ))}
      </ul>
      <h2>What is here</h2>
      <Table head={["Path", "What"]} rows={[
        [<code>tokens/tokens.json</code>, "The source of truth. Everything else derives from it."],
        [<code>tokens/tokens.css</code>, "Generated CSS custom properties, light and dark."],
        [<code>css/base.css</code>, "Fonts, reset, element defaults."],
        [<code>css/components.css</code>, "Framework-free components, classes prefixed ls-."],
        [<code>components/</code>, "Preact wrappers for the same components."],
        [<code>assets/</code>, "Logos, icons, screens. Tracked by manifest.json."],
        [<code>fonts/</code>, "Self-hosted WOFF2 with OFL notices."],
        [<code>src/</code>, "This showcase, built with Preact and Vite."],
      ]} />
      <p><OutLink href="https://letsimpl.fyi">letsimpl.fyi</OutLink> <OutLink href="https://github.com/letsimplfyi/brand">github.com/letsimplfyi/brand</OutLink></p>
    </>
  );
}

export function Use() {
  return (
    <Page title="Use in an app" lead="Three ways in, from lightest to richest.">
      <h2>1. Plain HTML, no build</h2>
      <Code label="HTML" code={`<link rel="stylesheet" href="https://brand.letsimpl.fyi/tokens/tokens.css">
<link rel="stylesheet" href="https://brand.letsimpl.fyi/css/base.css">
<link rel="stylesheet" href="https://brand.letsimpl.fyi/css/components.css">`} />
      <p class="prose">These files are served with open CORS. Sites that keep a strict CSP (as letsimpl.fyi does) should copy the files and fonts into their own repo instead of linking out, and update <code>style-src</code> and <code>font-src</code> otherwise.</p>

      <h2>2. npm package from git</h2>
      <Code label="Shell" code={`npm i github:letsimplfyi/brand`} />
      <Code label="JS" code={`import "@letsimplfyi/brand/tokens.css";
import "@letsimplfyi/brand/base.css";
import "@letsimplfyi/brand/components.css";
import tokens from "@letsimplfyi/brand/tokens.json" with { type: "json" };`} />

      <h2>3. Preact components</h2>
      <Code label="JSX" code={`import { Button, Callout, Wordmark } from "@letsimplfyi/brand/components";

<Button variant="primary">Continue</Button>`} />
      <p class="prose">Components need <code>preact</code> as a peer. They only add classes, so the CSS stays the source of truth.</p>

      <h2>Theming</h2>
      <p class="prose">Tokens follow the device through <code>prefers-color-scheme</code>. To force a theme set <code>data-theme="light"</code> or <code>"dark"</code> on <code>&lt;html&gt;</code>. Apps that persist a choice should default to following the device on first run.</p>

      <h2>Display settings</h2>
      <p class="prose">Offer users these, and apply them with data attributes on <code>&lt;html&gt;</code>. Each is just a token override.</p>
      <Code label="HTML" code={`<html data-text="large" data-contrast="high" data-colour="reduced">`} />
      <Table head={["Attribute", "Effect"]} rows={[
        [<code>data-text="large"</code>, "Root size 20px instead of 18px."],
        [<code>data-contrast="high"</code>, "Muted text and hairlines become full ink."],
        [<code>data-colour="reduced"</code>, "Crayons become light grey and ink variants become ink. Icons and shapes carry the meaning."],
      ]} />

      <h2>Changing the brand</h2>
      <Code label="Shell" code={`# edit tokens/tokens.json (or css/, components/), then:
npm run tokens   # regenerate tokens/tokens.css
npm run check    # tokens in sync, contrast, assets, CSP
npm run dev`} />
    </Page>
  );
}

export function TokensPage() {
  const rows = [];
  for (const [k, v] of Object.entries(tokens.color)) rows.push([<code>--{k}</code>, v.value ?? `${v.light} / ${v.dark}`, v.use]);
  for (const [k, v] of Object.entries(tokens.font.family)) rows.push([<code>--font-{k}</code>, v, "Font stack"]);
  for (const [k, v] of Object.entries(tokens.type)) rows.push([<code>--text-{k}</code>, `${v.size} (${v.px} px)`, "Type scale"]);
  for (const [k, v] of Object.entries(tokens.space)) rows.push([<code>--space-{k}</code>, v, "Spacing scale"]);
  for (const [k, v] of Object.entries(tokens.layout)) rows.push([<code>--{k}</code>, v, "Layout"]);
  for (const [k, v] of Object.entries(tokens.motion)) rows.push([<code>--motion-{k}</code>, v, "Duration"]);
  return (
    <Page title="All tokens" lead="Generated from tokens/tokens.json.">
      <p><OutLink href="/tokens/tokens.json">tokens.json</OutLink> <OutLink href="/tokens/tokens.css">tokens.css</OutLink></p>
      <Table head={["Token", "Value", "Use"]} rows={rows} />
    </Page>
  );
}

const Ext = ({ href, children }) => <OutLink href={href}>{children}</OutLink>;

export function Credits() {
  return (
    <Page title="Credits" lead="This brand stands on other people's work. Where we use it, we say so. Where we only learned from it, we say that too.">
      <p class="prose">Nothing here implies endorsement. The same list lives in <code>CREDITS.md</code>.</p>

      <h2>Design lineage</h2>
      <p class="prose"><b>letsimpl.fyi</b> and <b>chaikadi.fyi</b>, by Vysakh Premkumar. The wordmark, crayon colours, type scale, receipt, sheets and accessibility rules are inherited from those two design books.</p>
      <p><Ext href="https://letsimpl.fyi">letsimpl.fyi</Ext> <Ext href="https://github.com/tellmeY18/chaikadi.fyi">chaikadi.fyi</Ext></p>

      <h2>Research and standards</h2>
      <Table head={["Who", "What we took", "Link"]} rows={[
        ["Paul Tol, SRON", "Our approach: a perceptual colour-distance metric, simulation under red-blind and green-blind vision, the \"light\" scheme made for fills with dark text, and greyscale-contrast findings. No Tol colour is in our tokens yet; any we adopt will be listed here.", <Ext href="https://sronpersonalpages.nl/~pault/">Paul Tol's Notes</Ext>],
        ["Masataka Okabe and Kei Ito", "Colour Universal Design: redundant coding, no red against green at equal lightness, caution with pale pairs and with red on black.", <Ext href="https://jfly.uni-koeln.de/color/">Color Universal Design</Ext>],
        ["W3C WAI", "WCAG 2.2, including 1.4.1 Use of Color and the relative-luminance contrast formula.", <Ext href="https://www.w3.org/WAI/WCAG22/">WCAG 2.2</Ext>],
        ["Machado, Oliveira, Fernandes", "The colour-vision-deficiency simulation matrices (IEEE TVCG 15(6), 2009), applied in linear RGB.", "A Physiologically-based Model for Simulation of Color Vision Deficiency"],
        ["CIE", "CIELAB colour space, for the distance measure.", ""],
      ]} />

      <h2>Fonts</h2>
      <p class="prose">All SIL Open Font License 1.1. Each licence ships beside its font in <code>fonts/</code>.</p>
      <Table head={["Font", "Copyright", "Link"]} rows={[
        ["Atkinson Hyperlegible Mono and Next", "2020-2024 The Atkinson Hyperlegible Project Authors. Created by the Braille Institute of America. WOFF2 packaged by Fontsource.", <Ext href="https://brailleinstitute.org/freefont">Braille Institute</Ext>],
        ["Courier Prime", "2015 The Courier Prime Project Authors, Quote-Unquote Apps", <Ext href="https://github.com/quoteunquoteapps/CourierPrime">GitHub</Ext>],
        ["Noto Serif Malayalam", "2022 The Noto Project Authors", <Ext href="https://github.com/notofonts/malayalam">GitHub</Ext>],
      ]} />

      <h2>Software</h2>
      <Table head={["Project", "By", "Licence"]} rows={[
        [<Ext href="https://preactjs.com">Preact</Ext>, "Jason Miller and contributors", "MIT"],
        [<Ext href="https://vite.dev">Vite</Ext>, "Evan You and contributors", "MIT"],
        ["@preact/preset-vite", "The Preact team", "MIT"],
      ]} />
      <p class="ls-hint">This repo is AGPL-3.0-or-later. Third-party material keeps its own licence.</p>
    </Page>
  );
}
