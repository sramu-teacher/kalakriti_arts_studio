// Post-build step (runs after `vite build`, see package.json): writes a
// real HTML file for every route in src/data/pageMeta.js, each a copy of
// dist/index.html with that route's <title>, description, Open Graph /
// Twitter tags and canonical link baked in, then generates sitemap.xml.
//
// Why: GitHub Pages has no SPA fallback. Without a file for /events/foo,
// the request is answered by 404.html (HTTP 404) and redirected — ad
// platforms can reject 404 landing pages, and link-preview bots
// (WhatsApp, Facebook/Instagram) don't run JS, so every shared link
// showed the generic home-page card. With a file per route, each URL
// returns 200 with the right preview; the React app still boots and
// takes over exactly as before.
//
// Files are written as dist/<route>.html (GitHub Pages serves
// /events/foo from events/foo.html). When a route is also the parent of
// other routes (e.g. /events and /events/foo), it's additionally written
// as dist/<route>/index.html so it resolves whichever way Pages looks.
import { createServer } from "vite";
import fs from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");

// Load the data modules through Vite so import.meta.env works exactly as
// in the app build.
const vite = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  logLevel: "error",
});
let meta;
try {
  meta = await vite.ssrLoadModule("/src/data/pageMeta.js");
} finally {
  await vite.close();
}
const { getAllRouteMeta, PRODUCTION_ORIGIN, DEFAULT_IMAGE, fullTitle } = meta;

const escapeAttr = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${key.replace(":", "\\:")}"\\s+content="[^"]*"\\s*/>`);
  if (!re.test(html)) throw new Error(`prerender: <meta ${attr}="${key}"> not found in index.html`);
  return html.replace(re, `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`);
}

function renderPage(template, route) {
  const title = fullTitle(route.title);
  const url = `${PRODUCTION_ORIGIN}${route.path}`;
  const image = `${PRODUCTION_ORIGIN}/${route.image || DEFAULT_IMAGE}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = setMeta(html, "property", "og:title", title);
  html = setMeta(html, "name", "twitter:title", title);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:image", image);
  html = setMeta(html, "name", "twitter:image", image);
  if (route.description) {
    html = setMeta(html, "name", "description", route.description);
    html = setMeta(html, "property", "og:description", route.description);
    html = setMeta(html, "name", "twitter:description", route.description);
  }
  let extra = `    <link rel="canonical" href="${escapeAttr(url)}" />\n`;
  if (route.noindex && !/<meta\s+name="robots"/.test(html)) {
    // Marked so SEO.jsx removes it when navigating to an indexable page.
    extra += `    <meta name="robots" content="noindex, nofollow" data-route-robots="" />\n`;
  }
  return html.replace("</head>", `${extra}  </head>`);
}

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");
const routes = getAllRouteMeta();
const paths = new Set(routes.map((r) => r.path));
const isParent = (p) => [...paths].some((other) => other !== p && other.startsWith(`${p}/`));

let written = 0;
for (const route of routes) {
  const html = renderPage(template, route);
  const targets =
    route.path === "/"
      ? ["index.html"]
      : [`${route.path.slice(1)}.html`, ...(isParent(route.path) ? [`${route.path.slice(1)}/index.html`] : [])];
  for (const target of targets) {
    const file = path.join(dist, target);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, html);
    written++;
  }
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes
    .filter((r) => !r.noindex)
    .map((r) => {
      const depth = r.path === "/" ? 0 : r.path.split("/").length - 1;
      const priority = depth === 0 ? "1.0" : depth === 1 ? "0.8" : r.path.endsWith("/interest") || r.path.endsWith("/register") ? "0.5" : "0.7";
      return `  <url><loc>${PRODUCTION_ORIGIN}${r.path}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
    }),
  "</urlset>",
  "",
].join("\n");
await fs.writeFile(path.join(dist, "sitemap.xml"), sitemap);

console.log(`prerender: wrote ${written} HTML files for ${routes.length} routes + sitemap.xml`);
