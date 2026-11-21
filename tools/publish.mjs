// After `vite build`: copy the consumable source files into dist/ at stable URLs
// (/tokens, /css, /fonts, /assets) so other sites and apps can link or copy them.
import { cpSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
for (const f of ["LICENSE", "LICENSE-CC-BY-SA-4.0", "LICENSING.md"]) cpSync(`${root}${f}`, `${root}dist/${f}`);
for (const dir of ["tokens", "css", "fonts", "assets"]) {
  if (existsSync(`${root}${dir}`)) cpSync(`${root}${dir}`, `${root}dist/${dir}`, { recursive: true });
}
console.log("published tokens/ css/ fonts/ assets/ into dist/");

// llms-full.txt: llms.txt + DESIGN.md + every token, generated so it cannot drift.
const read = (f) => readFileSync(`${root}${f}`, "utf8");
const tokens = JSON.parse(read("tokens/tokens.json"));
const tokenLines = [];
for (const [group, entries] of Object.entries(tokens)) {
  if (group.startsWith("$")) continue;
  for (const [name, v] of Object.entries(entries)) {
    if (name.startsWith("$")) continue;
    const val = v && typeof v === "object" ? ("light" in v ? `light ${v.light}, dark ${v.dark}` : (v.value ?? JSON.stringify(v))) : v;
    tokenLines.push(`- ${group}.${name}: ${val}${v && v.use ? ` (${v.use})` : ""}`);
  }
}
writeFileSync(`${root}dist/llms-full.txt`, [read("public/llms.txt").trimEnd(), "# DESIGN.md", read("DESIGN.md").trimEnd(), "# All tokens (from tokens/tokens.json)", tokenLines.join("\n"), ""].join("\n\n"));
console.log("wrote dist/llms-full.txt");
