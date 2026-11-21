// Sanity checks. Runs locally (`npm run check`) and in CI before every deploy.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ratio } from "../src/contrast.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => readFileSync(root + p, "utf8");
let failed = false;
const bad = (m) => { console.error("FAIL: " + m); failed = true; };

// 1. Generated tokens are current.
try { execFileSync("node", ["tools/build-tokens.mjs", "--check"], { cwd: root, stdio: "inherit" }); } catch { failed = true; }

// 2. Contrast floor.
const t = JSON.parse(read("tokens/tokens.json")).color;
const need = [];
for (const m of ["light", "dark"]) need.push([`ink/page ${m}`, t.ink[m], t.page[m], 4.5], [`muted/page ${m}`, t.muted[m], t.page[m], 4.5], [`line/page ${m}`, t.line[m], t.page[m], 3]);
for (const k of ["yellow", "blue", "green"]) need.push([`crayon-ink/${k}`, t["crayon-ink"].light, t[k].value, 4.5]);
need.push(["ink/receipt light", "#111111", t.receipt.light, 4.5], ["ink/receipt dark", "#111111", t.receipt.dark, 4.5]);
for (const [n, a, b, min] of need) if (ratio(a, b) < min) bad(`contrast ${n} is ${ratio(a, b).toFixed(2)}, needs ${min}`);

// 3. Asset manifest: ready assets must exist, others must have no path.
const { assets } = JSON.parse(read("assets/manifest.json"));
const ids = new Set();
for (const a of assets) {
  if (ids.has(a.id)) bad(`duplicate asset id ${a.id}`);
  ids.add(a.id);
  if (!["missing", "draft", "ready"].includes(a.status)) bad(`asset ${a.id}: unknown status ${a.status}`);
  if (a.status === "ready" && !(a.path && existsSync(`${root}assets/${a.path}`))) bad(`asset ${a.id} is ready but assets/${a.path} does not exist`);
  if (a.status === "missing" && a.path) bad(`asset ${a.id} is missing but has a path`);
}

// 4. Fonts: OFL notice per family, total under 150 KB.
const fonts = readdirSync(root + "fonts");
let bytes = 0;
for (const f of fonts) if (f.endsWith(".woff2")) bytes += statSync(`${root}fonts/${f}`).size;
if (bytes > 150 * 1024 + 1) bad(`fonts total ${(bytes / 1024).toFixed(0)} KB, budget is 150 KB`);
if (fonts.filter((f) => f.endsWith(".OFL.txt")).length < 3) bad("missing an OFL notice in fonts/");

// 5. No third-party requests; CSP present and tight.
const allowed = /^(letsimpl\.fyi|brand\.letsimpl\.fyi|eatsights\.letsimpl\.fyi|chaikadi\.fyi|github\.com|example\.org|www\.w3\.org|fsf\.org)$/;
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "src", "components", "css", "index.html"], { cwd: root }).toString().split("\n").filter(Boolean);
for (const f of files) {
  for (const m of read(f).matchAll(/https?:\/\/([^/:"'\s)<>`]+)/g)) if (!allowed.test(m[1])) bad(`${f}: unapproved external host ${m[1]}`);
}
const headers = read("public/_headers");
if (!/Content-Security-Policy/.test(headers)) bad("_headers has no Content-Security-Policy");
if (/script-src [^;\n]*(https?:|\*|unsafe)/.test(headers)) bad("script-src is too loose");
if (/style-src [^;\n]*unsafe/.test(headers)) bad("style-src is too loose");

// 6. No inline script/style in the built page (the CSP forbids both).
if (existsSync(root + "dist/index.html")) {
  const html = read("dist/index.html");
  if (/<script(?![^>]*\bsrc=)/.test(html) || /<style/.test(html) || / style="/.test(html)) bad("dist/index.html has inline script or style");
  for (const p of ["tokens/tokens.css", "tokens/tokens.json", "css/base.css", "css/components.css", "_headers"]) if (!existsSync(`${root}dist/${p}`)) bad(`dist/${p} is missing`);
}

if (failed) process.exit(1);
console.log("ok: brand passes all checks");
