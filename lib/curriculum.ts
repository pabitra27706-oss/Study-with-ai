import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * The curriculum is the teaching layer: AI-written topic packs with an
 * explanation, curated videos, machine-checked tasks and a written rubric.
 *
 * The learner's own work lives in `learn/<topic>/` and is graded by
 * `runner/grade.mjs` into `data/progress.json`. The site reads both.
 */

export type CurriculumVideo = {
  title: string;
  url: string;
  channel?: string;
  minutes?: number;
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

export type TaskProgress = {
  id: string;
  title: string;
  status: "passed" | "partial" | "failed" | "compile-error" | "not-started";
  passed: number;
  total: number;
  points: number;
  maxPoints: number;
  compileError: string | null;
  failing: Array<{ expected: string; actual: string; error: string | null }>;
  explain?: { score: number; flags: Array<{ kind: string; line: number; text: string; message: string }> };
};

export type TopicProgress = {
  id: string;
  title: string;
  language: string;
  status: "not-started" | "learning" | "done" | "mastered";
  score: number;
  breakdown: { tasks: number; written: number; notes: number; explain: number };
  tasks: Record<string, TaskProgress>;
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
    perField: Array<{ field: string; label: string; filled: boolean; tooLong: boolean; chars: number; text: string; feedback: string }>;
  };
  explain: {
    score: number;
    flags: Array<{ kind: string; line: number; text: string; message: string; file?: string }>;
    perFile: Array<{ id: string; score: number; flags: Array<{ kind: string; line: number; text: string; message: string }>; stats: { lines: number; comments: number; whyComments: number; significantLines: number } }>;
  };
  aiReview?: { markdown?: string; error?: string; at: string };
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

export function getTopicProgress(id: string): TopicProgress | null {
  return getProgress()?.topics?.[id] ?? null;
}
