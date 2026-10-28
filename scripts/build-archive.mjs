#!/usr/bin/env node
/**
 * build-archive.mjs — publish the learning engine into the Learning Archive.
 *
 *   node scripts/build-archive.mjs            # write the archive
 *   node scripts/build-archive.mjs --check    # fail if it is out of date
 *
 * This is the step that used to be a manual chore.
 *
 * Before: you cloned a second repository, ran the exporter, remembered which
 * folders to touch, committed, and pushed — on a phone. Then you forgot, and
 * the archive went stale while this repository kept moving.
 *
 * Now: the archive is a *view* of the engine. Every time the site is built,
 * this script regenerates the engine's topics into the archive's own schema —
 * the code you wrote, the verdict I gave, the score, the notes — and leaves the
 * hand-written archive entries alone.
 *
 * It never deletes an archive topic that the engine did not write. The old
 * catalogue is history; this only adds to it.
 *
 * Two outputs:
 *   archive/data/topics/<lang>/<name>.json   the engine's topics, in the
 *                                             archive's schema
 *   archive/data/index.json                   the merged catalogue
 *
 * Plus a mirror of the code files into public/ so the site can serve them for
 * download and for the ZIP export. That mirror is generated; it is not in git.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ARCHIVE = join(ROOT, "archive");
const CHECK_ONLY = process.argv.includes("--check");

function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`Could not parse ${path}: ${error.message}`);
  }
}

/** The archive names a language "c", "python", "javascript". */
function languageSlug(language) {
  return String(language ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "") || "misc";
}

/** Short, human sentence describing a task's file. */
function describeTask(task) {
  const firstLine = String(task.prompt ?? "")
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);
  return firstLine ? `${task.title} — ${firstLine}` : task.title;
}

const index = readJson(join(ROOT, "curriculum/index.json"));
if (!index || !Array.isArray(index.topics)) {
  console.error("  No curriculum/index.json — nothing to publish.");
  process.exit(1);
}

const progress = readJson(join(ROOT, "data/progress.json"), { topics: {} });
const evidence = readJson(join(ROOT, "data/evidence.json"), { topics: {} });

const archiveIndexPath = join(ARCHIVE, "data/index.json");
const archiveIndex = readJson(archiveIndexPath);
if (!archiveIndex || !Array.isArray(archiveIndex.topics)) {
  console.error("  No archive/data/index.json — the archive is not in this repository.");
  process.exit(1);
}

/** Hand-written entries are preserved; engine entries are replaced. */
const byId = new Map(archiveIndex.topics.map((topic) => [topic.id, topic]));
const written = [];

for (const entry of index.topics) {
  const pack = readJson(join(ROOT, entry.topicFile));
  if (!pack) continue;

  const topic = pack.topic;
  const curriculum = pack.curriculum ?? {};
  const lang = languageSlug(topic.language);
  const archiveId = topic.id.startsWith(`${lang}-`) ? topic.id : `${lang}-${topic.id}`;
  const topicFile = `data/topics/${lang}/${topic.id}.json`;

  const learnDir = join(ROOT, entry.learnDir ?? `learn/${entry.id}`);
  const solutionsDir = join(learnDir, "solutions");
  const notes = readJson(join(learnDir, "notes.json"), {});
  const verdictFile = readJson(join(learnDir, "verdict.json"), null);
  const topicProgress = progress.topics?.[topic.id] ?? null;
  const topicEvidence = evidence.topics?.[topic.id] ?? null;

  /* Timestamps come from the source data, never from "now".
     A generator that stamps the clock rewrites the archive on every run,
     which turns git into a churn machine and makes `--check` useless. These
     are the real "last changed" times: the verdict's, or the pack's. */
  const verdictAt = verdictFile?.at ?? topicProgress?.verdict?.at ?? null;
  const stamp = verdictAt ?? topic.lastUpdated ?? topic.dateCreated ?? new Date().toISOString();
  const stampDate = String(stamp).slice(0, 10);

  /* ---- the learner's own code ------------------------------------------ */
  const files = [];
  for (const task of curriculum.tasks ?? []) {
    const source = join(solutionsDir, `${task.id}.c`);
    if (!existsSync(source)) continue;

    const fileName = `${archiveId}-${task.id}.c`;
    const destination = join(ARCHIVE, "content", lang, fileName);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(source, destination);

    const graded = topicEvidence?.tasks?.[task.id];
    files.push({
      id: `file-${String(files.length + 1).padStart(3, "0")}`,
      fileName,
      filePath: `content/${lang}/${fileName}`,
      description: describeTask(task),
      dateAdded: stamp,
      taskId: task.id,
      points: task.points ?? 0,
      passed: graded ? graded.passed : 0,
      total: graded ? graded.total : 0,
      maxPoints: graded ? graded.maxPoints : task.points ?? 0,
      compileError: graded?.compileError ?? null,
    });
  }

  /* ---- the topic, in the archive's schema -------------------------------- */
  const payload = {
    topic: {
      id: archiveId,
      title: topic.title,
      language: topic.language,
      category: topic.category,
      difficulty: topic.difficulty,
      dateCreated: topic.dateCreated,
      lastUpdated: stamp,
      tags: topic.tags ?? [],
      description: topic.description,
      learningNotes: {
        whatILearned: notes.whatILearned ?? "",
        challenges: notes.challenges ?? "",
        nextSteps: notes.nextSteps ?? "",
      },
      /* Marks this entry as written by the engine, so it can be regenerated
         without ever touching a hand-written entry. */
      source: "engine",
      curriculumId: topic.id,
    },
    files,
    engine: {
      topicId: topic.id,
      minutes: entry.minutes ?? curriculum.estimatedMinutes ?? null,
      points: (curriculum.tasks ?? []).reduce((sum, task) => sum + (task.points ?? 0), 0),
      tasks: (curriculum.tasks ?? []).length,
      verdict: verdictFile
        ? {
            status: verdictFile.verdict,
            score: verdictFile.score,
            by: verdictFile.by,
            at: verdictFile.at ?? topicProgress?.verdict?.at ?? stamp,
          }
        : topicProgress
          ? {
              status: topicProgress.verdict?.status,
              score: topicProgress.verdict?.score,
              by: topicProgress.verdict?.by,
              at: topicProgress.verdict?.at,
            }
          : null,
      machine: topicProgress?.machine ?? null,
      misconceptions: topicProgress?.verdict?.misconceptions ?? verdictFile?.misconceptions ?? [],
      review: topicProgress?.verdict?.review ?? verdictFile?.review ?? "",
    },
  };

  const topicPath = join(ARCHIVE, topicFile);
  const previous = existsSync(topicPath) ? readJson(topicPath) : null;
  const serialised = `${JSON.stringify(payload, null, 2)}\n`;
  if (!previous || readFileSync(topicPath, "utf8") !== serialised) {
    if (!CHECK_ONLY) writeFileSync(topicPath, serialised);
    written.push(topicFile);
  }

  /* ---- the catalogue ----------------------------------------------------- */
  const archiveEntry = {
    id: archiveId,
    title: topic.title,
    language: topic.language,
    dateCreated: String(topic.dateCreated ?? stampDate).slice(0, 10),
    lastUpdated: stampDate,
    fileCount: files.length,
    tags: topic.tags ?? [],
    description: topic.description,
    topicFile,
    source: "engine",
    verdict: payload.engine.verdict?.status ?? null,
    score: payload.engine.verdict?.score ?? null,
  };

  const existing = byId.get(archiveId);
  if (existing) {
    Object.assign(existing, archiveEntry);
  } else {
    archiveIndex.topics.unshift(archiveEntry);
    byId.set(archiveId, archiveEntry);
  }
}

/* ---- metadata ------------------------------------------------------------ */
const languages = new Set(
  (archiveIndex.metadata?.languages ?? []).concat(
    archiveIndex.topics.map((topic) => topic.language).filter(Boolean),
  ),
);
archiveIndex.metadata = {
  ...archiveIndex.metadata,
  siteName: archiveIndex.metadata?.siteName ?? "Learning Archive",
  /* The newest entry in the catalogue, not the clock. */
  lastUpdated: archiveIndex.topics
    .map((topic) => String(topic.lastUpdated ?? ""))
    .sort()
    .pop() ?? archiveIndex.metadata?.lastUpdated ?? "",
  totalTopics: archiveIndex.topics.length,
  totalFiles: archiveIndex.topics.reduce((sum, topic) => sum + (topic.fileCount ?? 0), 0),
  languages: [...languages].sort(),
};

const serialisedIndex = `${JSON.stringify(archiveIndex, null, 2)}\n`;
const indexChanged =
  !existsSync(archiveIndexPath) || readFileSync(archiveIndexPath, "utf8") !== serialisedIndex;

if (CHECK_ONLY) {
  if (written.length || indexChanged) {
    console.error(
      `  The archive is out of date: ${written.length} topic file(s) and the index need regenerating.`,
    );
    process.exit(1);
  }
  console.log("  The archive is in step with the engine.");
  process.exit(0);
}

if (indexChanged) writeFileSync(archiveIndexPath, serialisedIndex);

/* ---- mirror into public/ so the site can serve them ------------------------
   The archive pages read the catalogue at build time, but the browser needs
   the raw files for the code preview and the ZIP export. public/ is copied
   into the static export, so a mirror here is what makes the download work.
   The mirror is generated; it is not in git. */
const mirror = join(ROOT, "public", "archive-content");
const dataMirror = join(ROOT, "public", "archive-data");
rmSync(mirror, { recursive: true, force: true });
rmSync(dataMirror, { recursive: true, force: true });
mkdirSync(dataMirror, { recursive: true });
copyFileSync(archiveIndexPath, join(dataMirror, "index.json"));

let mirrored = 0;
for (const topic of archiveIndex.topics) {
  const topicPayload = readJson(join(ARCHIVE, topic.topicFile));
  if (!topicPayload) continue;

  // Strip the leading "data/" so the mirror is /archive-data/topics/<lang>/<id>.json
  const relative = topic.topicFile.replace(/^data\//, "");
  const topicMirror = join(dataMirror, dirname(relative));
  mkdirSync(topicMirror, { recursive: true });
  writeFileSync(
    join(topicMirror, `${topic.id}.json`),
    `${JSON.stringify(topicPayload, null, 2)}\n`,
  );

  for (const file of topicPayload.files ?? []) {
    const from = join(ARCHIVE, file.filePath);
    if (!existsSync(from)) continue;
    // The file path is "content/c/foo.c" inside the archive; the mirror drops
    // the leading "content/" so the public URL is /archive-content/c/foo.c.
    const to = join(mirror, file.filePath.replace(/^content\//, ""));
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    mirrored += 1;
  }
}

console.log(
  `  archive: ${archiveIndex.topics.length} topics · ${archiveIndex.metadata.totalFiles} files · ${written.length} topic file(s) rewritten`,
);
console.log(`  public mirror: ${mirrored} file(s) ready for download`);
