import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  sourcemap: true,
  target: "node18",
  // Bundle the workspace core; keep third-party deps external for ESM compat.
  noExternal: [/@personal-context\/core/],
  external: ["@modelcontextprotocol/sdk", "zod", "yaml", "rss-parser"],
  banner: { js: "#!/usr/bin/env node" },
});
