#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# grade-and-commit.sh — the whole learning loop in one command, from a phone.
#
#   bash scripts/grade-and-commit.sh [topic-id]
#
# It compiles your C, runs the hidden test cases, checks that your comments
# explain why, scores your written answers, writes data/progress.json,
# commits, and pushes. Pages then rebuilds and your scoreboard updates.
#
# Needs: Node (pkg install nodejs) and a C compiler (pkg install clang).
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

TOPIC="${1:-all}"

if ! command -v node >/dev/null 2>&1; then
  echo "Node is missing. In Termux: pkg install nodejs" >&2
  exit 1
fi

if ! command -v gcc >/dev/null 2>&1 && ! command -v clang >/dev/null 2>&1; then
  echo "No C compiler found. In Termux: pkg install clang" >&2
  exit 1
fi

echo "==> grading (${TOPIC})"
if [ "${TOPIC}" = "all" ]; then
  node runner/grade.mjs
else
  node runner/grade.mjs "${TOPIC}"
fi

SCORE=$(node -e '
  const fs = require("fs");
  const progress = JSON.parse(fs.readFileSync("data/progress.json", "utf8"));
  const entries = Object.values(progress.topics ?? {});
  const done = entries.filter((t) => t.status !== "not-started");
  if (!done.length) { console.log("no submissions yet"); process.exit(0); }
  console.log(done.map((t) => `${t.id} ${t.score}% (${t.status})`).join(", "));
')

echo "==> committing"
git add learn data/progress.json

if git diff --cached --quiet; then
  echo "nothing new to commit — write your solution first:"
  echo "  mkdir -p learn/c-loops/solutions"
  echo "  nano learn/c-loops/solutions/t1.c"
  exit 0
fi

git commit -m "progress: ${SCORE}"
git push

echo
echo "==> done: ${SCORE}"
echo "    watch the rebuild:  gh run watch"
echo "    see the score:     https://pabitrahews06-oss.github.io/Study-with-ai/learn"
