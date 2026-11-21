// Generates tokens/tokens.css from tokens/tokens.json.
// `node tools/build-tokens.mjs` writes it; `--check` fails if it is stale.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
export const tokens = JSON.parse(readFileSync(`${root}tokens/tokens.json`, "utf8"));

const isMode = (v) => v && typeof v === "object" && "light" in v;

export function build() {
  const base = [];
  const light = [];
  const dark = [];
  for (const [name, t] of Object.entries(tokens.color)) {
    if (isMode(t)) {
      light.push(`--${name}: ${t.light};`);
      dark.push(`--${name}: ${t.dark};`);
    } else base.push(`--${name}: ${t.value};`);
  }
  base.push(`--root-size: ${tokens.font["root-size"]};`);
  for (const [name, v] of Object.entries(tokens.font.weight)) base.push(`--weight-${name}: ${v};`);
  for (const [name, v] of Object.entries(tokens.font.family)) base.push(`--font-${name}: ${v};`);
  base.push(`--font: var(--font-ui);`);
  for (const [name, t] of Object.entries(tokens.type)) {
    base.push(`--text-${name}: ${t.size};`, `--leading-${name}: ${t.line};`);
  }
  for (const [name, v] of Object.entries(tokens.space)) base.push(`--space-${name}: ${v};`);
  for (const [name, v] of Object.entries(tokens.layout)) base.push(`--${name}: ${v};`);
  base.push(`--rule: ${tokens.border.rule};`, `--hair: ${tokens.border.hair};`, `--focus-width: ${tokens.border.focus};`);
  for (const [name, v] of Object.entries(tokens.radius)) base.push(`--radius-${name}: ${v};`);
  for (const [name, v] of Object.entries(tokens.motion)) base.push(`--motion-${name}: ${v};`);
  for (const [name, v] of Object.entries(tokens.texture)) base.push(`--${name}: ${v};`);

  const fills = Object.entries(tokens.color).filter(([n, t]) => !("light" in t) && !n.endsWith("-ink")).map(([n]) => n);
  const inks = Object.keys(tokens.color).filter((n) => n.endsWith("-ink") && n !== "crayon-ink");
  const block = (sel, lines, ind = "  ") => `${sel} {\n${lines.map((l) => `${ind}${l}`).join("\n")}\n}`;
  return [
    "/* GENERATED from tokens/tokens.json by tools/build-tokens.mjs. Do not edit. */",
    block(":root", ["color-scheme: light dark;", ...base, ...light]),
    "@media (prefers-color-scheme: dark) {",
    block("  :root:not([data-theme=\"light\"])", dark, "    ").replace(/\n\}$/, "\n  }"),
    "}",
    block(":root[data-theme=\"light\"]", ["color-scheme: light;", ...light]),
    block(":root[data-theme=\"dark\"]", ["color-scheme: dark;", ...dark]),
    block(":root[data-text=\"large\"]", [`--root-size: ${tokens.display["text-large-root-size"]};`]),
    block(":root[data-contrast=\"high\"]", ["--muted: var(--ink);", "--line: var(--ink);"]),
    block(":root[data-colour=\"reduced\"]", [
      ...fills.map((n) => `--${n}: ${tokens.display["reduced-fill"]};`),
      ...inks.map((n) => `--${n}: var(--ink);`),
    ]),
    "",
  ].join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = build();
  const path = `${root}tokens/tokens.css`;
  if (process.argv.includes("--check")) {
    let cur = "";
    try { cur = readFileSync(path, "utf8"); } catch {}
    if (cur !== out) { console.error("FAIL: tokens/tokens.css is stale. Run `npm run tokens`."); process.exit(1); }
    console.log("ok: tokens/tokens.css is in sync");
  } else {
    writeFileSync(path, out);
    console.log("wrote tokens/tokens.css");
  }
}
