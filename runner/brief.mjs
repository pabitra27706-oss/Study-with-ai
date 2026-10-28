#!/usr/bin/env node
/**
 * brief.mjs — the judging brief.
 *
 *   node runner/brief.mjs data-structures-c          one topic
 *   node runner/brief.mjs data-structures-c --task t1 one task only
 *   node runner/brief.mjs --write          also writes data/evidence.json
 *
 * This prints everything needed to judge a submission: what the learner was
 * taught, exactly what the task asked, the code they wrote, the machine facts
 * (does it compile, which test cases pass, which comments restate the code),
 * and their written answers.
 *
 * The judge is a person — in practice, me, in the conversation. There is no
 * API key, no model, no automated agent. This script is the instrument I read
 * before I give a verdict.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { collectEvidence } from "./evidence.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const only = args.filter((arg) => !arg.startsWith("--"))[0];
const taskIndex = args.indexOf("--task");
const onlyTask = taskIndex === -1 ? null : args[taskIndex + 1];
const archiveFlag = args.indexOf("--archive");
const archivePath = archiveFlag === -1 ? null : args[archiveFlag + 1] ?? null;
const wantsPending = args.includes("--pending");

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

/* -------------------------------------------------------------------------- */
/* The archive's own work                                                    */
/* -------------------------------------------------------------------------- */
/*
   Most work in this system is a graded task with a task sheet behind it. A
   file in the Learning Archive often is not: it was written before the engine
   existed, or it is a script with no exercise behind it. There is no task
   sheet, so the task rubric does not apply — the archive rubric does (see
   runbook/JUDGING.md):

     40   does it run?
     30   is it right?
     30   does it explain itself?

   These two modes exist so that "check <anything>" works whatever the thing
   is: a task submission, or a file dropped straight into the archive.
*/

const ARCHIVE = join(ROOT, "archive");

const FENCE_LANGUAGE = {
  ".c": "c",
  ".h": "c",
  ".cpp": "cpp",
  ".py": "python",
  ".js": "javascript",
  ".jsx": "jsx",
  ".ts": "typescript",
  ".java": "java",
  ".cs": "csharp",
  ".go": "go",
  ".rs": "rust",
  ".rb": "ruby",
  ".php": "php",
  ".kt": "kotlin",
  ".swift": "swift",
  ".sql": "sql",
  ".sh": "bash",
  ".html": "html",
  ".css": "css",
  ".json": "json",
  ".md": "markdown",
};

function fenceFor(fileName) {
  const dot = fileName.lastIndexOf(".");
  const extension = dot === -1 ? "" : fileName.slice(dot).toLowerCase();
  return FENCE_LANGUAGE[extension] ?? "";
}

/** The archive's pending list — work that has no verdict yet. */
function readPending() {
  return readJson(join(ARCHIVE, "data", "archive-pending.json"), { count: 0, topics: [] });
}

/** Every topic in the archive, from the catalogue. */
function archiveTopics() {
  const catalogue = readJson(join(ARCHIVE, "data", "index.json"), { topics: [] });
  return catalogue.topics ?? [];
}

/** An archive topic by its id, or by a unique part of its id or its title. */
function findArchiveTopic(query) {
  const needle = String(query ?? "").toLowerCase().trim();
  if (!needle) return [];
  const topics = archiveTopics();
  const exact = topics.filter((topic) => String(topic.id).toLowerCase() === needle);
  if (exact.length) return exact;
  const partial = topics.filter(
    (topic) =>
      String(topic.id).toLowerCase().includes(needle) ||
      String(topic.title ?? "").toLowerCase().includes(needle),
  );
  return partial.length === 1 ? partial : [];
}

const ARCHIVE_RULES = [
  "1. **Run it. Do not guess at it.** The 40 points are for a fact, not an opinion: compile it, run it, feed it input, read the output. A file that cannot be run here is said to be unread, and loses the points it cannot be given.",
  "2. **Say which rubric you used.** A number without its rubric is decoration. The review opens with the rubric — 40 run, 30 right, 30 explains itself — and then the three totals.",
  "3. **The comment band is the same band as everywhere else.** A comment that names the line is not a comment. \"Sorts in place\" explains nothing; \"the default sort compares characters, not numbers\" is a why.",
  "4. **Credit the work that is right.** Say plainly what is correct. Do not invent problems to seem thorough.",
  "5. **Correct the shape, never hand over the finished program.** Give the correction, not the answer.",
  "6. **Write the three notes lines in the learner's voice:** first person, plain, one sentence each, under 220 characters.",
];

function printArchiveFile(file, filePath) {
  const out = [];
  const code = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
  const fence = fenceFor(file.fileName ?? filePath);

  out.push(`### ${file.fileName ?? filePath}`);
  out.push("");
  if (file.description) {
    out.push(`**What it says it is:** ${file.description}`);
    out.push("");
  }
  if (!code) {
    out.push("**The file is missing from disk.**");
    out.push("");
    return out;
  }
  out.push(`**Path:** \`${file.filePath ?? filePath}\``);
  out.push("");
  out.push("```" + fence);
  out.push(code.trimEnd());
  out.push("```");
  out.push("");
  return out;
}

function printArchiveBrief(topic) {
  const payload = readJson(join(ARCHIVE, topic.topicFile), null);
  const out = [];

  out.push(`# Judging brief — ${payload?.topic?.title ?? topic.title} (\`${topic.id}\`)`);
  out.push("");
  out.push(
    "**Rubric:** the archive's own — **40** does it run, **30** is it right, **30** does it explain itself.",
  );
  out.push(
    "**Source:** a file in the Learning Archive. There is no task sheet, so none of the task rules apply.",
  );
  out.push("");
  out.push("## The files");
  out.push("");

  for (const file of payload?.files ?? []) {
    out.push(...printArchiveFile(file, join(ARCHIVE, file.filePath)));
  }

  if (!(payload?.files ?? []).length) {
    out.push("This topic has no files yet.");
    out.push("");
  }

  out.push("## The rules you must apply");
  out.push("");
  ARCHIVE_RULES.forEach((rule) => out.push(rule));
  out.push("");
  out.push("## Output");
  out.push("");
  out.push(
    `Write the verdict into the topic's own file — \`${topic.topicFile}\` — under \`engine\`, with \`learningNotes\` filled in:`,
  );
  out.push("");
  out.push("```json");
  out.push(
    JSON.stringify(
      {
        topic: {
          learningNotes: {
            whatILearned: "one sentence, first person",
            challenges: "one sentence, first person",
            nextSteps: "one sentence, first person",
          },
        },
        engine: {
          verdict: {
            status: "correct | mostly-correct | incomplete | incorrect",
            score: 0,
            by: "Claude",
            at: "YYYY-MM-DD",
          },
          misconceptions: ["short phrase"],
          review: "150-300 words of markdown",
        },
      },
      null,
      2,
    ),
  );
  out.push("```");
  out.push("");
  out.push(
    "Then run `node scripts/build-archive.mjs` and commit. The file is already in the archive — only the judgement is missing.",
  );
  out.push("");

  console.log(out.join("\n"));
}

function printPending() {
  const pending = readPending();
  const out = [];

  out.push("# The pending list — archive work with no verdict yet");
  out.push("");
  if (!pending.count) {
    out.push("Nothing is waiting. Every file in the archive has been judged.");
    out.push("");
    console.log(out.join("\n"));
    return;
  }

  out.push(
    `${pending.count} topic${pending.count === 1 ? "" : "s"} waiting. Newest first — the file that landed last is at the top.`,
  );
  out.push("");

  for (const topic of pending.topics ?? []) {
    out.push(`## ${topic.title} (\`${topic.id}\`)`);
    out.push("");
    out.push(`- **Why it is here:** ${topic.reason}`);
    out.push(`- **Language:** ${topic.language} · **written:** ${topic.dateCreated || "unknown"}`);
    for (const file of topic.files ?? []) {
      out.push(`- **File:** \`${file}\``);
      out.push(`- **Judge it with:** \`node runner/brief.mjs --archive archive/${file}\``);
    }
    out.push("");
  }

  console.log(out.join("\n"));
}

/* --pending: the queue. --archive <file>: one file's brief. */
if (wantsPending) {
  printPending();
  process.exit(0);
}

if (archivePath) {
  /* Accept the path as it is written in the catalogue ("content/c/foo.c"),
     as it is written on disk ("archive/content/c/foo.c"), or absolutely. */
  const candidates = archivePath.startsWith("/")
    ? [archivePath]
    : [
        join(ROOT, archivePath),
        join(ROOT, "archive", archivePath),
        join(ROOT, "archive", "content", archivePath),
      ];
  const full = candidates.find((candidate) => existsSync(candidate));
  if (!full) {
    console.error(`No such file: ${archivePath}`);
    process.exit(1);
  }
  const relative = full.replace(`${ROOT}/`, "");
  const owner = archiveTopics().find((topic) => {
    const payload = readJson(join(ARCHIVE, topic.topicFile), null);
    return (payload?.files ?? []).some((file) => relative.endsWith(file.filePath));
  });
  if (owner) {
    printArchiveBrief(owner);
  } else {
    const out = [];
    out.push(`# Judging brief — ${relative}`);
    out.push("");
    out.push(
      "**Rubric:** the archive's own — **40** does it run, **30** is it right, **30** does it explain itself.",
    );
    out.push("");
    out.push("```" + fenceFor(relative));
    out.push(readFileSync(full, "utf8").trimEnd());
    out.push("```");
    out.push("");
    console.log(out.join("\n"));
  }
  process.exit(0);
}

const index = readJson(join(ROOT, "curriculum/index.json"));
if (!index) {
  console.error("curriculum/index.json not found.");
  process.exit(1);
}

const entries = only
  ? index.topics.filter((entry) => entry.id === only || entry.title === only)
  : index.topics;

/* Not a topic pack? It may be a file in the archive. The archive is an
   input, so "check <anything>" has to work on it too — otherwise a file
   written straight into `archive/content/` has no way to be judged. */
if (!entries.length && only) {
  const archiveMatches = findArchiveTopic(only);
  if (archiveMatches.length) {
    printArchiveBrief(archiveMatches[0]);
    process.exit(0);
  }
}

if (!entries.length) {
  console.error(`No topic matches "${only}".`);
  console.error(
    "If it is a file in the archive, use: node runner/brief.mjs --archive archive/content/<lang>/<file>",
  );
  process.exit(1);
}

const evidence = await collectEvidence({ root: ROOT, index });

if (args.includes("--write")) {
  mkdirSync(join(ROOT, "data"), { recursive: true });
  writeFileSync(
    join(ROOT, "data/evidence.json"),
    `${JSON.stringify(evidence, null, 2)}\n`,
  );
}

const out = [];

for (const entry of entries) {
  const pack = readJson(join(ROOT, entry.topicFile));
  const topicEvidence = evidence.topics[entry.id];
  const { topic, curriculum } = pack;

  const tasks = curriculum.tasks.filter(
    (task) => !onlyTask || task.id === onlyTask,
  );

  out.push(`# Judging brief — ${topic.title} (\`${topic.id}\`)`);
  out.push("");
  out.push(`**Topic:** ${topic.language} · ${topic.category} · ${topic.difficulty}`);
  out.push(`**Summary:** ${curriculum.summary}`);
  out.push("");
  out.push("## What the learner was taught");
  out.push("");
  curriculum.explanation.forEach((section, i) => {
    out.push(`${i + 1}. ${String(section.h).replace(/^\d+\.\s*/, "")}`);
  });
  out.push("");
  out.push("## The tasks");
  out.push("");

  for (const task of tasks) {
    const graded = topicEvidence.tasks[task.id];
    const code = topicEvidence.code[task.id];

    out.push(`### ${task.id} — ${task.title} (${task.points} points)`);
    out.push("");
    out.push(`**Requirement:** ${task.prompt}`);
    out.push("");
    out.push(`**What the comment must explain:** ${task.explainTarget}`);
    out.push("");
    out.push(`**Hints they were given:** ${task.hints.join(" / ")}`);
    out.push("");

    if (!code) {
      out.push("**Submission:** none.");
      out.push("");
      continue;
    }

    out.push("**Submission** — `learn/" + entry.id + "/solutions/" + task.id + ".c`:");
    out.push("");
    out.push("```c");
    out.push(code.trimEnd());
    out.push("```");
    out.push("");

    if (graded.compileError) {
      out.push(`**Does not compile:** \`${graded.compileError}\``);
      out.push("");
    }

    out.push(
      `**Test cases:** ${graded.passed}/${graded.total} pass` +
        (graded.passed === graded.total ? " — all of them." : "."),
    );
    out.push("");

    if (graded.failing.length) {
      out.push("**Failing cases:**");
      out.push("");
      for (const failure of graded.failing) {
        out.push(
          `- expected \`${failure.expected || "(empty)"}\` / got \`${failure.actual || "(nothing)"}\`` +
            (failure.error ? ` — ${failure.error}` : ""),
        );
      }
      out.push("");
    }

    if (graded.noisy?.length) {
      out.push(
        "**The output carries extra text** — the expected answer is in there, but so is more. It passes; decide whether the extra text is acceptable.",
      );
      out.push("");
      for (const noisyCase of graded.noisy) {
        out.push(`- expected \`${noisyCase.expected}\` / got \`${noisyCase.actual}\``);
      }
      out.push("");
    }

    if (graded.explain) {
      out.push(`**Comment check:** ${graded.explain.score}/100`);
      out.push("");
      if (graded.explain.flags.length) {
        for (const flag of graded.explain.flags) {
          out.push(`- line ${flag.line}: ${flag.message} — *"${flag.text}"*`);
        }
      } else {
        out.push("- no problems flagged.");
      }
      out.push("");
      out.push(
        `(${graded.explain.stats.comments} comments, ${graded.explain.stats.whyComments} of them explaining a reason, ${graded.explain.stats.significantLines} lines that needed one.)`,
      );
      out.push("");
    }
  }

  out.push("## The written answers");
  out.push("");

  for (const item of curriculum.rubric.written) {
    const answer = topicEvidence.answers[item.id] ?? "";
    const scored = topicEvidence.written.perQuestion.find((entry) => entry.id === item.id);
    out.push(`**${item.q}**`);
    out.push("");
    out.push(`- A full-credit answer: ${item.a}`);
    out.push(`- Key ideas: ${item.keywords.join(", ")}`);
    out.push(
      `- Keyword coverage: ${scored ? Math.round(scored.score * 100) : 0}%` +
        (scored?.missing?.length ? ` (missing: ${scored.missing.join(", ")})` : ""),
    );
    out.push(`- They wrote: ${answer ? answer : "(not answered)"}`);
    out.push("");
  }

  out.push("## The rules you must apply");
  out.push("");
  out.push(
    "1. **Correctness is necessary but not sufficient.** A program can pass every test and still show a wrong mental model in the written answers, or the reverse. Weigh the answers and the comments as heavily as the test results.",
  );
  out.push(
    "2. **The machine facts are a sensor, not a verdict.** If a test fails because of an off-by-one but their comment shows they know why the boundary matters, say so — do not treat it as a concept failure. If they have no idea why it failed, that is the real problem.",
  );
  out.push(
    "3. **Judge the comments.** A comment must say WHY, never WHAT. `multi = i * multi` with no comment is a gap. A comment that says \"multiply, not add: factorial is a product of 1..n\" is exactly right.",
  );
  out.push(
    "4. **Be specific.** Name the task, the line, the test case, the misconception. \"Review loops\" is useless. \"t3: you divide before taking the remainder, so the last digit is lost — take n % 10 first, then n / 10\" is useful.",
  );
  out.push(
    "5. **Never hand over the full solution as a fix.** Give the correction, not the finished program. They have to write the next one.",
  );
  out.push(
    "6. **Do not invent problems.** If the work is correct and well explained, say it is correct. Padding praise and inventing criticism both waste their time.",
  );
  out.push(
    "7. **Write the three notes lines in the learner's voice:** first person, plain, one sentence each, under 220 characters. They get published as the learner's own notes.",
  );
  out.push("");
  out.push("## Output");
  out.push("");
  out.push(
    `Write your verdict as JSON to \`learn/${entry.id}/verdict.json\`, then run \`node runner/apply-verdict.mjs ${entry.id}\`.`,
  );
  out.push("");
  out.push("```json");
  out.push(
    JSON.stringify(
      {
        verdict: "correct | mostly-correct | incomplete | incorrect",
        score: 0,
        whatILearned: "one sentence, first person",
        challenges: "one sentence, first person",
        nextSteps: "one sentence, first person",
        misconceptions: ["short phrase"],
        review: "150-300 words of markdown",
      },
      null,
      2,
    ),
  );
  out.push("```");
  out.push("");
}

console.log(out.join("\n"));
