import { useState } from "preact/hooks";
import tokens from "../../tokens/tokens.json";
import { Button, Icon, Wordmark } from "../../components/index.jsx";
import { distance, modeLabel, modes, simulate, toHex } from "../cvd.js";
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

const crayonRoles = [
  ["yellow", "Brand only: the slip in the wordmark; the room code in apps. Never a status.", "The dot and the i"],
  ["green", "The one forward action; success; online and role tags.", "Check icon, bold label"],
  ["blue", "Outbound: links and actions that leave the page.", "Trailing arrow"],
  ["coral", "Destructive actions and errors.", "Dashed edge, alert or cross icon"],
  ["amber", "Warning and attention.", "Triangle icon, double border"],
  ["teal", "Information and neutral highlight.", "Info icon"],
];
const inkKeys = ["danger-ink", "success-ink", "warning-ink", "info-ink"];

export function Colour() {
  const c = tokens.color;
  const pairs = [];
  for (const m of ["light", "dark"]) {
    pairs.push([`ink on page (${m})`, c.ink[m], c.page[m], 4.5]);
    pairs.push([`muted on page (${m})`, c.muted[m], c.page[m], 4.5]);
    pairs.push([`line on page (${m}), control edge`, c.line[m], c.page[m], 4.5]);
    for (const k of inkKeys) pairs.push([`${k} on page (${m})`, c[k][m], c.page[m], 4.5]);
  }
  for (const [k] of crayonRoles) pairs.push([`crayon-ink on ${k}`, c["crayon-ink"].light, c[k].value, 4.5]);
  pairs.push(["crayon-ink on receipt (light)", "#111111", c.receipt.light, 4.5]);
  pairs.push(["crayon-ink on receipt (dark)", "#111111", c.receipt.dark, 4.5]);
  return (
    <Page title="Colour" lead="Black and white. Crayon colour only where it means something, and never alone.">
      <h2>Page, ink and neutrals</h2>
      <ul class="swatches">
        {["page", "ink", "muted", "line", "tape", "receipt", "crayon-ink"].map((k) => <Swatch key={k} name={k} t={c[k]} />)}
      </ul>
      <p class="prose">Controls and key rules use a 2px ink border. Square corners, except crayon fills, which get a slight hand-cut radius (<code>2px 3px 2px 4px</code>). No shadows, no gradients other than the crayon hatch, no translucency except a 50% black scrim behind sheets.</p>

      <h2>Crayon = meaning</h2>
      <p class="prose">Six crayons. Soft, hand-coloured wax fills, text on them always <code>#111111</code>. The pastels differ mostly in hue, which is what red-green colour blindness erases, so each one has a twin that is not colour.</p>
      <ul class="swatches">
        {crayonRoles.map(([k]) => <Swatch key={k} name={k} t={c[k]} />)}
      </ul>
      <Table head={["Crayon", "Only for", "Non-colour twin"]} rows={crayonRoles.map(([k, use, twin]) => [k[0].toUpperCase() + k.slice(1), use, twin])} />
      <Do
        yes={["Pair every crayon with a word, icon or shape.", "Keep #111111 text on every crayon fill.", "Keep at least L* 15 between crayons that sit side by side."]}
        no={["Reuse a crayon as decoration, or add a seventh.", "Tell two crayons apart by hue alone.", "Use a crayon as text colour on the bare page."]}
      />

      <h2>Ink variants</h2>
      <p class="prose">The pastels are only 1.3 to 2.2:1 against the page, so they cannot be text. For text, icons and borders on the bare page use these. All pass 4.5:1 and each is paired with an icon or word.</p>
      <ul class="swatches">
        {inkKeys.map((k) => <Swatch key={k} name={k} t={c[k]} />)}
      </ul>
      <div class="demo"><div class="demo__stage">
        <span class="ls-ink--danger"><Icon name="error" small /> Error text</span>
        <span class="ls-ink--success"><Icon name="success" small /> Success text</span>
        <span class="ls-ink--warning"><Icon name="alert" small /> Warning text</span>
        <span class="ls-ink--info"><Icon name="info" small /> Info text</span>
      </div></div>
      <p class="prose">On black, avoid pure red text: protanopes see it as near black. That is why the dark danger ink is a light coral.</p>

      <h2>Crayon texture</h2>
      <p class="prose">A flat fill with a faint diagonal wax hatch. Available as <code>--crayon-hatch</code>, or the <code>.ls-crayon</code> class.</p>
      <Code code={`background-color: var(--coral);
background-image: var(--crayon-hatch);
border-radius: var(--radius-crayon);`} />

      <h2>Contrast</h2>
      <p class="prose">Computed from the token values. Text needs 4.5:1; control edges here are held to 4.5:1 too. <code>npm run check</code> fails the build if any pair drops below. How the crayons hold up for colour-blind readers is on the <a href="#/vision">Colour vision</a> page.</p>
      <Table head={["Pair", "Ratio", "Needs", "Result"]} rows={pairs.map(([n, a, b, min]) => [n, fmt(ratio(a, b)), `${min}:1`, grade(ratio(a, b), min)])} />
    </Page>
  );
}

export function Vision() {
  const crayons = crayonRoles.map(([k]) => [k, tokens.color[k].value]);
  const vis = ["protan", "deutan", "tritan"];
  const rows = [];
  for (let i = 0; i < crayons.length; i++) for (let j = i + 1; j < crayons.length; j++) {
    const [a, ha] = crayons[i], [b, hb] = crayons[j];
    rows.push([`${a} / ${b}`, ...["normal", ...vis].map((m) => distance(ha, hb, m).toFixed(0))]);
  }
  const worst = (r) => Math.min(...r.slice(1).map(Number));
  rows.sort((x, y) => worst(x) - worst(y));
  return (
    <Page title="Colour vision" lead="Roughly 1 in 12 men and 1 in 200 women see red and green differently. Colour is never the only cue.">
      <h2>Simulation</h2>
      <p class="prose">Each crayon as seen under simulated colour vision (Machado et al. 2009, full severity). It is a worst-case guide for designers, not what every colour-blind person sees; many see more than this.</p>
      <div class="table-wrap" tabIndex={0} role="region" aria-label="Simulation, scrollable">
        <table>
          <thead><tr><th scope="col">Crayon</th>{modes.map((m) => <th scope="col" key={m}>{modeLabel[m]}</th>)}</tr></thead>
          <tbody>
            {crayons.map(([k, hex]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                {modes.map((m) => {
                  const sim = toHex(simulate(hex, m));
                  return <td key={m}><div class="mode-chip" style={{ background: sim }} /><code>{sim}</code></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>How far apart are they</h2>
      <p class="prose">Perceptual distance (CIELAB ΔE) between each pair, under each vision type. Typical vision must be 15 or more. Below 8 under any simulation fails the build. Between 8 and 15 passes, but the pair must carry an icon or shape beside the colour (flagged below).</p>
      <Table head={["Pair", "Typical", "Protan", "Deutan", "Tritan", "Note"]} rows={rows.map((r) => [r[0], r[1], r[2], r[3], r[4], worst(r) < 15 ? "Needs icon or shape" : "Distinct"])} />

      <h2>What we do about it</h2>
      <ul class="prose">
        <li>Every state has a second cue: error is a cross icon and an 8px bar, warning a triangle and a double border, success a check, destructive a dashed edge and a triangle, info an <code>i</code>.</li>
        <li>Crayons are separated by lightness as well as hue, and coral is deeper than the others so it stays apart from green.</li>
        <li>Text never sits on a hue alone: crayon text is <code>#111111</code> and ink variants clear 4.5:1.</li>
        <li>Prefer labels on the thing itself over a colour key somewhere else.</li>
        <li>Users can switch off colour entirely from <b>Display</b> (greyscale crayons), which proves the second cues work. Try it.</li>
      </ul>
    </Page>
  );
}

export function Typography() {
  const t = tokens.type;
  const roles = [
    ["hero", "Hero line, under the wordmark"], ["title", "Page title, 2px ink rule beneath"], ["section", "Section heading"],
    ["sub", "Subheading, amount"], ["body", "Body"], ["secondary", "Secondary: hints, captions, tables"], ["small", "Smallest: bottom-bar labels, optional text only"], ["total", "Grand total on receipts"],
  ];
  const sample = "Pack my box with five dozen liquor jugs. 0O 1Il 8B rn m";
  return (
    <Page title="Typography" lead="Two Atkinson Hyperlegible faces: a mono for the interface, a proportional sibling for reading.">
      <h2>Families</h2>
      <div class="type-row"><span><b>Interface</b><br /><small>--font-ui</small></span><span style={{ fontSize: "1.5rem" }}>Atkinson Hyperlegible Mono 0O 1Il</span></div>
      <div class="type-row"><span><b>Reading</b><br /><small>--font-read</small></span><span style={{ fontSize: "1.5rem", fontFamily: "var(--font-read)" }}>Atkinson Hyperlegible Next 0O 1Il</span></div>
      <div class="type-row"><span><b>Receipt</b><br /><small>--font-receipt</small></span><span style={{ fontSize: "1.5rem", fontFamily: "var(--font-receipt)" }}>Courier Prime 0O 1Il</span></div>
      <div class="type-row"><span><b>Malayalam</b><br /><small>--font-malayalam</small></span><span style={{ fontSize: "1.5rem", fontFamily: "var(--font-malayalam)" }}>മലയാളം</span></div>
      <p class="prose">Both Atkinson faces keep 0/O and 1/I/l distinct. Use the <b>mono</b> for the interface, numbers, tables, code and anything aligned. Use the <b>reading</b> face for paragraphs of prose: a proportional face sets about a fifth narrower, so lines are shorter and wrap less. Courier Prime is for receipts and the lock moment only. Noto Serif Malayalam loads only when Malayalam appears (<code>unicode-range</code>). All fonts are self-hosted WOFF2, under 150 KB in total, with OFL notices in <code>fonts/</code>.</p>
      <div class="demo"><div class="demo__stage demo__stage--wide">
        <p style={{ margin: 0, fontFamily: "var(--font-ui)" }}><small>Mono</small><br />{sample}</p>
        <p style={{ margin: 0, fontFamily: "var(--font-read)" }}><small>Reading</small><br />{sample}</p>
      </div></div>
      <Code code={`<article class="ls-prose">…paragraphs…</article>   /* reading face, 560px measure */`} />

      <h2>Scale</h2>
      <p class="prose">Root size is 18px (<code>112.5%</code>) and every size is rem-based, so user text scaling is respected. Nothing readable is under 16px; only optional, short labels go down to 14px.</p>
      {roles.map(([k, label]) => (
        <div class="type-row" key={k}>
          <span><b>{k}</b><br /><small>{t[k].px} px</small></span>
          <span style={{ fontSize: `var(--text-${k})`, lineHeight: `var(--leading-${k})` }}>{label}</span>
        </div>
      ))}

      <h2>Readability rules</h2>
      <ul class="prose">
        <li><b>Floor:</b> 16px for anything read, 14px for short optional labels. Never below.</li>
        <li><b>Weight:</b> 400 for body and headings are 700. Secondary and small text use <b>500</b> (<code>--weight-medium</code>) so it does not go thin. Only three weights: 400, 500, 700.</li>
        <li><b>Contrast:</b> muted text is 8.4:1 on white and 10.6:1 on black. Placeholders use the muted colour at full opacity; never lighter.</li>
        <li><b>Measure:</b> 560px, about 60 characters. Line height 1.55 to 1.6 for prose.</li>
        <li><b>Alignment:</b> left-align prose, right-align amounts. Sentence case. Wrap long names; never truncate.</li>
        <li><b>Links</b> are underlined with a 4px offset. Never colour-only.</li>
        <li><b>Larger text:</b> offer a text-size control (20px root). In this reference it is in <b>Display</b>. It sets <code>data-text="large"</code> on <code>&lt;html&gt;</code>.</li>
      </ul>
      <Code code={`font: 400 var(--root-size)/1.55 var(--font-ui);
h1 { font-size: var(--text-title); line-height: var(--leading-title); }
.hint { font-size: var(--text-secondary); font-weight: var(--weight-medium); }`} />
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
    ["Text contrast", "At least 4.5:1 for all text; large text 3:1. Control edges and hairlines are held to 4.5:1 too"],
    ["Text size", "16px minimum for read text, 14px for short optional labels; weight 500 below 18px; a larger-text option (20px)"],
    ["Touch targets", "At least 44px, 48px preferred, 8px gaps"],
    ["Focus", "3px ink outline, 3px offset, on every interactive element"],
    ["Landmarks", "header, main, footer; one h1; no skipped heading levels; a skip link"],
    ["Scripts", "Content sites work with JavaScript off"],
    ["Zoom", "Works at 200% text size and at 320px width"],
    ["Colour", "Never alone: every state also has a word, icon or shape. Crayons are checked under protan, deutan and tritan simulation in CI"],
    ["Display settings", "Larger text, high contrast and reduced colour, all token-driven"],
    ["Theme", "Declare color-scheme and theme-color for both themes"],
    ["Interruptions", "No autoplay, popups, timers or cookie banners"],
    ["Images", "Alt text supplied by the founder, or empty when decorative"],
    ["Forms", "Visible labels, 16px type, decimal inputMode for prices, paste allowed, errors announced"],
    ["Errors", "Cross icon, 8px left bar, hidden \"Error\" prefix for screen readers"],
  ];
  return (
    <Page title="Accessibility" lead="Built for neuro-atypical readers first. These are the floor, not the goal.">
      <p class="prose">Intent: one column, one idea at a time, predictable structure, nothing that asks for attention, no hidden state.</p>
      <Table head={["Area", "Requirement"]} rows={rows} />
      <h2>State encoding</h2>
      <Table head={["State", "Treatment"]} rows={[
        ["Disabled", "Dashed grey edge"],
        ["Error", "Cross icon, 8px left bar, hidden prefix; coral crayon"],
        ["Success", "Check icon, default 2px border; green crayon"],
        ["Warning", "Triangle icon, double border; amber crayon"],
        ["Info", "i icon, hairline border; teal crayon"],
        ["Destructive", "Dashed border plus triangle icon; coral crayon"],
        ["Stale", "Clock icon, 3px double border"],
        ["Unverified", "Alert icon, dashed border"],
      ]} />
    </Page>
  );
}
