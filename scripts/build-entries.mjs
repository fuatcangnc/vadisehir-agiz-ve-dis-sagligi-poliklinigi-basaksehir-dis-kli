import { build } from "esbuild";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));

const run = (entry, outfile) =>
  build({
    entryPoints: [path.join(root, entry)],
    outfile: path.join(root, "public", "scripts", outfile),
    bundle: true,
    format: "esm",
    minify: true,
    target: "es2020",
    logLevel: "info",
  });

await run("src/scripts/init.ts", "motion-init.js");
await run("src/scripts/navigation-menu.ts", "navigation-menu-init.js");
console.log("✔ Entry bundles written to public/scripts/");