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

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname, extname, basename } from "node:path";
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
  /* Never the clock. A generator that stamps "now" rewrites the archive on
     every single run, which turns git into a churn machine and makes
     `--check` useless. Every date here comes from a file in the repository. */
  const stamp = verdictAt || topic.lastUpdated || topic.dateCreated || "";
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
    curriculumId: topic.id,
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

/* ---- repair a file that two topics both claim -----------------------------
   In the imported archive, one C file was listed under two topics at once.
   The catalogue therefore showed the same code twice, and one topic showed
   code that was not its own. A file goes to the topic whose name matches
   it; the other topic is left empty rather than given the wrong code.

   Only an actual double claim is repaired. A file with an unusual name is
   left exactly where it is — "Day7 practice" belongs to "Hangman Step 1",
   and "factorial-calculator.c" is the for-loop program the "For Loop in C"
   topic is about. */
{
  const owners = new Map();
  const payloads = new Map();

  for (const topic of archiveIndex.topics) {
    const payload = readJson(join(ARCHIVE, topic.topicFile));
    if (!payload) continue;
    payloads.set(topic.id, payload);
    for (const file of payload.files ?? []) {
      if (!owners.has(file.filePath)) owners.set(file.filePath, []);
      owners.get(file.filePath).push(topic.id);
    }
  }

  for (const [filePath, ids] of owners) {
    if (ids.length < 2) continue;

    const stem = basename(filePath).replace(/\.[^.]+$/, "").toLowerCase();
    let keeper = ids[0];
    for (const id of ids) {
      const topic = byId.get(id);
      if (!topic) continue;
      if (basename(topic.topicFile, ".json").toLowerCase() === stem) {
        keeper = id;
        break;
      }
    }

    for (const id of ids) {
      if (id === keeper) continue;
      const payload = payloads.get(id);
      const topic = byId.get(id);
      if (!payload || !topic) continue;

      const before = payload.files.length;
      payload.files = payload.files.filter((file) => file.filePath !== filePath);
      if (payload.files.length === before) continue;

      const topicPath = join(ARCHIVE, topic.topicFile);
      if (!CHECK_ONLY) writeFileSync(topicPath, `${JSON.stringify(payload, null, 2)}\n`);
      written.push(topic.topicFile);
      console.log(
        `  ${filePath} was claimed by ${ids.length} topics — kept it under ${keeper}, and ${id} is now empty.`,
      );
    }
  }
}

/* ---- adopt files written straight into the archive ------------------------
   The archive is not only an output. It is also an input.

   A file dropped into archive/content/<lang>/ is work, and work must never
   be invisible. This section finds every code file on disk that the
   catalogue does not mention, works out which topic it belongs to from the
   header the file itself carries, and adds it — creating the topic when the
   file is the first of its kind.

   It never overwrites a hand-written entry. An adopted topic is written once
   and then it is a hand-written entry like any other, so the notes, the
   verdict and the score written into it afterwards survive every build. */
const CODE_EXTENSIONS = new Set([
  ".c", ".h", ".cpp", ".cc", ".hpp", ".cs", ".java", ".js", ".jsx", ".ts", ".tsx",
  ".kt", ".kts", ".py", ".go", ".rs", ".rb", ".php", ".swift", ".sql", ".sh",
  ".html", ".css", ".scss", ".json",
]);

/** The display name for an archive language directory. */
function languageDisplayName(slug) {
  switch (slug) {
    case "c": return "C";
    case "python": return "Python";
    case "javascript": return "JavaScript";
    case "java": return "Java";
    case "html": return "HTML";
    case "css": return "CSS";
    case "html-css": return "HTML/CSS";
    case "sql": return "SQL";
    default:
      return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

/**
 * Read the header a code file carries about itself.
 *
 * The files in this archive open with a block like:
 *
 *     File    : functions.py
 *     Topic   : Functions in Python
 *     Created : 2026-03-05
 *     Purpose : Definitions, defaults, multiple returns ...
 *
 * in either a docstring or a block comment. That header is the only place
 * the topic of an unlisted file is written down, so this reads it.
 */
function parseFileHeader(text) {
  const fields = {};
  let current = null;
  for (const raw of text.split("\n").slice(0, 40)) {
    const stripped = raw.replace(/^\s*(?:[-*#]{1,2}\s?)?/, "");
    const key = stripped.match(/^([A-Za-z][A-Za-z ]{0,18}?)\s*:\s*(.*)$/);
    const indented = /^\s{2,}\S/.test(raw) || /^\s*[*#]\s+\S/.test(raw);

    if (key) {
      current = key[1].trim().toLowerCase();
      fields[current] = key[2].trim();
      continue;
    }
    if (current && indented && stripped.trim()) {
      fields[current] = `${fields[current]} ${stripped.trim()}`.trim();
      continue;
    }
    /* The end of the header block: a blank line, or the closing marker. */
    if (current && (!stripped.trim() || /"""|\*\//.test(raw))) break;
  }
  return fields;
}

/** "Functions in Python" -> "functions in python" */
const normaliseTitle = (value) =>
  String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** A slug for a topic id, from a file name. */
const slugFromFileName = (name) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** "Python Lists - deep dive" -> ["lists", "python"] */
function tagsFromTitle(title) {
  const stop = new Set(["and", "the", "for", "with", "from", "into", "your", "are", "how"]);
  const words = normaliseTitle(title)
    .split(" ")
    .filter((word) => word.length > 2 && !stop.has(word));
  return [...new Set(words)].slice(0, 6);
}

/* Dates for files that a topic file already knows about.
   Some topic files were never in the catalogue — the file was written and
   the entry was never made. When one of those holds a file, its date is
   still the best answer for when that file was written, so it is used
   instead of inventing one. */
const cataloguedFiles = new Set(archiveIndex.topics.map((topic) => topic.topicFile));
const knownDates = new Map();
const topicsRoot = join(ARCHIVE, "data", "topics");
if (existsSync(topicsRoot)) {
  for (const langDir of readdirSync(topicsRoot, { withFileTypes: true })) {
    if (!langDir.isDirectory()) continue;
    const dir = join(topicsRoot, langDir.name);
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".json")) continue;
      if (cataloguedFiles.has(`data/topics/${langDir.name}/${name}`)) continue;
      const payload = readJson(join(dir, name));
      if (!payload) continue;
      for (const file of payload.files ?? []) {
        if (knownDates.has(file.filePath)) continue;
        knownDates.set(file.filePath, {
          dateCreated: payload.topic?.dateCreated ?? "",
          lastUpdated: payload.topic?.lastUpdated ?? "",
        });
      }
    }
  }
}

/* Every file the catalogue already mentions. */
const referenced = new Set();
for (const topic of archiveIndex.topics) {
  const payload = readJson(join(ARCHIVE, topic.topicFile));
  for (const file of payload?.files ?? []) referenced.add(file.filePath);
}

/* Find the catalogue topic whose title matches, if there is one. */
const byTitle = new Map();
for (const topic of archiveIndex.topics) {
  const key = normaliseTitle(topic.title);
  if (key && !byTitle.has(key)) byTitle.set(key, topic);
}

const contentRoot = join(ARCHIVE, "content");
const adoptedFiles = [];
const notCode = [];

if (existsSync(contentRoot)) {
  for (const langDir of readdirSync(contentRoot, { withFileTypes: true })) {
    if (!langDir.isDirectory()) continue;
    const lang = langDir.name;
    const dir = join(contentRoot, lang);

    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (!statSync(full).isFile()) continue;

      const rel = `content/${lang}/${name}`;
      if (referenced.has(rel)) continue;

      const extension = extname(name).toLowerCase();
      if (!CODE_EXTENSIONS.has(extension)) {
        if (!name.startsWith(".")) notCode.push(rel);
        continue;
      }

      const text = readFileSync(full, "utf8");
      if (!text.trim()) {
        notCode.push(rel);
        continue;
      }

      const header = parseFileHeader(text);
      const displayTitle = header.topic
        ? header.topic
        : slugFromFileName(name).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      const created = /^\d{4}-\d{2}-\d{2}/.test(header.created ?? "")
        ? header.created.slice(0, 10)
        : String(knownDates.get(rel)?.dateCreated ?? "").slice(0, 10) || "";

      let id = `${lang}-${slugFromFileName(name)}`;
      let suffix = 2;
      while (byId.has(id) && normaliseTitle(byId.get(id).title) !== normaliseTitle(displayTitle)) {
        id = `${lang}-${slugFromFileName(name)}-${suffix}`;
        suffix += 1;
      }

      const fileEntry = {
        fileName: name,
        filePath: rel,
        description: header.purpose ?? "",
        dateAdded: created,
      };

      const existingTopic = byTitle.get(normaliseTitle(displayTitle)) ?? (byId.has(id) ? byId.get(id) : null);

      if (existingTopic) {
        /* It belongs to a topic that already exists — attach it there. */
        const topicPath = join(ARCHIVE, existingTopic.topicFile);
        const payload = readJson(topicPath);
        if (!payload) continue;

        let changed = false;
        const have = new Set((payload.files ?? []).map((f) => f.filePath));
        if (!have.has(rel)) {
          payload.files.push({
            id: `file-${String(payload.files.length + 1).padStart(3, "0")}`,
            ...fileEntry,
          });
          changed = true;
        }

        /* A topic with no date is a topic nobody could date. If the file
           knows when it was written, that date belongs here. */
        if (!existingTopic.dateCreated && created) {
          existingTopic.dateCreated = created;
          existingTopic.lastUpdated = created;
          payload.topic.dateCreated = payload.topic.dateCreated || created;
          payload.topic.lastUpdated = payload.topic.lastUpdated || created;
          changed = true;
        }

        if (changed) {
          if (!CHECK_ONLY) writeFileSync(topicPath, `${JSON.stringify(payload, null, 2)}\n`);
          written.push(existingTopic.topicFile);
        }
        referenced.add(rel);
        adoptedFiles.push({ rel, topic: existingTopic.id });
        continue;
      }

      /* A topic of its own. Write it once; after that it is hand-written. */
      const topicFile = `data/topics/${lang}/${id}.json`;
      const topicPath = join(ARCHIVE, topicFile);
      const fresh = {
        topic: {
          id,
          title: displayTitle,
          language: languageDisplayName(lang),
          dateCreated: created,
          lastUpdated: created,
          tags: tagsFromTitle(displayTitle),
          description: header.purpose ?? "",
          learningNotes: { whatILearned: "", challenges: "", nextSteps: "" },
          source: "adopted",
        },
        files: [
          {
            id: "file-001",
            ...fileEntry,
          },
        ],
      };

      const onDisk = readJson(topicPath);
      if (!onDisk) {
        if (!CHECK_ONLY) {
          mkdirSync(dirname(topicPath), { recursive: true });
          writeFileSync(topicPath, `${JSON.stringify(fresh, null, 2)}\n`);
        }
        written.push(topicFile);
      }

      /* Whatever is in the file is the truth — not what this script would
         write today. A description you rewrote by hand, notes you added
         after it was judged, a verdict you gave it: all of those live in
         that file, and the catalogue has to show them. Rebuilding the
         catalogue entry from a fresh guess silently undid every one of
         those edits on the next build. */
      const truth = onDisk ?? fresh;

      const entry = {
        id,
        title: truth.topic?.title || displayTitle,
        language: truth.topic?.language || languageDisplayName(lang),
        dateCreated: String(truth.topic?.dateCreated || created).slice(0, 10),
        lastUpdated: String(truth.topic?.lastUpdated || created).slice(0, 10),
        fileCount: (truth.files ?? []).length,
        tags: truth.topic?.tags ?? [],
        description: truth.topic?.description ?? "",
        topicFile,
        source: "adopted",
        verdict: truth.engine?.verdict?.status ?? null,
        score: truth.engine?.verdict?.score ?? null,
      };

      if (byId.has(id)) {
        Object.assign(byId.get(id), entry);
      } else {
        archiveIndex.topics.unshift(entry);
        byId.set(id, entry);
        byTitle.set(normaliseTitle(displayTitle), entry);
      }

      referenced.add(rel);
      adoptedFiles.push({ rel, topic: id });
    }
  }
}

if (adoptedFiles.length) {
  console.log(
    `  adopted ${adoptedFiles.length} file(s) written straight into the archive: ` +
      adoptedFiles.map((f) => `${f.rel} -> ${f.topic}`).join(", "),
  );
}
if (notCode.length) {
  console.log(
    `  left alone (not code): ${notCode.map((f) => f.replace(/^content\//, "")).join(", ")}`,
  );
}

/* ---- keep the catalogue's file counts honest ------------------------------
   A topic's file count comes from the topic file itself, never from a
   remembered number. Add a file to a topic and the count follows. */
for (const topic of archiveIndex.topics) {
  const payload = readJson(join(ARCHIVE, topic.topicFile));
  if (!payload) continue;

  /* A file that is listed but no longer on disk is a ghost: the card opens
     to an empty box, and the download link 404s. Delete the file from the
     archive and the topic still claimed it, because nothing ever checked.
     The list is now read from the disk, so a deleted file leaves the
     catalogue too. */
  const before = (payload.files ?? []).length;
  const present = (payload.files ?? []).filter(
    (file) => existsSync(join(ARCHIVE, file.filePath)),
  );
  if (present.length !== before) {
    const dropped = (payload.files ?? [])
      .filter((file) => !existsSync(join(ARCHIVE, file.filePath)))
      .map((file) => file.filePath);
    payload.files = present;
    const topicPath = join(ARCHIVE, topic.topicFile);
    if (!CHECK_ONLY) writeFileSync(topicPath, `${JSON.stringify(payload, null, 2)}\n`);
    written.push(topic.topicFile);
    console.log(`  ${topic.id}: ${dropped.join(", ")} is gone — dropped from the topic.`);
  }

  topic.fileCount = (payload.files ?? []).length;

  /* The directory a topic lives in. The browser needs it to fetch the
     topic's own JSON, and the directory name is not always the same as
     the language spelled out — "html-css" is the directory, "HTML/CSS" is
     the language. Guessing one from the other broke every card in a
     language whose name is not a plain word. */
  topic.langSlug = topic.topicFile.split("/").slice(-2, -1)[0] ?? "";

  /* A topic with no date is a topic nobody could date. The file it holds
     may know when it was written — an entry that was written and never
     added to the catalogue still carries that date. */
  if (!topic.dateCreated) {
    const first = (payload.files ?? [])[0];
    const known = first ? knownDates.get(first.filePath) : null;
    const stamp = String(known?.dateCreated ?? "").slice(0, 10);
    if (stamp) {
      topic.dateCreated = stamp;
      topic.lastUpdated = topic.lastUpdated || stamp;
      payload.topic.dateCreated = payload.topic.dateCreated || stamp;
      payload.topic.lastUpdated = payload.topic.lastUpdated || stamp;
      const topicPath = join(ARCHIVE, topic.topicFile);
      if (!CHECK_ONLY) writeFileSync(topicPath, `${JSON.stringify(payload, null, 2)}\n`);
      written.push(topic.topicFile);
    }
  }

  if (payload.engine?.verdict) {
    topic.verdict = payload.engine.verdict.status ?? null;
    topic.score = payload.engine.verdict.score ?? null;
  }
}

/* ---- the pending list ----------------------------------------------------
   Work that exists but has no verdict yet.

   A file written straight into the archive is adopted on the next build,
   and from that moment it is on the site with nothing but the code — no
   verdict, no notes, no review. That is a file nobody looks at again, and
   nothing anywhere says it is waiting.

   So the generator writes the list of everything waiting. `scripts/check.sh`
   prints it, `runbook/START-HERE.md` tells me to read it first, and the
   archive's own pages say "waiting to be judged" instead of showing
   nothing. The archive is an input; this is the queue for it. */
const pending = [];
for (const topic of archiveIndex.topics) {
  const payload = readJson(join(ARCHIVE, topic.topicFile));
  if (!payload) continue;
  const files = payload.files ?? [];
  if (!files.length) continue;
  if (payload.engine?.verdict?.status) continue;

  pending.push({
    id: topic.id,
    title: payload.topic?.title || topic.title,
    language: topic.language,
    topicFile: topic.topicFile,
    reason:
      topic.source === "adopted"
        ? "written straight into the archive"
        : topic.source === "engine"
          ? "submitted to the engine, not judged yet"
          : "older work, never judged",
    dateCreated: topic.dateCreated,
    files: files.map((file) => file.filePath),
  });
}
/* Newest first, so the work that arrived last is the first thing you see.
   The older backlog is still listed — it is still unjudged — but it never
   hides the file that landed five minutes ago. */
pending.sort(
  (a, b) =>
    String(b.dateCreated ?? "").localeCompare(String(a.dateCreated ?? "")) ||
    String(a.id).localeCompare(String(b.id)),
);

const pendingPayload = {
  note: "Work in the archive with no verdict yet. Judge these before anything else.",
  count: pending.length,
  topics: pending,
};
const pendingSerialised = `${JSON.stringify(pendingPayload, null, 2)}\n`;
const pendingPath = join(ARCHIVE, "data", "archive-pending.json");
const pendingChanged =
  !existsSync(pendingPath) || readFileSync(pendingPath, "utf8") !== pendingSerialised;

/* ---- the code index -------------------------------------------------------
   The archive searches titles, descriptions and tags. That cannot answer the
   question a code archive exists to answer: "where did I use recursion?".

   So the generator reads the code and writes an index of the words in it —
   one list per topic. It is not the code: it is the vocabulary of the code,
   which is a fraction of the size and is enough to answer "which topics
   mention this". The browser fetches it only when you actually search, and
   the Pages CDN serves it compressed. */
const CODE_INDEX_STOP = new Set([
  "the", "and", "for", "not", "you", "this", "that", "with", "from", "have",
  "has", "are", "was", "were", "but", "all", "can", "will", "your", "our",
  "its", "it's", "they", "them", "then", "than", "there", "here", "what",
  "which", "when", "where", "how", "why", "who", "does", "did", "been",
  "being", "would", "could", "should", "about", "into", "out", "get", "got",
]);

function codeIndexWords(text) {
  const words = new Set();
  for (const word of String(text).match(/[A-Za-z_][A-Za-z0-9_]{2,}/g) ?? []) {
    const lower = word.toLowerCase();
    if (CODE_INDEX_STOP.has(lower)) continue;
    words.add(lower);
  }
  return words;
}

const codeIndex = {};
for (const topic of archiveIndex.topics) {
  const payload = readJson(join(ARCHIVE, topic.topicFile));
  if (!payload) continue;
  const words = new Set();
  for (const file of payload.files ?? []) {
    const path = join(ARCHIVE, file.filePath);
    if (!existsSync(path)) continue;
    try {
      for (const word of codeIndexWords(readFileSync(path, "utf8"))) words.add(word);
    } catch {
      /* A file that cannot be read simply contributes nothing. */
    }
  }
  if (words.size) codeIndex[topic.id] = [...words].sort();
}

const codeIndexPayload = {
  note: "The words that appear in each topic's code. Built by scripts/build-archive.mjs.",
  topics: codeIndex,
};
const codeIndexSerialised = `${JSON.stringify(codeIndexPayload, null, 0)}\n`;
const codeIndexPath = join(ARCHIVE, "data", "code-index.json");
const codeIndexChanged =
  !existsSync(codeIndexPath) || readFileSync(codeIndexPath, "utf8") !== codeIndexSerialised;

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
  if (written.length || indexChanged || pendingChanged || codeIndexChanged) {
    console.error(
      `  The archive is out of date: ${written.length} topic file(s), the index, the pending list and the code index need regenerating.`,
    );
    process.exit(1);
  }
  console.log("  The archive is in step with the engine.");
  process.exit(0);
}

if (indexChanged) writeFileSync(archiveIndexPath, serialisedIndex);
if (pendingChanged) writeFileSync(pendingPath, pendingSerialised);
if (codeIndexChanged) writeFileSync(codeIndexPath, codeIndexSerialised);

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
copyFileSync(pendingPath, join(dataMirror, "archive-pending.json"));
copyFileSync(codeIndexPath, join(dataMirror, "code-index.json"));

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
console.log(
  pending.length
    ? `  waiting to be judged: ${pending.length} topic(s) — see data/archive-pending.json`
    : "  waiting to be judged: nothing",
);
console.log(`  code index: ${Object.keys(codeIndex).length} topic(s), ${Object.values(codeIndex).reduce((sum, words) => sum + words.length, 0)} word(s)`);
console.log(`  public mirror: ${mirrored} file(s) ready for download`);
