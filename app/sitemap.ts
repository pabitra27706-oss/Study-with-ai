import type { MetadataRoute } from "next";
import { getJournalEntries } from "@/lib/journal";
import { getCurriculumIndex } from "@/lib/curriculum";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const host = process.env.NEXT_PUBLIC_SITE_HOST ?? "pabitra27706-oss.github.io";
const origin = `https://${host}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${origin}${basePath}/`, lastModified: now, priority: 1 },
    { url: `${origin}${basePath}/learn`, lastModified: now, priority: 0.9 },
    { url: `${origin}${basePath}/skills`, lastModified: now, priority: 0.9 },
    { url: `${origin}${basePath}/projects`, lastModified: now, priority: 0.9 },
    { url: `${origin}${basePath}/journal`, lastModified: now, priority: 0.8 },
    { url: `${origin}${basePath}/phone`, lastModified: now, priority: 0.8 },
    { url: `${origin}${basePath}/audit`, lastModified: now, priority: 0.8 },
    { url: `${origin}${basePath}/playbook`, lastModified: now, priority: 0.7 },
    { url: `${origin}${basePath}/playbook/roadmap`, lastModified: now, priority: 0.7 },
    { url: `${origin}${basePath}/links`, lastModified: now, priority: 0.6 },
  ];

  const learnRoutes: MetadataRoute.Sitemap = getCurriculumIndex().topics.map((topic) => ({
    url: `${origin}${basePath}/learn/${topic.id}`,
    lastModified: new Date(topic.lastUpdated),
    priority: 0.8,
  }));

  const journalRoutes: MetadataRoute.Sitemap = getJournalEntries().map((entry) => ({
    url: `${origin}${basePath}/journal/${entry.slug}`,
    lastModified: new Date(entry.date),
    priority: 0.6,
  }));

  return [...staticRoutes, ...learnRoutes, ...journalRoutes];
}
