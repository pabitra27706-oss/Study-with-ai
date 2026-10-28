import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const host = process.env.NEXT_PUBLIC_SITE_HOST ?? "pabitra27706-oss.github.io";
const origin = `https://${host}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${origin}${basePath}/sitemap.xml`,
  };
}
