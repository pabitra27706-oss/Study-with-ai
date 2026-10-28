#!/usr/bin/env node
/**
 * apply-verdict.mjs — write a verdict into the repository.
 *
 *   node runner/apply-verdict.mjs c-loops
 *
 * Reads learn/<topic>/verdict.json (the judgement), and writes everything that
 * follows from it:
 *
 *   learn/<topic>/notes.json     the three notes lines, in the learner's voice
 *   learn/<topic>/review.md      the written review
 *   learn/<topic>/history.md     a dated line per judgement
 *   curriculum/topics/<id>.json  the topic's learningNotes, refreshed
 *   data/progress.json           the verdict and the machine facts together
 *
 * The judgement is written by a person — in practice, me, in the conversation
 * with the learner. This script does not judge anything; it makes sure the
 * judgement lands in the repository in the same shape every time, so the site,
 * the git history and the archive all stay in step.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { collectEvidence } from "./evidence.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const only = args.filter((arg) => !arg.startsWith("--"))[0];

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

/** One line, capped — a note that needs a bullet list is not understood yet. */
function oneLine(text, maxChars = 220) {
  const flat = String(text ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean)
    .join(" · ");
  return flat.length > maxChars ? `${flat.slice(0, maxChars - 1).trimEnd()}…` : flat;
}

const index = readJson(join(ROOT, "curriculum/index.json"));
if (!index) {
  console.error("curriculum/index.json not found.");
  process.exit(1);
}

const entries = only
  ? index.topics.filter((entry) => entry.id === only || entry.title === only)
  : index.topics;

if (!entries.length) {
  console.error(`No topic matches "${only}".`);
  process.exit(1);
}

const evidence = await collectEvidence({ root: ROOT, index });
mkdirSync(join(ROOT, "data"), { recursive: true });
writeFileSync(
  join(ROOT, "data/evidence.json"),
  `${JSON.stringify(evidence, null, 2)}\n`,
);

const progress = readJson(join(ROOT, "data/progress.json"), {
  generatedAt: new Date().toISOString(),
  compiler: null,
  topics: {},
});
progress.generatedAt = new Date().toISOString();
progress.compiler = evidence.compiler;
delete progress.provider;

let applied = 0;

for (const entry of entries) {
  const pack = readJson(join(ROOT, entry.topicFile));
  const topicEvidence = evidence.topics[entry.id];
  const learnDir = join(ROOT, entry.learnDir ?? `learn/${entry.id}`);

  const verdictPath = join(learnDir, "verdict.json");
  const raw = readJson(verdictPath);
  if (!raw) {
    console.log(`  ${entry.id}: no verdict.json yet — nothing to apply.`);
    continue;
  }

  const now = new Date();
  const status = String(raw.verdict ?? "incomplete");
  const score = Math.max(0, Math.min(100, Math.round(Number(raw.score) || 0)));

  const notes = {
    whatILearned: oneLine(raw.whatILearned),
    challenges: oneLine(raw.challenges),
    nextSteps: oneLine(raw.nextSteps),
  };

  writeJson(join(learnDir, "notes.json"), notes);

  const review = [
    `# Review — ${pack.topic.title}`,
    "",
    `**${status}** · **${score}%** · judged ${now.toISOString().slice(0, 16).replace("T", " ")} by ${raw.by ?? "the reviewer"}`,
    "",
    String(raw.review ?? "").trim(),
    "",
    raw.misconceptions?.length
      ? [
          "## Misconceptions to unlearn",
          "",
          ...raw.misconceptions.map((item) => `- ${item}`),
          "",
        ].join("\n")
      : "",
    "## Notes",
    "",
    `- **What I learned** — ${notes.whatILearned}`,
    `- **What broke** — ${notes.challenges}`,
    `- **What is next** — ${notes.nextSteps}`,
    "",
  ].join("\n");

  writeFileSync(join(learnDir, "review.md"), review);

  const passedTasks = Object.values(topicEvidence.tasks).filter(
    (task) => task.status === "passed",
  ).length;
  const totalTasks = Object.keys(topicEvidence.tasks).length;

  // One dated line per judgement. Re-applying the same verdict on the same day
  // replaces the line instead of stacking a duplicate.
  const historyPath = join(learnDir, "history.md");
  const historyLine = `- ${now.toISOString().slice(0, 10)} — **${status}** (${score}%) · ${passedTasks}/${totalTasks} tasks · ${notes.challenges || "no failures"}`;
  const existing = existsSync(historyPath) ? readFileSync(historyPath, "utf8") : "";
  const lines = existing.trimEnd().split("\n").filter(Boolean);
  const last = lines[lines.length - 1];

  if (last && last.startsWith(`- ${now.toISOString().slice(0, 10)} —`) && last.includes(`**${status}** (${score}%)`)) {
    lines[lines.length - 1] = historyLine;
  } else {
    lines.push(historyLine);
  }
  writeFileSync(historyPath, `${lines.join("\n")}\n`);

  pack.topic.learningNotes = notes;
  pack.topic.lastUpdated = now.toISOString();
  writeJson(join(ROOT, entry.topicFile), pack);

  const machineScore = machineScoreFor(topicEvidence);

  progress.topics[entry.id] = {
    id: entry.id,
    title: pack.topic.title,
    language: pack.topic.language,
    verdict: {
      status,
      score,
      by: raw.by ?? "the reviewer",
      at: now.toISOString(),
      review: String(raw.review ?? "").trim(),
      misconceptions: Array.isArray(raw.misconceptions) ? raw.misconceptions : [],
    },
    machine: {
      score: machineScore.score,
      tasksPassed: passedTasks,
      tasksTotal: totalTasks,
      written: topicEvidence.written.score,
      explain: topicEvidence.explain.score,
      compileErrors: Object.values(topicEvidence.tasks).filter((task) => task.compileError).length,
    },
    notes,
    reviewPath: `${entry.learnDir ?? `learn/${entry.id}`}/review.md`,
    lastRun: now.toISOString(),
  };

  applied += 1;
  console.log(
    `  ${entry.id}  ${status} ${score}%  (machine ${machineScore.score}%)  → notes.json, review.md, history.md`,
  );
}

writeJson(join(ROOT, "data/progress.json"), progress);

if (!applied) {
  console.log("\n  Nothing applied. Write your verdict to learn/<topic>/verdict.json first.");
} else {
  console.log("\n  Now commit and push — the site rebuilds from the committed files:");
  console.log("    git add -A && git commit -m 'review: <topic> — <verdict>' && git push");
}
console.log("");

/** The deterministic numbers — the facts, not the judgement. */
function machineScoreFor(topicEvidence) {
  const tasks = Object.values(topicEvidence.tasks);
  const earned = tasks.reduce((sum, task) => sum + task.points, 0);
  const max = tasks.reduce((sum, task) => sum + task.maxPoints, 0);
  const tasksScore = max ? Math.round((earned / max) * 100) : 0;

  return {
    score: Math.round(
      0.7 * tasksScore +
        0.15 * topicEvidence.written.score +
        0.1 * topicEvidence.explain.score,
    ),
    breakdown: {
      tasks: tasksScore,
      written: topicEvidence.written.score,
      explain: topicEvidence.explain.score,
    },
  };
}
