import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  sourcemap: true,
  target: "node18",
  // Bundle the workspace core so the published CLI is self-contained, but keep
  // third-party (CJS) deps external so they load correctly under ESM.
  noExternal: [/@personal-context\/core/],
  external: ["yaml", "rss-parser"],
  banner: { js: "#!/usr/bin/env node" },
});
