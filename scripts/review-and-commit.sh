#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# review-and-commit.sh — the whole learning loop in one command, from a phone.
#
#   bash scripts/review-and-commit.sh [topic-id]
#
# The agent senses (compiles your C, runs the hidden test cases, checks your
# comments), judges (the AI reads the topic, your code and the evidence and
# decides what it means), notes (it writes the three notes lines in your
# voice), keeps (the notes, the review and a dated history line go back into
# the repository), commits, and pushes.
#
# Needs: Node (pkg install nodejs) and a C compiler (pkg install clang).
# Optional: GEMINI_API_KEY for a written AI review. Without it the agent still
# runs and falls back to the machine-only evaluation, and says so.
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

echo "==> the agent is reviewing (${TOPIC})"
if [ "${TOPIC}" = "all" ]; then
  node runner/agent.mjs
else
  node runner/agent.mjs "${TOPIC}"
fi

SUMMARY=$(node -e '
  const fs = require("fs");
  const progress = JSON.parse(fs.readFileSync("data/progress.json", "utf8"));
  const entries = Object.values(progress.topics ?? {});
  if (!entries.length) { console.log("no submissions yet"); process.exit(0); }
  console.log(entries.map((t) => `${t.id} ${t.score}% (${t.status})`).join(", "));
')

echo "==> committing"
git add learn data curriculum/topics

if git diff --cached --quiet; then
  echo "nothing new to commit — write your solution first:"
  echo "  mkdir -p learn/c-loops/solutions"
  echo "  nano learn/c-loops/solutions/t1.c"
  echo "  ...or open an issue and paste the code there"
  exit 0
fi

git commit -m "review: ${SUMMARY}"
git push

echo
echo "==> done: ${SUMMARY}"
echo "    watch the rebuild:  gh run watch"
echo "    see the review:    https://pabitrahews06-oss.github.io/Study-with-ai/learn/c-loops"
