#!/usr/bin/env node
/**
 * export-to-portfolio.mjs — publish graded work into the Learning Archive.
 *
 *   node scripts/export-to-portfolio.mjs [path-to-portfolio-clone]
 *
 * The archive (pabitra27706-oss/portfolio) is where the code lives and where
 * people can read it, download it and zip it. This script takes what you
 * solved here and writes it into the archive's own data format, so the topic
 * pages, the code preview, the search and the ZIP download all just work.
 *
 * It writes, and never pushes. Review the diff, then commit yourself.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const target = resolve(
  ROOT,
  process.argv[2] ?? process.env.PORTFOLIO_DIR ?? "../portfolio",
);

if (!existsSync(join(target, "data"))) {
  console.error(
    `No portfolio clone at ${target}\n\n` +
      `Clone it once:\n` +
      `  git clone https://github.com/pabitra27706-oss/portfolio.git ../portfolio\n\n` +
      `then re-run:\n` +
      `  node scripts/export-to-portfolio.mjs ../portfolio`,
  );
  process.exit(1);
}

const index = JSON.parse(readFileSync(join(ROOT, "curriculum/index.json"), "utf8"));
const progressPath = join(ROOT, "data/progress.json");
const progress = existsSync(progressPath)
  ? JSON.parse(readFileSync(progressPath, "utf8"))
  : { topics: {} };

let touched = 0;

for (const entry of index.topics) {
  const pack = JSON.parse(readFileSync(join(ROOT, entry.topicFile), "utf8"));
  const { topic, curriculum } = pack;

  const langDir = topic.language.toLowerCase();
  const id = topic.id.startsWith(`${langDir}-`) ? topic.id : `${langDir}-${topic.id}`;

  // --- collect the learner's own solutions --------------------------------
  const learnDir = join(ROOT, entry.learnDir ?? `learn/${entry.id}`);
  const solutionsDir = join(learnDir, "solutions");
  const result = progress.topics?.[topic.id];

  const files = [];
  if (existsSync(solutionsDir)) {
    for (const task of curriculum.tasks) {
      const source = join(solutionsDir, `${task.id}.c`);
      if (!existsSync(source)) continue;

      const fileName = `${id}-${task.id}.c`;
      const destination = join(target, "content", langDir, fileName);
      mkdirSync(dirname(destination), { recursive: true });
      copyFileSync(source, destination);

      const graded = result?.tasks?.[task.id];
      files.push({
        id: `file-${String(files.length + 1).padStart(3, "0")}`,
        fileName,
        filePath: `content/${langDir}/${fileName}`,
        description: task.prompt,
        dateAdded: new Date().toISOString(),
      });

      void graded;
    }
  }

  // --- the learner's three lines ------------------------------------------
  const notesPath = join(learnDir, "notes.json");
  const notes = existsSync(notesPath)
    ? JSON.parse(readFileSync(notesPath, "utf8"))
    : topic.learningNotes;

  // --- write the topic file in the archive's own schema --------------------
  const topicFile = `data/topics/${langDir}/${id}.json`;
  const topicPayload = {
    topic: {
      id,
      title: topic.title,
      language: topic.language,
      category: topic.category,
      difficulty: topic.difficulty,
      dateCreated: topic.dateCreated,
      lastUpdated: new Date().toISOString(),
      tags: topic.tags,
      description: topic.description,
      learningNotes: {
        whatILearned: notes.whatILearned ?? "",
        challenges: notes.challenges ?? "",
        nextSteps: notes.nextSteps ?? "",
      },
    },
    files,
  };

  const topicPath = join(target, topicFile);
  mkdirSync(dirname(topicPath), { recursive: true });
  writeFileSync(topicPath, `${JSON.stringify(topicPayload, null, 2)}\n`);

  // --- keep the full pack alongside it, so an agent can read the material --
  const curriculumPath = join(target, "data/curriculum", `${id}.json`);
  mkdirSync(dirname(curriculumPath), { recursive: true });
  writeFileSync(curriculumPath, `${JSON.stringify(pack, null, 2)}\n`);

  // --- update the archive index -------------------------------------------
  const archiveIndexPath = join(target, "data/index.json");
  const archiveIndex = JSON.parse(readFileSync(archiveIndexPath, "utf8"));
  const archiveEntry = {
    id,
    title: topic.title,
    language: topic.language,
    dateCreated: topic.dateCreated.slice(0, 10),
    lastUpdated: new Date().toISOString().slice(0, 10),
    fileCount: files.length,
    tags: topic.tags,
    description: topic.description,
    topicFile,
  };

  const existing = archiveIndex.topics.findIndex((item) => item.id === id);
  if (existing === -1) archiveIndex.topics.unshift(archiveEntry);
  else archiveIndex.topics[existing] = archiveEntry;

  archiveIndex.metadata.totalTopics = archiveIndex.topics.length;
  archiveIndex.metadata.totalFiles = archiveIndex.topics.reduce(
    (total, item) => total + (item.fileCount ?? 0),
    0,
  );
  archiveIndex.metadata.lastUpdated = new Date().toISOString();

  writeFileSync(archiveIndexPath, `${JSON.stringify(archiveIndex, null, 2)}\n`);

  touched += 1;
  console.log(
    `  ${id}  →  ${topicFile}  (${files.length} file${files.length === 1 ? "" : "s"})`,
  );
}

console.log(`\n  ${touched} topic(s) written to ${target}`);
console.log("  Review the diff, then:");
console.log(`    cd ${target} && git status && git diff`);
console.log("    git commit -am 'Add <topic> from the AI curriculum' && git push");
