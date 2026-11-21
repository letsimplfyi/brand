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
