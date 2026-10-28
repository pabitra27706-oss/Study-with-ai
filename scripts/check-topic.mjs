#!/usr/bin/env node
/**
 * check-topic.mjs — the topic validator.
 *
 *   node scripts/check-topic.mjs                  check every topic in the index
 *   node scripts/check-topic.mjs <id>             check one topic
 *   node scripts/check-topic.mjs <id> --deep      also compile and run every
 *                                                reference solution against
 *                                                the task's own tests
 *
 * A topic pack is only as good as the promises it makes. This script is what
 * stops the pack from making a promise it cannot keep:
 *
 *   - every video has a real reach number, and it is big enough to be worth
 *     the learner's time (the pack that shipped a 327-view video failed here);
 *   - every video says WHY it is in the pack;
 *   - every task has at least one hidden test, so passing it means something;
 *   - the points add up to exactly 100;
 *   - every task has a reference solution on disk, and that solution passes;
 *   - the index agrees with the pack.
 *
 * It exits 1 on the first failing topic, so it can be a pre-commit gate.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { compileAndRun } from "../runner/lib/sandbox.mjs";
import { checkExplainability } from "../runner/lib/explain.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * The floor for a video to be worth putting in front of the learner.
 *
 * 100,000 views is roughly 1% of a good channel's back catalogue and about
 * 300x the video that was rejected when this topic was written (327 views,
 * 12 likes, from a channel with no audience for the topic). If a video cannot
 * clear this bar it does not go in the pack — it goes in `references`, or it
 * goes nowhere.
 */
const MIN_VIEWS = 100_000;

/** A pack must be able to teach something on its own. */
const MIN_SECTIONS = 6;
const MIN_VIDEOS = 3;
const MIN_TASKS = 4;
const MIN_RUBRIC = 3;
const MIN_HIDDEN_TESTS = 1;

const args = process.argv.slice(2);
const deep = args.includes("--deep");
const only = args.filter((arg) => !arg.startsWith("--"))[0] ?? null;

const failures = [];

function fail(topicId, message) {
  failures.push(`${topicId}: ${message}`);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    return { __parseError: String(error.message ?? error) };
  }
}

/* ------------------------------------------------------------------ checks */

function checkPack(topicId, pack, index) {
  if (pack.__parseError) {
    fail(topicId, `the pack does not parse: ${pack.__parseError}`);
    return;
  }

  const { topic, curriculum } = pack;

  if (!topic || !curriculum) {
    fail(topicId, "the pack is missing `topic` or `curriculum`");
    return;
  }

  // --- identity -----------------------------------------------------------
  if (topic.id !== topicId) fail(topicId, `topic.id is "${topic.id}" but the file is "${topicId}.json"`);
  for (const key of ["title", "language", "category", "difficulty", "description"]) {
    if (!topic[key] || String(topic[key]).trim() === "") fail(topicId, `topic.${key} is empty`);
  }
  if (!Array.isArray(topic.tags) || topic.tags.length === 0) {
    fail(topicId, "topic.tags is empty");
  }

  if (!curriculum.summary || curriculum.summary.length < 120) {
    fail(topicId, "curriculum.summary is missing or too thin to be useful");
  }

  // --- the teaching -------------------------------------------------------
  const sections = curriculum.explanation ?? [];
  if (sections.length < MIN_SECTIONS) {
    fail(topicId, `only ${sections.length} explanation sections, need at least ${MIN_SECTIONS}`);
  }
  sections.forEach((section, i) => {
    if (!section.h || !section.md) fail(topicId, `explanation section ${i + 1} is missing h or md`);
    else if (section.md.length < 120) {
      fail(topicId, `explanation section "${section.h}" is only ${section.md.length} characters`);
    }
  });

  // --- the videos: the part that was wrong last time ----------------------
  const videos = curriculum.videos ?? [];
  if (videos.length < MIN_VIDEOS) fail(topicId, `only ${videos.length} videos, need at least ${MIN_VIDEOS}`);

  videos.forEach((video, i) => {
    const label = video.title ? `video ${i + 1} ("${video.title}")` : `video ${i + 1}`;

    if (!video.url || !/^https:\/\//.test(video.url)) fail(topicId, `${label} has no https url`);
    if (!video.channel) fail(topicId, `${label} has no channel`);
    if (!video.why || video.why.length < 40) {
      fail(topicId, `${label} has no usable "why" — say why the learner should watch it`);
    }
    if (!video.length) fail(topicId, `${label} has no length`);

    if (typeof video.views !== "number" || !Number.isFinite(video.views)) {
      fail(topicId, `${label} has no measured view count`);
    } else if (video.views < MIN_VIEWS) {
      fail(
        topicId,
        `${label} has ${video.views.toLocaleString("en-IN")} views, below the ${MIN_VIEWS.toLocaleString("en-IN")} floor — find a better video`,
      );
    }

    if (typeof video.likes !== "number" || video.likes <= 0) {
      fail(topicId, `${label} has no measured like count`);
    }
    if (!video.published) fail(topicId, `${label} has no upload date`);
    if (!video.measuredOn) fail(topicId, `${label} has no "measuredOn" date — record when you checked the numbers`);
  });

  // --- the references -----------------------------------------------------
  (curriculum.references ?? []).forEach((reference, i) => {
    if (!reference.title || !reference.url || !reference.why) {
      fail(topicId, `reference ${i + 1} is missing title, url or why`);
    }
  });

  // --- the tasks ----------------------------------------------------------
  const tasks = curriculum.tasks ?? [];
  if (tasks.length < MIN_TASKS) fail(topicId, `only ${tasks.length} tasks, need at least ${MIN_TASKS}`);

  const seenTaskIds = new Set();
  let points = 0;

  for (const task of tasks) {
    const label = task.id ? `task ${task.id}` : "a task";

    if (!task.id || !/^t\d+$/.test(task.id)) fail(topicId, `${label} has an id that is not t1, t2, ...`);
    if (seenTaskIds.has(task.id)) fail(topicId, `${label} is listed twice`);
    seenTaskIds.add(task.id);

    if (!task.title) fail(topicId, `${label} has no title`);
    if (!task.prompt || task.prompt.length < 40) fail(topicId, `${label} has no usable prompt`);
    if (!task.starter || !task.starter.includes("main")) fail(topicId, `${label} has no starter code`);
    if (!task.explainTarget) fail(topicId, `${label} has no explainTarget`);
    if (!Array.isArray(task.hints) || task.hints.length === 0) fail(topicId, `${label} has no hints`);

    points += Number(task.points ?? 0);

    const tests = task.tests ?? [];
    if (tests.length < 2) fail(topicId, `${label} has fewer than 2 tests`);
    const hidden = tests.filter((test) => test.public === false).length;
    if (hidden < MIN_HIDDEN_TESTS) {
      fail(topicId, `${label} has ${hidden} hidden tests, need at least ${MIN_HIDDEN_TESTS} — a public-only task proves nothing`);
    }
    for (const test of tests) {
      if (typeof test.stdin !== "string" || typeof test.stdout !== "string") {
        fail(topicId, `${label} has a test with no stdin or stdout`);
      }
    }

    // --- the reference solution must exist --------------------------------
    const referencePath = join(ROOT, "curriculum/reference", topicId, `${task.id}.c`);
    if (!existsSync(referencePath)) {
      fail(topicId, `${label} has no reference solution at curriculum/reference/${topicId}/${task.id}.c`);
    }
    if (task.solutionFile !== `curriculum/reference/${topicId}/${task.id}.c`) {
      fail(topicId, `${label} has solutionFile "${task.solutionFile}", expected curriculum/reference/${topicId}/${task.id}.c`);
    }
  }

  if (points !== 100) fail(topicId, `the tasks add up to ${points} points, expected exactly 100`);

  // --- the written rubric ------------------------------------------------
  const rubric = curriculum.rubric?.written ?? [];
  if (rubric.length < MIN_RUBRIC) fail(topicId, `only ${rubric.length} rubric questions, need at least ${MIN_RUBRIC}`);

  const seenQuestionIds = new Set();
  for (const item of rubric) {
    if (!item.id || !item.q || !item.a) fail(topicId, "a rubric question is missing id, q or a");
    if (seenQuestionIds.has(item.id)) fail(topicId, `rubric question ${item.id} is listed twice`);
    seenQuestionIds.add(item.id);
    if (!Array.isArray(item.keywords) || item.keywords.length < 2) {
      fail(topicId, `rubric question ${item.id} needs at least 2 keywords`);
    }
  }

  // --- the index must agree with the pack --------------------------------
  const entry = index.topics.find((topic) => topic.id === topicId);
  if (!entry) {
    fail(topicId, "the topic is not listed in curriculum/index.json");
  } else {
    if (entry.topicFile !== `curriculum/topics/${topicId}.json`) {
      fail(topicId, `index.topicFile is "${entry.topicFile}"`);
    }
    if (entry.points !== points) {
      fail(topicId, `index says ${entry.points} points but the tasks add up to ${points}`);
    }
    if (!entry.learnDir) fail(topicId, "index entry has no learnDir");
    else if (!existsSync(join(ROOT, entry.learnDir))) {
      fail(topicId, `index.learnDir "${entry.learnDir}" does not exist`);
    }
  }
}

/* --------------------------------------------------------------------- deep */

async function checkReferences(topicId, pack) {
  const dir = join(ROOT, "curriculum/reference", topicId);

  for (const task of pack.curriculum.tasks) {
    const path = join(dir, `${task.id}.c`);
    if (!existsSync(path)) continue;

    const source = readFileSync(path, "utf8");
    const outcome = await compileAndRun(source, task.tests);

    if (outcome.status !== "graded") {
      fail(topicId, `the reference solution for ${task.id} does not compile: ${outcome.compileError}`);
      continue;
    }
    if (outcome.passed !== outcome.total) {
      fail(
        topicId,
        `the reference solution for ${task.id} passes ${outcome.passed}/${outcome.total} of its own tests`,
      );
    }

    const explain = checkExplainability(source);
    if (explain.score !== 100) {
      fail(
        topicId,
        `the reference solution for ${task.id} scores ${explain.score}/100 on "the code explains itself"`,
      );
      for (const flag of explain.flags) {
        fail(topicId, `  ${task.id} line ${flag.line}: ${flag.message}`);
      }
    }
  }
}

/* --------------------------------------------------------------------- run */

const indexPath = join(ROOT, "curriculum/index.json");
if (!existsSync(indexPath)) {
  console.error("curriculum/index.json not found.");
  process.exit(1);
}
const index = readJson(indexPath);

const topicIds = only
  ? [only]
  : index.topics.map((topic) => topic.id);

console.log("");
console.log(`  Checking ${topicIds.length} topic pack(s). Video floor: ${MIN_VIEWS.toLocaleString("en-IN")} views.`);
console.log("");

for (const topicId of topicIds) {
  const before = failures.length;

  const packPath = join(ROOT, "curriculum/topics", `${topicId}.json`);
  if (!existsSync(packPath)) {
    fail(topicId, `no pack at curriculum/topics/${topicId}.json`);
  } else {
    const pack = readJson(packPath);
    checkPack(topicId, pack, index);
    if (deep && !pack.__parseError) await checkReferences(topicId, pack);
  }

  const added = failures.length - before;
  if (added === 0) {
    const pack = readJson(packPath);
    const videos = pack.curriculum?.videos ?? [];
    const lowest = videos.length
      ? Math.min(...videos.map((video) => video.views ?? 0)).toLocaleString("en-IN")
      : "—";
    console.log(`  PASS  ${topicId}  (${videos.length} videos, lowest ${lowest} views)`);
  } else {
    console.log(`  FAIL  ${topicId}  (${added} problem${added === 1 ? "" : "s"})`);
  }
}

console.log("");
if (failures.length) {
  for (const message of failures) console.log(`  x  ${message}`);
  console.log("");
  console.log(`  ${failures.length} problem(s).`);
  console.log("");
  process.exit(1);
}

console.log("  Everything holds.");
console.log("");
