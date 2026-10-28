#!/usr/bin/env node
/**
 * Repo stats — a quick console summary of the journey.
 *
 *   node scripts/stats.mjs
 *
 * Reads the same content files the website renders from, so the numbers here
 * and the numbers on the site can never drift apart.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function readContent(file) {
  const raw = readFileSync(join(root, "content", file), "utf8");
  // Strip the TS wrapper: we only need the literal arrays.
  return raw;
}

function skillStats() {
  const src = readContent("skills.ts");
  const entries = src.split(/\n  \{\n/).slice(1);
  const statusCounts = { planned: 0, learning: 0, building: 0, shipped: 0 };
  let progressSum = 0;
  let proofs = 0;

  for (const entry of entries) {
    const status = entry.match(/status:\s*"([a-z-]+)"/)?.[1];
    const progress = Number(entry.match(/progress:\s*(\d+)/)?.[1] ?? 0);
    if (status && status in statusCounts) statusCounts[status] += 1;
    progressSum += progress;
    if (/proof:\s*"https?:/.test(entry)) proofs += 1;
  }

  const total = entries.length;
  return {
    total,
    ...statusCounts,
    proofs,
    average: total ? Math.round(progressSum / total) : 0,
  };
}

function projectStats() {
  const src = readContent("projects.ts");
  const entries = src.split(/\n  \{\n/).slice(1);
  const shipped = entries.filter((e) => /status:\s*"shipped"/.test(e)).length;
  const live = entries.filter((e) => /live:\s*"https?:/.test(e)).length;
  return { total: entries.length, shipped, live };
}

function journalStats() {
  const dir = join(root, "journal");
  if (!existsSync(dir)) return { total: 0, newest: null };
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const sorted = [...files].sort();
  return { total: files.length, newest: sorted.at(-1) ?? null };
}

function gitStats() {
  const safe = (cmd) => {
    try {
      return execSync(cmd, { cwd: root, encoding: "utf8" }).trim();
    } catch {
      return null;
    }
  };
  const commits = safe("git rev-list --count HEAD");
  const first = safe("git log --reverse --pretty=%ad --date=short | head -1");
  const last = safe("git log -1 --pretty=%ad --date=short");
  const streak = safe(
    "git log --pretty=%ad --date=short | sort -u | wc -l",
  );
  return { commits, first, last, activeDays: streak };
}

const skills = skillStats();
const projects = projectStats();
const journal = journalStats();
const git = gitStats();

const pad = (s, n) => String(s).padEnd(n);
const rule = "─".repeat(58);

console.log(`\n${rule}`);
console.log("  study-with-ai — repository status");
console.log(rule);
console.log(`  ${pad("Commits", 16)}${git.commits ?? "?"}`);
console.log(`  ${pad("First commit", 16)}${git.first ?? "?"}`);
console.log(`  ${pad("Last commit", 16)}${git.last ?? "?"}`);
console.log(`  ${pad("Active days", 16)}${git.activeDays ?? "?"}`);
console.log("");
console.log(`  ${pad("Skills", 16)}${skills.total}  (avg ${skills.average}%)`);
console.log(`  ${pad("  shipped", 16)}${skills.shipped}`);
console.log(`  ${pad("  building", 16)}${skills.building}`);
console.log(`  ${pad("  learning", 16)}${skills.learning}`);
console.log(`  ${pad("  planned", 16)}${skills.planned}`);
console.log(`  ${pad("  with proof", 16)}${skills.proofs}`);
console.log("");
console.log(`  ${pad("Projects", 16)}${projects.total}  (${projects.shipped} shipped, ${projects.live} live)`);
console.log(`  ${pad("Journal entries", 16)}${journal.total}${journal.newest ? `  (latest: ${journal.newest})` : ""}`);
console.log(`${rule}\n`);
