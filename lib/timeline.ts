import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getArchiveIndex } from "@/lib/archive";
import { getProgress } from "@/lib/curriculum";

/**
 * The progress map.
 *
 * This is the answer to "show me how far I have come" — and it is assembled
 * entirely from things the engine already records. Nothing here is written
 * by hand for the site; it is all read back out of:
 *
 *   learn/<topic>/history.md   one dated line per judgement
 *   learn/archive/<topic>/     the topics that are finished
 *   data/progress.json         the latest verdict and the machine facts
 *   archive/data/index.json    the older hand-written catalogue
 *   journal/                   the learner's own writing
 *
 * So the map cannot drift away from the truth: if a judgement is not in the
 * repository, it is not on the page.
 */

export type TimelineEntry = {
  date: string;
  topicId: string;
  topicTitle: string;
  status: string;
  score: number;
  tasks: string;
  note: string;
  /** "current" for an open topic, "archived" for a finished one. */
  state: "current" | "archived";
};

export type TopicArc = {
  topicId: string;
  title: string;
  language: string;
  entries: TimelineEntry[];
  latest: TimelineEntry | null;
  best: number;
  /** "current" for an open topic, "archived" for one that is finished. */
  state: "current" | "archived";
};

const HISTORY_LINE =
  /^- (\d{4}-\d{2}-\d{2})\s+—\s+\*\*(.+?)\*\*\s+\((\d+)%\)\s+·\s*(.*?)\s*·\s*(.*)$/;

/** Read one topic's history file and parse its dated judgement lines. */
function readHistory(
  topicId: string,
  title: string,
  learnDir: string,
  state: "current" | "archived",
): TimelineEntry[] {
  const path = join(learnDir, "history.md");
  if (!existsSync(path)) return [];

  const entries: TimelineEntry[] = [];
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const match = raw.trim().match(HISTORY_LINE);
    if (!match) continue;
    entries.push({
      date: match[1],
      topicId,
      topicTitle: title,
      status: match[2],
      score: Number(match[3]),
      tasks: match[4],
      note: match[5],
      state,
    });
  }
  return entries;
}

function listDirectories(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

/** Every judgement ever recorded, newest first. */
export function getTimeline(): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const topic of getCurriculumTopics()) {
    entries.push(...readHistory(topic.id, topic.title, topic.learnDir, "current"));
  }
  for (const id of listDirectories(join(process.cwd(), "learn", "archive"))) {
    entries.push(...readHistory(id, id, join(process.cwd(), "learn", "archive", id), "archived"));
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

/** The arc per topic: every judgement, and the best score reached. */
export function getTopicArcs(): TopicArc[] {
  const curriculum = getCurriculumTopics();
  const arcs: TopicArc[] = [];

  for (const topic of curriculum) {
    const entries = readHistory(topic.id, topic.title, topic.learnDir, "current");
    arcs.push({
      topicId: topic.id,
      title: topic.title,
      language: topic.language,
      entries: entries.sort((a, b) => a.date.localeCompare(b.date)),
      latest: entries.length ? entries[entries.length - 1] : null,
      best: entries.reduce((max, entry) => Math.max(max, entry.score), 0),
      state: "current",
    });
  }

  for (const id of listDirectories(join(process.cwd(), "learn", "archive"))) {
    const entries = readHistory(id, id, join(process.cwd(), "learn", "archive", id), "archived");
    arcs.push({
      topicId: id,
      title: id,
      language: "—",
      entries: entries.sort((a, b) => a.date.localeCompare(b.date)),
      latest: entries.length ? entries[entries.length - 1] : null,
      best: entries.reduce((max, entry) => Math.max(max, entry.score), 0),
      state: "archived",
    });
  }

  return arcs.sort((a, b) => {
    const aDate = a.latest?.date ?? "";
    const bDate = b.latest?.date ?? "";
    return bDate.localeCompare(aDate);
  });
}

/** The older catalogue, counted by month — the long tail of work. */
export function getArchiveMonths(): Array<{ month: string; topics: number; files: number }> {
  const index = getArchiveIndex();
  const buckets = new Map<string, { topics: number; files: number }>();

  for (const topic of index.topics) {
    if (topic.source === "engine") continue;
    const month = String(topic.dateCreated ?? "").slice(0, 7);
    if (!month) continue;
    const bucket = buckets.get(month) ?? { topics: 0, files: 0 };
    bucket.topics += 1;
    bucket.files += topic.fileCount ?? 0;
    buckets.set(month, bucket);
  }

  return [...buckets.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, value]) => ({
      month,
      topics: value.topics,
      files: value.files,
    }));
}

function getCurriculumTopics() {
  const progress = getProgress();
  const curriculumIndex = getCurriculumIndexSafe();

  return curriculumIndex.topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    language: topic.language,
    learnDir: topic.learnDir ?? `learn/${topic.id}`,
    score: progress?.topics?.[topic.id]?.verdict?.score ?? 0,
  }));
}

function getCurriculumIndexSafe() {
  const path = join(process.cwd(), "curriculum", "index.json");
  if (!existsSync(path)) {
    return { topics: [] as Array<{ id: string; title: string; language: string; learnDir?: string }> };
  }
  try {
    return JSON.parse(readFileSync(path, "utf8")) as {
      topics: Array<{ id: string; title: string; language: string; learnDir?: string }>;
    };
  } catch {
    return { topics: [] as Array<{ id: string; title: string; language: string; learnDir?: string }> };
  }
}

/** Headline numbers for the progress page. */
export function getProgressSummary() {
  const timeline = getTimeline();
  const arcs = getTopicArcs();
  const progress = getProgress();

  const attempts = timeline.length;
  const topicsJudged = arcs.filter((arc) => arc.entries.length > 0).length;
  const best = arcs.reduce((max, arc) => Math.max(max, arc.best), 0);
  const average = attempts
    ? Math.round(timeline.reduce((sum, entry) => sum + entry.score, 0) / attempts)
    : 0;

  const tasksPassed = Object.values(progress?.topics ?? {}).reduce(
    (sum, topic) => sum + (topic.machine?.tasksPassed ?? 0),
    0,
  );
  const tasksTotal = Object.values(progress?.topics ?? {}).reduce(
    (sum, topic) => sum + (topic.machine?.tasksTotal ?? 0),
    0,
  );

  const days = timeline.length
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(timeline[timeline.length - 1].date).getTime()) / 86_400_000,
        ) + 1,
      )
    : 0;

  return { attempts, topicsJudged, best, average, tasksPassed, tasksTotal, days };
}
