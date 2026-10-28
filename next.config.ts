import type { NextConfig } from "next";

/**
 * Two deployment targets are supported from one codebase:
 *
 *  - `output: "export"` -> a fully static bundle in `out/`.
 *    Works on GitHub Pages, Netlify, Cloudflare Pages, Vercel, any static host.
 *  - default (server)   -> deploys to Vercel/Node with server components.
 *
 * Set NEXT_OUTPUT=export at build time for the static path.
 * Set NEXT_PUBLIC_BASE_PATH=/<repo-name> when hosting under a sub-path
 * (required for GitHub Pages project sites: https://<user>.github.io/<repo>).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isStatic = process.env.NEXT_OUTPUT === "export";

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  output: isStatic ? "export" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
