import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The curriculum is the teaching layer: AI-written topic packs with an
 * explanation, curated videos, machine-checked tasks and a written rubric.
 *
 * The learner's own work lives in `learn/<topic>/`. The agent in
 * `runner/brief.mjs` gathers what is needed to judge it (runner/evidence.mjs),
 * and writes its verdict into `data/progress.json` and its notes back into
 * `learn/<topic>/notes.json`. The site reads both.
 */

export type CurriculumVideo = {
  title: string;
  url: string;
  channel?: string;
  minutes?: number;
  /** The length as YouTube shows it, e.g. "17:13". */
  length?: string;
  /** Views when the pack was written. Measured off the watch page, never guessed. */
  views?: number;
  /** Likes at the same moment. */
  likes?: number;
  /** The date the video was uploaded. */
  published?: string;
  /** The date the numbers above were read. If this is missing, the numbers are stale. */
  measuredOn?: string;
  why: string;
  order?: number;
};

export type CurriculumReference = {
  title: string;
  url: string;
  why: string;
};

export type CurriculumTest = {
  stdin: string;
  stdout: string;
  public?: boolean;
};

export type CurriculumTask = {
  id: string;
  title: string;
  points: number;
  prompt: string;
  starter: string;
  solutionFile: string;
  explainTarget: string;
  hints: string[];
  tests: CurriculumTest[];
};

export type CurriculumRubricItem = {
  id: string;
  q: string;
  a: string;
  keywords: string[];
  partial?: string;
};

export type CurriculumSection = {
  h: string;
  md: string;
};

export type CurriculumPack = {
  topic: {
    id: string;
    title: string;
    language: string;
    category: string;
    difficulty: string;
    dateCreated: string;
    lastUpdated: string;
    tags: string[];
    description: string;
    learningNotes: { whatILearned: string; challenges: string; nextSteps: string };
  };
  files: unknown[];
  curriculum: {
    summary: string;
    prerequisites?: string[];
    estimatedMinutes?: number;
    rules?: { writingMaxChars?: number; commentPolicy?: string; notePolicy?: string };
    explanation: CurriculumSection[];
    videos: CurriculumVideo[];
    references: CurriculumReference[];
    tasks: CurriculumTask[];
    rubric: { written: CurriculumRubricItem[] };
  };
};

export type CurriculumIndexEntry = {
  id: string;
  title: string;
  language: string;
  category: string;
  difficulty: string;
  dateCreated: string;
  lastUpdated: string;
  minutes: number;
  points: number;
  tags: string[];
  description: string;
  topicFile: string;
  learnDir: string;
};

export type CurriculumIndex = {
  metadata: { siteName: string; lastUpdated: string; totalTopics: number; languages: string[] };
  topics: CurriculumIndexEntry[];
};

export type TaskNoise = {
  expected: string;
  actual: string;
};

export type TaskEvidence = {
  id: string;
  title: string;
  status:
    | "passed"
    | "partial"
    | "failed"
    | "compile-error"
    | "not-submitted"
    | "not-started";
  passed: number;
  total: number;
  points: number;
  maxPoints: number;
  compileError: string | null;
  failing: Array<{ expected: string; actual: string; error: string | null }>;
  /** The expected answer was found, but the output carries extra text too. */
  noisy?: Array<{ expected: string; actual: string }>;
  explain?: {
    score: number;
    flags: Array<{ kind: string; line: number; text: string; message: string }>;
    stats: { lines: number; comments: number; whyComments: number; significantLines: number };
  };
};

/** The machine facts: what happened, without any judgement attached. */
export type Evidence = {
  generatedAt: string;
  compiler: { bin: string; version: string } | null;
  topics: Record<
    string,
    {
      id: string;
      title: string;
      language: string;
      submitted: number;
      tasks: Record<string, TaskEvidence>;
      code: Record<string, string>;
      answers: Record<string, string>;
      learnerNotes: Record<string, string>;
      written: {
        score: number;
        answered: number;
        total: number;
        perQuestion: Array<{
          id: string;
          q: string;
          answered: boolean;
          score: number;
          hits: string[];
          missing: string[];
          feedback: string;
        }>;
      };
      notes: {
        score: number;
        filledCount: number;
        total: number;
        perField: Array<{
          field: string;
          label: string;
          filled: boolean;
          tooLong: boolean;
          chars: number;
          text: string;
          feedback: string;
        }>;
      };
      explain: {
        score: number;
        flags: Array<{ kind: string; line: number; text: string; message: string; file?: string }>;
        perFile: Array<{
          id: string;
          score: number;
          flags: Array<{ kind: string; line: number; text: string; message: string }>;
          stats: { lines: number; comments: number; whyComments: number; significantLines: number };
        }>;
      };
    }
  >;
};

/** The machine facts: what happened, without any judgement attached. */
export type TopicProgress = {
  id: string;
  title: string;
  language: string;
  /** The human (or Claude) judgement — the one that counts. */
  verdict?: {
    status: string;
    score: number;
    by: string;
    at: string;
    review: string;
    misconceptions: string[];
  };
  /** The deterministic numbers: compile, tests, comments, keyword coverage. */
  machine?: {
    score: number;
    tasksPassed: number;
    tasksTotal: number;
    written: number;
    explain: number;
    compileErrors: number;
  };
  notes?: { whatILearned: string; challenges: string; nextSteps: string };
  reviewPath?: string;
  lastRun: string;
};

export type Progress = {
  generatedAt: string;
  compiler: { bin: string; version: string } | null;
  topics: Record<string, TopicProgress>;
};

const ROOT = process.cwd();

function readJson<T>(relativePath: string): T | null {
  const path = join(ROOT, relativePath);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch {
    return null;
  }
}

export function getCurriculumIndex(): CurriculumIndex {
  return (
    readJson<CurriculumIndex>("curriculum/index.json") ?? {
      metadata: { siteName: "AI Curriculum", lastUpdated: "", totalTopics: 0, languages: [] },
      topics: [],
    }
  );
}

export function getCurriculumTopic(id: string): CurriculumPack | null {
  const index = getCurriculumIndex();
  const entry = index.topics.find((topic) => topic.id === id);
  if (!entry) return null;
  return readJson<CurriculumPack>(entry.topicFile);
}

export function getProgress(): Progress | null {
  return readJson<Progress>("data/progress.json");
}

export function getEvidence(): Evidence | null {
  return readJson<Evidence>("data/evidence.json");
}

export function getTopicProgress(id: string): TopicProgress | null {
  return getProgress()?.topics?.[id] ?? null;
}

/** The agent's dated log of every review it has written for this topic. */
export function getTopicHistory(id: string): string[] {
  const index = getCurriculumIndex();
  const entry = index.topics.find((topic) => topic.id === id);
  if (!entry) return [];

  const path = join(ROOT, entry.learnDir ?? `learn/${id}`, "history.md");
  if (!existsSync(path)) return [];

  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "));
}
