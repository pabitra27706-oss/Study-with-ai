import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const JOURNAL_DIR = path.join(process.cwd(), "journal");

export interface JournalEntry {
  slug: string;
  title: string;
  /** ISO date string from frontmatter, or "" when missing. */
  date: string;
  tags: string[];
  /** One-line summary shown on the index. */
  summary: string;
  /** What went wrong, and what I changed because of it. */
  mistakes?: string;
  body: string;
}

function readDirSafe(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

/**
 * Reads every markdown file in /journal.
 * The journal is the one part of this system the agent may not write —
 * it is the record of what actually happened, in my own words.
 */
export function getJournalEntries(): JournalEntry[] {
  const entries: JournalEntry[] = [];

  for (const file of readDirSafe(JOURNAL_DIR)) {
    if (!file.endsWith(".md")) continue;

    const full = path.join(JOURNAL_DIR, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data, content } = matter(raw);

    const slug = typeof data.slug === "string" && data.slug ? data.slug : file.replace(/\.md$/, "");
    const fmDate = data.date ? new Date(data.date as string) : null;

    entries.push({
      slug,
      title: (data.title as string) ?? slug,
      date:
        fmDate && !Number.isNaN(fmDate.getTime())
          ? fmDate.toISOString()
          : new Date(file.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? 0).toISOString(),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      summary: (data.summary as string) ?? "",
      mistakes: (data.mistakes as string) ?? undefined,
      body: content,
    });
  }

  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return getJournalEntries().find((e) => e.slug === slug);
}

/** Reads a top-level markdown document from the repo (e.g. ROADMAP.md). */
export function readRepoDoc(filename: string): { title: string; body: string } {
  const full = path.join(process.cwd(), filename);
  try {
    const raw = fs.readFileSync(full, "utf8");
    const { data, content } = matter(raw);
    return {
      title: (data.title as string) ?? filename.replace(/\.md$/, ""),
      body: content,
    };
  } catch {
    return { title: filename, body: "" };
  }
}
