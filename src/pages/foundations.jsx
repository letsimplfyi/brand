import { useState } from "preact/hooks";
import tokens from "../../tokens/tokens.json";
import { Button, Wordmark } from "../../components/index.jsx";
import { ratio } from "../contrast.js";
import { Code, Do, Page, Table } from "../ui.jsx";

const fmt = (n) => n.toFixed(2) + ":1";
const grade = (r, min) => (r >= min ? "Pass" : "Fail");

function Swatch({ name, t }) {
  const modes = "light" in t;
  return (
    <li class="swatch">
      {modes ? (
        <div class="modes">
          <div><div class="mode-chip" style={{ background: t.light }} /><b>Light</b><code>{t.light}</code></div>
          <div><div class="mode-chip" style={{ background: t.dark }} /><b>Dark</b><code>{t.dark}</code></div>
        </div>
      ) : (
        <div class="swatch__chip ls-crayon" style={{ backgroundColor: t.value, backgroundImage: "var(--crayon-hatch)" }}>{name}</div>
      )}
      <div class="swatch__body"><code>--{name}</code>{!modes && <code>{t.value}</code>}<span>{t.use}</span></div>
    </li>
  );
}

export function Colour() {
  const c = tokens.color;
  const pairs = [];
  for (const m of ["light", "dark"]) {
    pairs.push([`ink on page (${m})`, c.ink[m], c.page[m], 4.5]);
    pairs.push([`muted on page (${m})`, c.muted[m], c.page[m], 4.5]);
    pairs.push([`line on page (${m}), control edge`, c.line[m], c.page[m], 3]);
  }
  for (const k of ["yellow", "blue", "green"]) pairs.push([`crayon-ink on ${k}`, c["crayon-ink"].light, c[k].value, 4.5]);
  pairs.push(["crayon-ink on receipt (light)", "#111111", c.receipt.light, 4.5]);
  pairs.push(["crayon-ink on receipt (dark)", "#111111", c.receipt.dark, 4.5]);
  return (
    <Page title="Colour" lead="Black and white. Crayon colour only where it means something.">
      <h2>Page, ink and neutrals</h2>
      <ul class="swatches">
        {["page", "ink", "muted", "line", "tape", "receipt", "crayon-ink"].map((k) => <Swatch key={k} name={k} t={c[k]} />)}
      </ul>
      <p class="prose">Controls and key rules use a 2px ink border. Square corners, except crayon fills, which get a slight hand-cut radius (<code>2px 3px 2px 4px</code>). No shadows, no gradients other than the crayon hatch, no translucency except a 50% black scrim behind sheets.</p>

      <h2>Crayon = meaning</h2>
      <ul class="swatches">
        {["yellow", "blue", "green"].map((k) => <Swatch key={k} name={k} t={c[k]} />)}
      </ul>
      <Table head={["Crayon", "Only for"]} rows={[
        ["Yellow", "The slip in the wordmark. In apps: the room code."],
        ["Blue", "Outbound: links and actions that leave the page."],
        ["Green", "The one forward action on a screen. Online dots and role tags."],
      ]} />
      <Do
        yes={["Pair every crayon with a word or shape.", "Put #111111 text on every crayon fill."]}
        no={["Add a crayon or reuse one as decoration.", "Rely on colour alone to carry meaning."]}
      />

      <h2>Crayon texture</h2>
      <p class="prose">A flat fill with a faint diagonal wax hatch. Available as <code>--crayon-hatch</code>, or the <code>.ls-crayon</code> class.</p>
      <Code code={`background-color: var(--yellow);
background-image: var(--crayon-hatch);
border-radius: var(--radius-crayon);`} />

      <h2>Contrast</h2>
      <p class="prose">Computed from the token values. Text needs 4.5:1, large text and control edges 3:1. <code>npm run check</code> fails the build if any pair drops below.</p>
      <Table head={["Pair", "Ratio", "Needs", "Result"]} rows={pairs.map(([n, a, b, min]) => [n, fmt(ratio(a, b)), `${min}:1`, grade(ratio(a, b), min)])} />
    </Page>
  );
}

export function Typography() {
  const t = tokens.type;
  const roles = [
    ["hero", "Hero line, under the wordmark"], ["title", "Page title, 2px ink rule beneath"], ["section", "Section heading"],
    ["sub", "Subheading, amount"], ["body", "Body"], ["secondary", "Secondary"], ["small", "Smallest, optional text only"], ["total", "Grand total on receipts"],
  ];
  return (
    <Page title="Typography" lead="One hyperlegible monospace, two weights.">
      <h2>Families</h2>
      <div class="type-row"><span><b>Interface</b><br /><small>--font-ui</small></span><span style={{ fontSize: "1.5rem" }}>Atkinson Hyperlegible Mono 0O 1Il</span></div>
      <div class="type-row"><span><b>Receipt</b><br /><small>--font-receipt</small></span><span style={{ fontSize: "1.5rem", fontFamily: "var(--font-receipt)" }}>Courier Prime 0O 1Il</span></div>
      <div class="type-row"><span><b>Malayalam</b><br /><small>--font-malayalam</small></span><span style={{ fontSize: "1.5rem", fontFamily: "var(--font-malayalam)" }}>മലയാളം</span></div>
      <p class="prose">Atkinson Hyperlegible Mono has distinct 0/O and 1/I/l. Courier Prime is for receipts and the lock moment only. Noto Serif Malayalam is glyph-triggered through <code>unicode-range</code>, so it loads only when Malayalam appears. All fonts are self-hosted WOFF2, 114 KB in total, with OFL notices in <code>fonts/</code>.</p>

      <h2>Scale</h2>
      <p class="prose">Root size is 18px (<code>112.5%</code>) and all sizes are rem-based, so user text scaling is respected.</p>
      {roles.map(([k, label]) => (
        <div class="type-row" key={k}>
          <span><b>{k}</b><br /><small>{t[k].px} px</small></span>
          <span style={{ fontSize: `var(--text-${k})`, lineHeight: `var(--leading-${k})` }}>{label}</span>
        </div>
      ))}

      <h2>Rules</h2>
      <ul class="prose">
        <li>Left-align prose. Right-align amounts. Only the plate and empty-state drawings are centred.</li>
        <li>Two weights only: 400 and 700. Sentence case.</li>
        <li>Measure: 560px maximum for prose, about 60 characters.</li>
        <li>Links are underlined, ink-coloured, 4px offset. Never colour-only.</li>
        <li>Wrap long names; never truncate.</li>
      </ul>
      <Code code={`font: 400 112.5%/1.55 var(--font-ui);
h1 { font-size: var(--text-title); line-height: var(--leading-title); }`} />
    </Page>
  );
}

export function Spacing() {
  return (
    <Page title="Spacing and layout" lead="Eight steps. One column.">
      {Object.entries(tokens.space).map(([k, v]) => (
        <div class="space-row" key={k}><code>--space-{k}</code><span>{v}</span><span class="space-bar" style={{ width: v }} /></div>
      ))}
      <h2>Layout</h2>
      <Table head={["Token", "Value", "Note"]} rows={[
        [<code>--measure</code>, tokens.layout.measure, "Maximum width of prose"],
        [<code>--pad-phone</code>, tokens.layout["pad-phone"], "Side padding below 600px"],
        [<code>--pad-wide</code>, tokens.layout["pad-wide"], "Side padding from 600px"],
        [<code>--touch-min</code>, tokens.layout["touch-min"], "Smallest touch target"],
        [<code>--touch-preferred</code>, tokens.layout["touch-preferred"], "Preferred, with 8px gaps"],
      ]} />
      <ul class="prose">
        <li>Hero, then prints, then one prose column of sections, then a footer.</li>
        <li>No sidebars on content sites; no sticky or fixed elements there. Apps may have an app bar and bottom bar.</li>
        <li>Navigation is a plain list of real links, always visible. No hamburger on content sites.</li>
        <li>Pages are separate HTML files on content sites. No client-side routing unless the product is an app.</li>
        <li>Square corners. Controls have 2px ink borders; hairlines are 1px.</li>
      </ul>
      <p class="ls-hint">This reference itself is an app, which is why it has a side navigation.</p>
    </Page>
  );
}

export function Motion() {
  const [n, setN] = useState(0);
  return (
    <Page title="Motion" lead="Almost none, on purpose.">
      <Table head={["Token", "Value", "Where"]} rows={[
        [<code>--motion-state</code>, tokens.motion.state, "Button and link state changes. Nothing moves."],
        [<code>--motion-sheet</code>, tokens.motion.sheet, "Sheet entrance."],
        [<code>--motion-wordmark</code>, tokens.motion.wordmark, "Wordmark stumble. Once."],
      ]} />
      <h2>Wordmark stumble</h2>
      <div class="demo"><div class="demo__stage demo__stage--wide"><Wordmark key={n} class="" fit /></div></div>
      <p><Button onClick={() => setN(n + 1)}>Replay</Button></p>
      <h2>Rules, so it cannot hurt anyone</h2>
      <ul class="prose">
        <li>Runs once, never loops, never faster than two jumps per second, never flashes.</li>
        <li>Only under <code>prefers-reduced-motion: no-preference</code>. Otherwise fully static.</li>
        <li>No page entrance, list staggering, autoplay, carousels or timers.</li>
        <li>Animation never carries meaning on its own. Screen readers always get the complete text.</li>
        <li>Apps: lock types one character per 40ms and the shuffle slows over about 1.2s; reduced motion shows the full text and a 300ms fade.</li>
      </ul>
    </Page>
  );
}

export function Accessibility() {
  const rows = [
    ["Text contrast", "At least 4.5:1; large text 3:1; control edges 3:1"],
    ["Touch targets", "At least 44px, 48px preferred, 8px gaps"],
    ["Focus", "3px ink outline, 3px offset, on every interactive element"],
    ["Landmarks", "header, main, footer; one h1; no skipped heading levels; a skip link"],
    ["Scripts", "Content sites work with JavaScript off"],
    ["Zoom", "Works at 200% text size and at 320px width"],
    ["Colour", "Never alone: every state also has a word, icon or shape"],
    ["Theme", "Declare color-scheme and theme-color for both themes"],
    ["Interruptions", "No autoplay, popups, timers or cookie banners"],
    ["Images", "Alt text supplied by the founder, or empty when decorative"],
    ["Forms", "Visible labels, 16px type, decimal inputMode for prices, paste allowed, errors announced"],
    ["Errors", "Alert icon, 8px left bar, hidden \"Error\" prefix for screen readers"],
  ];
  return (
    <Page title="Accessibility" lead="Built for neuro-atypical readers first. These are the floor, not the goal.">
      <p class="prose">Intent: one column, one idea at a time, predictable structure, nothing that asks for attention, no hidden state.</p>
      <Table head={["Area", "Requirement"]} rows={rows} />
      <h2>State encoding</h2>
      <Table head={["State", "Treatment"]} rows={[
        ["Disabled", "Dashed grey edge"],
        ["Error", "Alert icon, 8px left bar, hidden prefix"],
        ["Warning", "Double border"],
        ["Destructive", "Dashed border plus alert icon"],
        ["Stale", "Clock icon, 3px double border"],
        ["Unverified", "Alert icon, dashed border"],
      ]} />
    </Page>
  );
}
