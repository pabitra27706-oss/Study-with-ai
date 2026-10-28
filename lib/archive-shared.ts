/**
 * Helpers shared by the archive's server and client code.
 *
 * Kept separate from `lib/archive.ts` on purpose: that module reads the
 * filesystem and pulls in the highlighter, so it must never be imported by a
 * client component.
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ArchiveIndexEntry = {
  id: string;
  title: string;
  language: string;
  dateCreated: string;
  lastUpdated: string;
  fileCount: number;
  tags: string[];
  description: string;
  topicFile: string;
  /** "engine" when the learning engine wrote this entry. */
  source?: string;
  /** The learning topic this entry came from, when the engine wrote it. */
  curriculumId?: string;
  verdict?: string | null;
  score?: number | null;
  /**
   * The directory the topic's own JSON lives in — "c", "python",
   * "html-css". It is not always the language with the punctuation taken
   * out, so the browser is told rather than left to guess.
   */
  langSlug?: string;
};

export type ArchiveIndex = {
  metadata: {
    siteName: string;
    lastUpdated: string;
    firstEntryDate?: string;
    totalTopics: number;
    totalFiles: number;
    languages: string[];
  };
  topics: ArchiveIndexEntry[];
};

/** The archive names a language "c", "python", "javascript". */
export function archiveLanguageSlug(language: string): string {
  return String(language ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** The badge colour for a language. */
export function archiveLanguageTone(language: string): string {
  switch (archiveLanguageSlug(language)) {
    case "c":
      return "border-ok/40 text-ok";
    case "python":
      return "border-accent/40 text-accent";
    case "javascript":
    case "js":
      return "border-warn/40 text-warn";
    case "java":
      return "border-bad/40 text-bad";
    case "html":
    case "css":
      return "border-brand/40 text-brand-soft";
    case "sql":
      return "border-line text-muted";
    default:
      return "border-line text-faint";
  }
}

/** Days between the first archive entry and now — the "days learning" stat. */
export function archiveDaysLearning(firstEntryDate?: string): number {
  if (!firstEntryDate) return 0;
  const start = new Date(firstEntryDate).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor((Date.now() - start) / 86_400_000));
}

/** "January 2026" from an ISO date. */
export function archiveMonthLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

/** "12 Aug 2026" from an ISO date. */
export function archiveDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export type ArchiveFile = {
  id: string;
  fileName: string;
  filePath: string;
  description: string;
  dateAdded: string;
  /** Set when the file is a graded task from the learning engine. */
  taskId?: string;
  points?: number;
  passed?: number;
  total?: number;
  maxPoints?: number;
  compileError?: string | null;
};

export type ArchiveTopic = {
  topic: {
    id: string;
    title: string;
    language: string;
    category?: string;
    difficulty?: string;
    dateCreated: string;
    lastUpdated: string;
    tags: string[];
    description: string;
    learningNotes: { whatILearned: string; challenges: string; nextSteps: string };
    source?: string;
    curriculumId?: string;
  };
  files: ArchiveFile[];
  engine?: {
    topicId: string;
    minutes: number | null;
    points: number;
    tasks: number;
    verdict: { status: string; score: number; by: string; at: string } | null;
    machine: {
      score: number;
      tasksPassed: number;
      tasksTotal: number;
      written: number;
      explain: number;
      compileErrors: number;
    } | null;
    misconceptions: string[];
    review: string;
  };
};
