import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  build: { outDir: "dist", emptyOutDir: true, assetsInlineLimit: 0, assetsDir: "_app", sourcemap: false },
});
