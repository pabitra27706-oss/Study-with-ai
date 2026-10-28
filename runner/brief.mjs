#!/usr/bin/env node
/**
 * brief.mjs — the judging brief.
 *
 *   node runner/brief.mjs c-loops          one topic
 *   node runner/brief.mjs c-loops --task t1 one task only
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

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
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
