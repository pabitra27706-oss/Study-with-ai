#!/usr/bin/env node
/**
 * grade.mjs — the grader.
 *
 *   node runner/grade.mjs                 grade every topic
 *   node runner/grade.mjs c-loops         grade one topic
 *   node runner/grade.mjs --solutions DIR grade the solutions in DIR instead
 *   node runner/grade.mjs --json          print the report as JSON
 *
 * It compiles each submitted C file, runs it against the task's test cases,
 * checks that the code explains itself, scores the written answers against the
 * rubric, and writes the result to data/progress.json.
 *
 * It needs nothing but Node and a C compiler — `pkg install clang` in Termux,
 * `gcc` anywhere else. No network, no API key, no cost.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { compileAndRun, detectCompiler } from "./lib/sandbox.mjs";
import { checkExplainability } from "./lib/explain.mjs";
import { scoreAnswers, scoreNotes } from "./lib/rubric.mjs";
import { aiReview } from "./lib/llm.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const C = {
  reset: "[0m",
  bold: "[1m",
  dim: "[2m",
  red: "[31m",
  green: "[32m",
  yellow: "[33m",
  blue: "[34m",
  cyan: "[36m",
  grey: "[90m",
};

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const quiet = args.includes("--quiet");
const solutionsOverrideIndex = args.indexOf("--solutions");
const solutionsOverride =
  solutionsOverrideIndex === -1 ? null : args[solutionsOverrideIndex + 1];
const only = args.filter(
  (arg, index) =>
    !arg.startsWith("--") && !(solutionsOverrideIndex !== -1 && index === solutionsOverrideIndex + 1),
)[0];
const useAi = !args.includes("--no-ai") && Boolean(process.env.GEMINI_API_KEY);

/** Weighting of the four parts of a topic score. */
const WEIGHTS = { tasks: 0.7, written: 0.15, notes: 0.05, explain: 0.1 };

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function taskStatus(passed, total) {
  if (passed === total) return "passed";
  if (passed > 0) return "partial";
  return "failed";
}

async function gradeTopic(entry) {
  const pack = readJson(join(ROOT, entry.topicFile));
  const curriculum = pack.curriculum;
  const topic = pack.topic;

  const learnDir = join(ROOT, entry.learnDir ?? `learn/${entry.id}`);
  const solutionsDir = solutionsOverride
    ? resolve(ROOT, solutionsOverride)
    : join(learnDir, "solutions");

  const answersPath = join(learnDir, "answers.json");
  const notesPath = join(learnDir, "notes.json");

  const tasks = {};
  let taskPoints = 0;
  let maxTaskPoints = 0;
  let anySubmission = false;

  for (const task of curriculum.tasks) {
    maxTaskPoints += task.points;

    const solutionPath = join(solutionsDir, `${task.id}.c`);
    if (!existsSync(solutionPath)) {
      tasks[task.id] = {
        id: task.id,
        title: task.title,
        status: "not-started",
        passed: 0,
        total: task.tests.length,
        points: 0,
        maxPoints: task.points,
        failing: [],
        compileError: null,
      };
      continue;
    }

    anySubmission = true;
    const source = readFileSync(solutionPath, "utf8");
    const outcome = await compileAndRun(source, task.tests);

    const points =
      outcome.total > 0
        ? Math.round((outcome.passed / outcome.total) * task.points)
        : 0;
    taskPoints += points;

    tasks[task.id] = {
      id: task.id,
      title: task.title,
      status:
        outcome.status === "graded"
          ? taskStatus(outcome.passed, outcome.total)
          : outcome.status,
      passed: outcome.passed,
      total: outcome.total,
      points,
      maxPoints: task.points,
      compileError: outcome.compileError ?? null,
      failing: outcome.results
        .filter((result) => !result.ok)
        .map((result) => ({
          expected: result.expected,
          actual: result.actual,
          error: result.error,
        })),
      explain: checkExplainability(source),
    };
  }

  const answers = existsSync(answersPath) ? readJson(answersPath) : {};
  const learningNotes = existsSync(notesPath) ? readJson(notesPath) : {};

  const written = scoreAnswers(answers, curriculum.rubric?.written ?? []);
  const notes = scoreNotes(learningNotes, curriculum.rules);
  const explain = averageExplain(tasks);

  const score = Math.round(
    WEIGHTS.tasks * percent(taskPoints, maxTaskPoints) +
      WEIGHTS.written * written.score +
      WEIGHTS.notes * Math.max(0, notes.score) +
      WEIGHTS.explain * explain.score,
  );

  const allTasksPassed = Object.values(tasks).every(
    (task) => task.status === "passed" || task.status === "not-started",
  );
  const submitted = Object.values(tasks).filter((task) => task.status !== "not-started");

  const status = !anySubmission
    ? "not-started"
    : score >= 90 && allTasksPassed && submitted.length === curriculum.tasks.length
      ? "mastered"
      : score >= 70 && allTasksPassed
        ? "done"
        : "learning";

  const result = {
    id: topic.id,
    title: topic.title,
    language: topic.language,
    status,
    score: Math.max(0, Math.min(100, score)),
    breakdown: {
      tasks: percent(taskPoints, maxTaskPoints),
      written: written.score,
      notes: Math.max(0, notes.score),
      explain: explain.score,
    },
    tasks,
    written: {
      score: written.score,
      answered: written.answered,
      total: written.total,
      perQuestion: written.perQuestion,
    },
    notes: {
      score: notes.score,
      filledCount: notes.filledCount,
      total: notes.total,
      perField: notes.perField,
    },
    explain,
    lastRun: new Date().toISOString(),
  };

  if (useAi) {
    const review = await aiReview({
      topic,
      pack,
      answers,
      notes: learningNotes,
      results: { tasks, written },
      apiKey: process.env.GEMINI_API_KEY,
    });
    result.aiReview = review.ok
      ? { markdown: review.markdown, at: new Date().toISOString() }
      : { error: review.error, at: new Date().toISOString() };
  }

  return result;
}

function averageExplain(tasks) {
  const graded = Object.values(tasks).filter((task) => task.explain);
  if (!graded.length) return { score: 0, flags: [], perFile: [] };
  const score = Math.round(
    graded.reduce((total, task) => total + task.explain.score, 0) / graded.length,
  );
  return {
    score,
    flags: graded.flatMap((task) =>
      task.explain.flags.map((flag) => ({ ...flag, file: task.id })),
    ),
    perFile: graded.map((task) => ({
      id: task.id,
      score: task.explain.score,
      flags: task.explain.flags,
      stats: task.explain.stats,
    })),
  };
}

function percent(part, whole) {
  return whole ? Math.round((part / whole) * 100) : 0;
}

/* ------------------------------------------------------------------ report */

function bar(value, width = 24) {
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function printReport(progress) {
  const c = C;
  console.log("");
  console.log(`${c.bold}${c.cyan}  Learning progress${c.reset}`);
  console.log(`${c.grey}  ${new Date(progress.generatedAt).toLocaleString("en-GB")}  ·  ${progress.compiler?.version ?? "no compiler"}${c.reset}`);
  console.log("");

  for (const topic of Object.values(progress.topics)) {
    const tone =
      topic.status === "mastered"
        ? c.green
        : topic.status === "done"
          ? c.cyan
          : topic.status === "learning"
            ? c.yellow
            : c.grey;

    console.log(`  ${c.bold}${topic.title}${c.reset}  ${tone}${topic.status}${c.reset}`);
    console.log(
      `  ${tone}${bar(topic.score)}${c.reset} ${c.bold}${topic.score}%${c.reset}   ` +
        `${c.grey}tasks ${topic.breakdown.tasks}%  ·  written ${topic.breakdown.written}%  ·  notes ${topic.breakdown.notes}%  ·  explain ${topic.breakdown.explain}%${c.reset}`,
    );

    for (const task of Object.values(topic.tasks)) {
      const mark =
        task.status === "passed"
          ? `${c.green}PASS${c.reset}`
          : task.status === "partial"
            ? `${c.yellow}PART${c.reset}`
            : task.status === "not-started"
              ? `${c.grey}TODO${c.reset}`
              : `${c.red}FAIL${c.reset}`;
      const detail =
        task.status === "compile-error"
          ? `${c.red}${task.compileError}${c.reset}`
          : task.status === "not-started"
            ? ""
            : `${c.grey}${task.passed}/${task.total} tests · ${task.points}/${task.maxPoints} pts${c.reset}`;
      console.log(`    ${mark}  ${task.id} ${task.title.padEnd(24)} ${detail}`);
    }

    const weak = topic.explain.flags.slice(0, 4);
    if (weak.length) {
      console.log(`    ${c.yellow}explain${c.reset} ${c.grey}${weak.length} issue(s)${c.reset}`);
      for (const flag of weak) {
        console.log(`      ${c.grey}· ${flag.file}:${flag.line}  ${flag.message}${c.reset}`);
      }
    }

    for (const question of topic.written.perQuestion.filter((item) => item.score < 1)) {
      console.log(`    ${c.yellow}q${c.reset} ${c.grey}${question.id}: ${question.feedback}${c.reset}`);
    }

    if (topic.aiReview?.markdown) {
      console.log(`    ${c.blue}AI review${c.reset}`);
      for (const line of topic.aiReview.markdown.split("\n")) {
        console.log(`      ${c.grey}${line}${c.reset}`);
      }
    }

    console.log("");
  }
}

/* -------------------------------------------------------------------- main */

async function main() {
  const index = readJson(join(ROOT, "curriculum/index.json"));
  const compiler = await detectCompiler();

  if (!compiler) {
    console.error(
      `${C.red}No C compiler found.${C.reset} Install one: ${C.grey}pkg install clang${C.reset} (Termux) or ${C.grey}apt install gcc${C.reset} (Linux).`,
    );
  }

  const entries = only
    ? index.topics.filter((entry) => entry.id === only || entry.title === only)
    : index.topics;

  if (!entries.length) {
    console.error(`No topic matches "${only}".`);
    process.exit(1);
  }

  const topics = {};
  for (const entry of entries) {
    topics[entry.id] = await gradeTopic(entry);
  }

  const progress = {
    generatedAt: new Date().toISOString(),
    compiler: compiler ?? null,
    topics,
  };

  const outDir = join(ROOT, "data");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "progress.json"), `${JSON.stringify(progress, null, 2)}\n`);

  if (asJson) {
    console.log(JSON.stringify(progress, null, 2));
  } else if (!quiet) {
    printReport(progress);
    console.log(`  ${C.grey}written to data/progress.json${C.reset}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
