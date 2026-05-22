import { defineConfig } from "tsdown"

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm"],
  target: "esnext",
  clean: true,
  treeshake: true,
  dts: true,
  minify: {
    mangle: {
      keepNames: true,
    },
  },
  exports: {
    enabled: true,
    packageJson: false,
  },
})
