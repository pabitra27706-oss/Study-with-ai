import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import hljs from "highlight.js";
import type { ArchiveIndex, ArchiveTopic } from "@/lib/archive-shared";

export { archiveLanguageSlug } from "@/lib/archive-shared";
export type { ArchiveIndex, ArchiveIndexEntry, ArchiveFile, ArchiveTopic } from "@/lib/archive-shared";

/**
 * The Learning Archive.
 *
 * `archive/data/` is the catalogue and `archive/content/` is the code. Both
 * are plain files in this repository — the archive is not a separate service
 * and does not fetch anything at runtime. `scripts/build-archive.mjs`
 * regenerates the entries that the learning engine owns, and leaves the
 * hand-written ones alone.
 *
 * Everything here runs at build time, so the site stays a fully static
 * export: the archive is baked into the pages, not loaded by the browser.
 */

const ROOT = process.cwd();
const ARCHIVE = join(ROOT, "archive");

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return fallback;
  }
}

let cachedIndex: ArchiveIndex | null = null;

export function getArchiveIndex(): ArchiveIndex {
  if (cachedIndex) return cachedIndex;
  cachedIndex = readJson<ArchiveIndex>(join(ARCHIVE, "data/index.json"), {
    metadata: {
      siteName: "Learning Archive",
      lastUpdated: "",
      totalTopics: 0,
      totalFiles: 0,
      languages: [],
    },
    topics: [],
  });
  return cachedIndex;
}

export function getArchiveTopic(id: string): ArchiveTopic | null {
  const index = getArchiveIndex();
  const entry = index.topics.find((topic) => topic.id === id);
  if (!entry) return null;
  const topic = readJson<ArchiveTopic | null>(join(ARCHIVE, entry.topicFile), null);
  if (!topic) return null;
  return { ...topic, files: topic.files ?? [] };
}

/** Every topic id, for generateStaticParams. */
export function getArchiveTopicIds(): string[] {
  return getArchiveIndex().topics.map((topic) => topic.id);
}

/* -------------------------------------------------------------------------- */
/* Code                                                                       */
/* -------------------------------------------------------------------------- */

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  ".c": "c",
  ".h": "c",
  ".py": "python",
  ".js": "javascript",
  ".html": "xml",
  ".css": "css",
  ".java": "java",
  ".sql": "sql",
  ".json": "json",
  ".md": "markdown",
};

/** The raw text of a file in the archive, or "" if it is missing. */
export function getArchiveFileText(filePath: string): string {
  const path = join(ARCHIVE, filePath);
  if (!existsSync(path)) return "";
  try {
    return readFileSync(path, "utf8");
  } catch {
    return "";
  }
}

/**
 * Syntax-highlighted markup for a code file.
 *
 * Done at build time, not in the browser: the page ships the finished HTML
 * and the visitor's phone does no highlighting work at all.
 */
export function highlightArchiveFile(fileName: string, code: string): string {
  const extension = fileName.slice(fileName.lastIndexOf("."));
  const language = LANGUAGE_BY_EXTENSION[extension] ?? "";
  if (!language || !hljs.getLanguage(language)) {
    return escapeHtml(code);
  }
  try {
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(code);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
