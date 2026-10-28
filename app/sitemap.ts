import type { MetadataRoute } from "next";
import { getJournalEntries } from "@/lib/journal";
import { getCurriculumIndex } from "@/lib/curriculum";
import { getArchiveIndex } from "@/lib/archive";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const host = process.env.NEXT_PUBLIC_SITE_HOST ?? "pabitra27706-oss.github.io";
const origin = `https://${host}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${origin}${basePath}/`, lastModified: now, priority: 1 },
    { url: `${origin}${basePath}/learn`, lastModified: now, priority: 0.9 },
  { url: `${origin}${basePath}/archive`, lastModified: now, priority: 0.8 },
  { url: `${origin}${basePath}/progress`, lastModified: now, priority: 0.8 },
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

  /* Every topic in the archive has its own page, and each one is a page of
     code. Sixty-nine of them is the largest single body of work on this
     site, so it belongs in the sitemap — otherwise a crawler has to find
     it by walking the archive page. */
  const archive = getArchiveIndex();
  const fallback = archive.metadata.lastUpdated || new Date().toISOString();
  const archiveRoutes: MetadataRoute.Sitemap = archive.topics.map((topic) => {
    const stamp = new Date(topic.lastUpdated || topic.dateCreated || fallback);
    return {
      url: `${origin}${basePath}/archive/${topic.id}`,
      lastModified: Number.isNaN(stamp.getTime()) ? new Date(fallback) : stamp,
      priority: 0.5,
    };
  });

  return [...staticRoutes, ...learnRoutes, ...journalRoutes, ...archiveRoutes];
}
