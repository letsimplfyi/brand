// After `vite build`: copy the consumable source files into dist/ at stable URLs
// (/tokens, /css, /fonts, /assets) so other sites and apps can link or copy them.
import { cpSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
for (const dir of ["tokens", "css", "fonts", "assets"]) {
  if (existsSync(`${root}${dir}`)) cpSync(`${root}${dir}`, `${root}dist/${dir}`, { recursive: true });
}
console.log("published tokens/ css/ fonts/ assets/ into dist/");
