#!/usr/bin/env node
/**
 * agent.mjs — the judge, the note-taker, and the keeper of the repository.
 *
 *   node runner/agent.mjs                  judge every topic that has a submission
 *   node runner/agent.mjs c-loops          judge one topic
 *   node runner/agent.mjs --issue          judge a submission that arrived as a GitHub issue
 *   node runner/agent.mjs --dry-run        print the prompt the judge would receive
 *
 * What it does, in order:
 *
 *   1. SENSE   compiles the submission, runs the hidden test cases, checks the
 *              comments, measures the written answers. Writes data/evidence.json.
 *   2. JUDGE   the AI reads the topic, the code and the evidence, and returns a
 *              verdict, a score, and a written review.
 *   3. NOTE    the AI writes the three notes lines, in the learner's voice.
 *   4. KEEP    the notes, the review and a dated history line are written back
 *              into the repository; the topic JSON is refreshed; progress.json
 *              is updated. The site picks it up on the next build.
 *
 * Step 4 is the point: the repository is the memory, and the agent is what
 * keeps it current. Push your work from anywhere, and the repo comes back
 * annotated.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { collectEvidence } from "./evidence.mjs";
import { buildPrompt, parseVerdict, selectProvider } from "./lib/judge.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const fromIssue = args.includes("--issue");
const providerOverride = args.indexOf("--provider");
const only = args.filter(
  (arg, index) =>
    !arg.startsWith("--") &&
    !(providerOverride !== -1 && index === providerOverride + 1),
)[0];

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

/**
 * Collapses a note into a single line and caps it at the topic's character
 * budget. The rule is one sentence per line — a note that needs a bullet list
 * is a note that is not understood yet.
 */
function oneLine(text, maxChars = 220) {
  const flat = String(text ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean)
    .join(" · ");

  return flat.length > maxChars ? `${flat.slice(0, maxChars - 1).trimEnd()}…` : flat;
}

/* ------------------------------------------------------------------ issue */

/**
 * Parses a submission that arrived as a GitHub issue.
 *
 * The issue body is the whole delivery mechanism, because the learner may
 * have written the code in any app on any device. This is the "from anywhere"
 * path.
 *
 *   # Topic: c-loops
 *   # Task: t1
 *
 *   ```c
 *   ...code...
 *   ```
 *
 *   # Answers
 *   q1: when the count is known up front
 *   q2: the boundary is decided first
 */
export function parseIssue(body, { title = "", labels = [] } = {}) {
  const topicFromLabel = labels.find((label) => label.startsWith("topic:"))?.split(":")[1];
  const taskFromLabel = labels.find((label) => label.startsWith("task:"))?.split(":")[1];

  const topic =
    topicFromLabel ??
    body.match(/^#\s*Topic:\s*(\S+)/im)?.[1] ??
    body.match(/topic:\s*(\S+)/i)?.[1] ??
    (title.match(/\[([\w-]+)\]/) ?? [])[1] ??
    null;

  const task = taskFromLabel ?? body.match(/^#\s*Task:\s*(\S+)/im)?.[1] ?? null;

  const codeMatch = body.match(/```(?:c|C|cc|h|clinux)?\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1].trim() : null;

  const answers = {};
  const answersBlock = body.match(/#\s*Answers\s*\n([\s\S]*?)(?=\n#\s|$)/i)?.[1];
  if (answersBlock) {
    for (const line of answersBlock.split("\n")) {
      const match = line.match(/^\s*([a-z]\d+)\s*:\s*(.+)$/i);
      if (match) answers[match[1].toLowerCase()] = match[2].trim();
    }
  }

  return { topic, task, code, answers };
}

/* ------------------------------------------------------------------- main */

async function main() {
  const index = readJson(join(ROOT, "curriculum/index.json"));
  if (!index) {
    console.error("curriculum/index.json not found.");
    process.exit(1);
  }

  // --- stage an issue submission ------------------------------------------
  if (fromIssue) {
    const body = process.env.ISSUE_BODY ?? "";
    const title = process.env.ISSUE_TITLE ?? "";
    const labels = (process.env.ISSUE_LABELS ?? "").split(",").map((l) => l.trim()).filter(Boolean);

    const parsed = parseIssue(body, { title, labels });

    if (!parsed.topic || !parsed.code) {
      console.error(
        "Could not find a topic and a code block in the issue.\n" +
          "Use:\n  # Topic: c-loops\n  # Task: t1\n\n```c\n...code...\n```",
      );
      process.exit(1);
    }

    const entry = index.topics.find((topic) => topic.id === parsed.topic);
    if (!entry) {
      console.error(`Unknown topic "${parsed.topic}".`);
      process.exit(1);
    }

    const learnDir = join(ROOT, entry.learnDir ?? `learn/${entry.id}`);
    const target = join(learnDir, "solutions", `${parsed.task ?? "submission"}.c`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${parsed.code}\n`);

    if (Object.keys(parsed.answers).length) {
      const answersPath = join(learnDir, "answers.json");
      const existing = readJson(answersPath, {});
      writeJson(answersPath, { ...existing, ...parsed.answers });
    }

    console.log(`  staged ${parsed.topic}/${parsed.task ?? "submission"} from the issue`);
  }

  // --- sense ----------------------------------------------------------------
  const evidence = await collectEvidence({ root: ROOT, index });
  writeJson(join(ROOT, "data/evidence.json"), evidence);

  const provider = selectProvider(
    providerOverride !== -1
      ? { ...process.env, AI_PROVIDER: args[providerOverride + 1] }
      : process.env,
  );

  const entries = only
    ? index.topics.filter((entry) => entry.id === only || entry.title === only)
    : index.topics;

  const progress = readJson(join(ROOT, "data/progress.json"), {
    generatedAt: new Date().toISOString(),
    compiler: null,
    topics: {},
  });
  progress.generatedAt = new Date().toISOString();
  progress.compiler = evidence.compiler;
  progress.provider = provider.name;

  const reports = [];
  const skipped = [];

  for (const entry of entries) {
    const topicEvidence = evidence.topics[entry.id];
    if (!topicEvidence) continue;

    const pack = readJson(join(ROOT, entry.topicFile));
    const learnDir = join(ROOT, entry.learnDir ?? `learn/${entry.id}`);

    const hasSubmission = topicEvidence.submitted > 0;
    const hasAnswers = Object.values(topicEvidence.answers).some(
      (value) => typeof value === "string" && value.trim().length > 0,
    );

    if (!hasSubmission && !hasAnswers) {
      // Nothing to judge — keep whatever verdict already exists.
      continue;
    }

    // --- fingerprint: has this exact submission been judged before? --------
    // Without this the agent's own commit would re-trigger the workflow,
    // append to history.md, and commit again — forever.
    const fingerprint = createHash("sha256")
      .update(JSON.stringify({ code: topicEvidence.code, answers: topicEvidence.answers }))
      .digest("hex")
      .slice(0, 16);

    const fingerprintPath = join(learnDir, ".fingerprint");
    const previousFingerprint = existsSync(fingerprintPath)
      ? readFileSync(fingerprintPath, "utf8").trim()
      : null;

    if (
      !force &&
      previousFingerprint === fingerprint &&
      existsSync(join(learnDir, "review.md"))
    ) {
      skipped.push(entry.id);
      console.log(`  ${C.grey}${entry.id}: submission unchanged since the last review — skipping.${C.reset}`);
      continue;
    }

    const prompt = buildPrompt({ pack, evidence: topicEvidence });

    if (dryRun) {
      console.log(prompt);
      return;
    }

    const reply = await provider.complete(prompt, { json: true, maxOutputTokens: 2000 });
    const parsed = reply.ok ? parseVerdict(reply.text) : { ok: false, error: reply.error };

    if (!parsed.ok) {
      console.error(`  ${C.red}judge failed for ${entry.id}:${C.reset} ${parsed.error}`);
      progress.topics[entry.id] = {
        ...(progress.topics[entry.id] ?? {}),
        id: entry.id,
        title: pack.topic.title,
        status: "judge-error",
        error: parsed.error,
        lastRun: new Date().toISOString(),
      };
      continue;
    }

    const verdict = parsed.verdict;
    const now = new Date();

    // --- note: the AI writes the learner's notes -------------------------
    const notes = {
      whatILearned: oneLine(verdict.whatILearned),
      challenges: oneLine(verdict.challenges),
      nextSteps: oneLine(verdict.nextSteps),
    };
    writeJson(join(learnDir, "notes.json"), notes);

    // --- the written review ----------------------------------------------
    const review = [
      `# Review — ${pack.topic.title}`,
      "",
      `**${verdict.verdict}** · **${verdict.score}%** · judged ${now.toISOString().slice(0, 16).replace("T", " ")} by \`${provider.name}\``,
      "",
      verdict.review,
      "",
      verdict.misconceptions.length
        ? ["## Misconceptions to unlearn", "", ...verdict.misconceptions.map((m) => `- ${m}`), ""].join("\n")
        : "",
      "## Notes",
      "",
      `- **What I learned** — ${notes.whatILearned}`,
      `- **What broke** — ${notes.challenges}`,
      `- **What is next** — ${notes.nextSteps}`,
      "",
    ].join("\n");

    writeFileSync(join(learnDir, "review.md"), review);

    // --- history: one dated line per evaluation ---------------------------
    const stamp = now.toISOString().slice(0, 10);
    const passedTasks = Object.values(topicEvidence.tasks).filter((task) => task.status === "passed").length;
    const totalTasks = Object.keys(topicEvidence.tasks).length;
    appendFileSync(
      join(learnDir, "history.md"),
      `- ${stamp} — **${verdict.verdict}** (${verdict.score}%) · ${passedTasks}/${totalTasks} tasks · ${notes.challenges || "no failures"}\n`,
    );

    // --- keep the topic JSON fresh ----------------------------------------
    pack.topic.learningNotes = notes;
    pack.topic.lastUpdated = now.toISOString();
    writeJson(join(ROOT, entry.topicFile), pack);

    writeFileSync(fingerprintPath, `${fingerprint}\n`);

    // --- progress ---------------------------------------------------------
    progress.topics[entry.id] = {
      id: entry.id,
      title: pack.topic.title,
      language: pack.topic.language,
      status: verdict.verdict,
      score: verdict.score,
      provider: provider.name,
      notes,
      misconceptions: verdict.misconceptions,
      tasksPassed: passedTasks,
      tasksTotal: totalTasks,
      reviewPath: `${entry.learnDir ?? `learn/${entry.id}`}/review.md`,
      review: verdict.review,
      lastRun: now.toISOString(),
    };

    reports.push({ id: entry.id, verdict, notes });
  }

  writeJson(join(ROOT, "data/progress.json"), progress);

  // --- a copy the workflow can post as an issue comment --------------------
  if (reports.length) {
    const latest = reports[reports.length - 1];
    const body = [
      `## ${latest.verdict.verdict.toUpperCase()} — ${latest.verdict.score}%`,
      "",
      latest.verdict.review,
      "",
      "### Notes written back to the repository",
      "",
      `- **What I learned** — ${latest.notes.whatILearned}`,
      `- **What broke** — ${latest.notes.challenges}`,
      `- **What is next** — ${latest.notes.nextSteps}`,
      "",
      "_The agent has written these notes into `learn/` and updated `data/progress.json`._",
    ].join("\n");
    mkdirSync(join(ROOT, "data"), { recursive: true });
    writeFileSync(join(ROOT, "data/last-review.md"), body);
  }

  if (!dryRun) printReport(reports, provider.name, evidence, skipped);
}

function printReport(reports, providerName, evidence, skipped = []) {
  console.log("");
  console.log(`${C.bold}${C.cyan}  The agent${C.reset}  ${C.grey}(judge: ${providerName})${C.reset}`);
  console.log("");

  if (!reports.length) {
    if (skipped.length) {
      console.log(
        `  ${C.grey}${skipped.join(", ")}: already reviewed and unchanged — nothing to do.${C.reset}`,
      );
    } else {
      console.log(
        `  ${C.grey}Nothing submitted yet. Push a solution to learn/<topic>/solutions/ or open an issue.${C.reset}`,
      );
    }
    console.log("");
    return;
  }

  for (const report of reports) {
    const tone =
      report.verdict.verdict === "correct"
        ? C.green
        : report.verdict.verdict === "mostly-correct"
          ? C.cyan
          : report.verdict.verdict === "incomplete"
            ? C.yellow
            : C.red;

    console.log(`  ${C.bold}${report.id}${C.reset}  ${tone}${report.verdict.verdict}${C.reset} ${C.bold}${report.verdict.score}%${C.reset}`);
    console.log(`  ${C.grey}${report.notes.whatILearned}${C.reset}`);
    if (report.notes.challenges) console.log(`  ${C.grey}${report.notes.challenges}${C.reset}`);
    if (report.notes.nextSteps) console.log(`  ${C.grey}${report.notes.nextSteps}${C.reset}`);
    console.log("");
  }

  console.log(`  ${C.grey}notes written to learn/<topic>/notes.json · review in learn/<topic>/review.md${C.reset}`);
  console.log(`  ${C.grey}history in learn/<topic>/history.md · progress in data/progress.json${C.reset}`);
  console.log("");
  void evidence;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
