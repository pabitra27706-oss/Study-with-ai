#!/usr/bin/env node
/**
 * A tiny static file server for the exported site.
 *
 *   node scripts/serve-static.mjs [port] [dir]
 *
 * Used to verify the static export locally before deploying — it mirrors the
 * trailing-slash behaviour of GitHub Pages (`/skills/` -> `/skills/index.html`).
 */

import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, normalize, resolve } from "node:path";

const port = Number(process.argv[2] ?? process.env.PORT ?? 3000);
const root = resolve(process.argv[3] ?? "out");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0]));
  if (clean.includes("..")) return null;

  const candidates = clean.endsWith("/")
    ? [join(root, clean, "index.html")]
    : [
        join(root, clean),
        join(root, `${clean}.html`),
        join(root, clean, "index.html"),
      ];

  for (const candidate of candidates) {
    if (!candidate.startsWith(root)) continue;
    if (!existsSync(candidate)) continue;
    const stat = statSync(candidate);
    if (stat.isFile()) return candidate;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/index.html" : req.url;
  const file = resolveFile(urlPath);

  if (!file) {
    const notFound = join(root, "404.html");
    if (existsSync(notFound)) {
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      createReadStream(notFound).pipe(res);
      return;
    }
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("404 — not found");
    return;
  }

  res.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-cache",
  });
  createReadStream(file).pipe(res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Serving ${root} at http://0.0.0.0:${port}`);
});
