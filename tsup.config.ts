import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  splitting: false,
  sourcemap: true,
  minify: true,
  dts: true,
  outDir: "./dist",
  clean: true,
});
