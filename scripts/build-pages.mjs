import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { build } from "vite";

const root = process.cwd();
const dist = path.resolve(root, "dist");
const pagesDist = path.resolve(root, "dist-pages");

await rm(dist, { recursive: true, force: true });
await rm(pagesDist, { recursive: true, force: true });

await build({
  // Must match the published GitHub Pages repository path exactly.
  base: "/breast-cancer-care-ai/",
  build: {
    outDir: pagesDist,
    emptyOutDir: true,
  },
});

await mkdir(dist, { recursive: true });
await cp(pagesDist, dist, { recursive: true });
// GitHub Pages serves 404.html for deep links such as /chat?lang=ar.
// Copying the SPA entrypoint lets React restore the route on first load.
await cp(path.join(dist, "index.html"), path.join(dist, "404.html"));
// Some GitHub Pages configurations do not rewrite extensionless routes to
// 404.html. Keep a physical entrypoint for every client-side route as well.
for (const route of ["about", "rag", "services", "chat"]) {
  const routeDirectory = path.join(dist, route);
  await mkdir(routeDirectory, { recursive: true });
  await cp(path.join(dist, "index.html"), path.join(routeDirectory, "index.html"));
}
await rm(pagesDist, { recursive: true, force: true });
console.log("GitHub Pages files are ready in dist/");
