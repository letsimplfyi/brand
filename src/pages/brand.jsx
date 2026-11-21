import { useState } from "preact/hooks";
import { Button, Placeholder, Wordmark } from "../../components/index.jsx";
import manifest from "../../assets/manifest.json";
import { Code, Do, Page } from "../ui.jsx";

export function WordmarkPage() {
  const [n, setN] = useState(0);
  return (
    <Page title="Wordmark" lead="letsimpl.fyi, with the i slid to the end and a dot left in its place.">
      <div class="demo">
        <div class="demo__stage demo__stage--wide hero" style={{ paddingBlock: "var(--space-6)" }}>
          <Wordmark key={n} />
        </div>
      </div>
      <p><Button onClick={() => setN(n + 1)}>Replay</Button></p>

      <h2>Rules</h2>
      <ul class="prose">
        <li>The <code>.</code> and the <code>i</code> sit on inverted blocks (page colour on ink) and swap places. At rest it reads <code>letsimpl.fyi</code>; mid-stumble it reads <code>letsimplify.</code>. The swap is 3ch because the font is monospace.</li>
        <li>On a hero it fills the screen width. Elsewhere it is sized by font size; the <code>--fit</code> modifier gives a compact version.</li>
        <li>It is real text. The link carries <code>aria-label="letsimpl.fyi"</code> and the glyphs are <code>aria-hidden</code>, so the animation never reaches a screen reader.</li>
        <li>No arrow (too close to Amazon's a-to-z smile).</li>
        <li>The animation runs once, about 4 seconds, never faster than two jumps per second, and only under <code>prefers-reduced-motion: no-preference</code>. Pass <code>animate=false</code> for chrome that repeats on every page.</li>
      </ul>

      <h2>Sizes</h2>
      <div class="demo">
        <div class="demo__stage">
          <Wordmark animate={false} fit />
          <Wordmark animate={false} class="ls-mark--md" />
        </div>
      </div>

      <h2>Usage</h2>
      <Code code={`<h1 class="ls-mark ls-mark--animate">
  <a href="/" aria-label="letsimpl.fyi">
    <span aria-hidden="true">letsimpl<mark class="dot">.</mark>fy<mark class="eye">i</mark></span>
  </a>
</h1>

// Preact
import { Wordmark } from "@letsimplfyi/brand/components";
<Wordmark as="h1" href="/" />`} />
      <Do
        yes={["Use the component or the exact markup above.", "Keep a clear space of at least one mark height around it.", "Keep the blocks plain ink and page. No brand colour."]}
        no={["Redraw, outline or rasterise it for in-app use.", "Add an arrow, shadow or gradient.", "Animate it on every page load of a multi-page app."]}
      />
      <p class="ls-hint">The logo, mark and favicon are separate assets and do not exist yet. See Assets.</p>
    </Page>
  );
}

export function Assets() {
  const list = manifest.assets;
  const ready = list.filter((a) => a.status === "ready").length;
  const groups = [...new Set(list.map((a) => a.group))];
  return (
    <Page title="Assets" lead={`${ready} of ${list.length} ready.`}>
      <p class="prose">Everything below is tracked in <code>assets/manifest.json</code>. Missing assets show as placeholders. Nothing is generated or drawn as a stand-in; each one is supplied by the founder.</p>
      {groups.map((g) => (
        <section key={g}>
          <h2>{g}</h2>
          <ul class="assets">
            {list.filter((a) => a.group === g).map((a) => (
              <li key={a.id}>
                <figure>
                  {a.status === "ready" && a.path ? <img src={`/assets/${a.path}`} alt={a.name} /> : <Placeholder name={a.name} status={a.status} ratio={a.ratio} />}
                  <figcaption><code>{a.id}</code> · {a.status}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <h2>Adding an asset</h2>
      <Code label="Steps" code={`1. Put the file in assets/ (SVG preferred).
2. In assets/manifest.json set "status": "ready" and "path": "<file name>".
3. npm run check, then push to main.`} />
    </Page>
  );
}
