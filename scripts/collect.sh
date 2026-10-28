#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# collect.sh — the CodeC bridge.
#
#   bash scripts/collect.sh <topic> <task> [source-file]
#
# You wrote the code in CodeC. This moves it into the repository, checks it,
# commits it and pushes it — so I can evaluate it.
#
# With no source-file, it looks for the newest matching file in the places
# CodeC and Android usually write to:
#
#   ~/codec-out/          (a folder you can point CodeC at)
#   ~/storage/downloads/  (Termux shared storage)
#   $EXTERNAL_STORAGE/Download/
#   /sdcard/Download/
#
# Example:
#   bash scripts/collect.sh c-loops t1
#   bash scripts/collect.sh c-loops t1 ~/storage/downloads/t1.c
#
# Then say "check c-loops" and I read the brief, judge it, and write the
# verdict back into the repository.
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

TOPIC="${1:-}"
TASK="${2:-}"
SOURCE="${3:-}"

if [ -z "$TOPIC" ] || [ -z "$TASK" ]; then
  echo "usage: bash scripts/collect.sh <topic> <task> [source-file]" >&2
  echo "  e.g. bash scripts/collect.sh c-loops t1" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node is missing. In Termux: pkg install nodejs" >&2
  exit 1
fi

TARGET="learn/${TOPIC}/solutions/${TASK}.c"
mkdir -p "$(dirname "$TARGET")"

# --- find the file -------------------------------------------------------
if [ -z "$SOURCE" ]; then
  SEARCH_DIRS=(
    "$HOME/codec-out"
    "$HOME/storage/downloads"
    "/sdcard/Download"
  )
  [ -n "${EXTERNAL_STORAGE:-}" ] && SEARCH_DIRS+=("$EXTERNAL_STORAGE/Download")
  FOUND=""
  for dir in "${SEARCH_DIRS[@]}"; do
    [ -d "$dir" ] || continue
    # newest match for the task id, then any .c file
    CANDIDATE=$(ls -1t "$dir" 2>/dev/null | grep -iE "^${TASK}\.(c|txt|cc)$" | head -1 || true)
    [ -z "$CANDIDATE" ] && CANDIDATE=$(ls -1t "$dir" 2>/dev/null | grep -iE "\.c$" | head -1 || true)
    if [ -n "$CANDIDATE" ]; then
      FOUND="$dir/$CANDIDATE"
      break
    fi
  done
  SOURCE="$FOUND"
fi

if [ -z "$SOURCE" ] || [ ! -f "$SOURCE" ]; then
  echo "Could not find a file for ${TASK}." >&2
  echo "Looked in: ${SEARCH_DIRS[*]:-the usual places}" >&2
  echo "Pass the path explicitly:" >&2
  echo "  bash scripts/collect.sh ${TOPIC} ${TASK} /full/path/to/file.c" >&2
  exit 1
fi

cp "$SOURCE" "$TARGET"
echo "==> copied $SOURCE -> $TARGET"

# --- check it -------------------------------------------------------------
echo "==> checking"
node runner/brief.mjs "$TOPIC" --task "$TASK" --write >/dev/null

node -e "
  const fs = require('fs');
  const evidence = JSON.parse(fs.readFileSync('data/evidence.json', 'utf8'));
  const topic = evidence.topics['${TOPIC}'];
  if (!topic) { console.log('  no evidence for ${TOPIC}'); process.exit(0); }
  const task = topic.tasks['${TASK}'];
  if (!task) { console.log('  no task ${TASK}'); process.exit(0); }
  const mark = task.status === 'passed' ? 'PASS' : task.status === 'compile-error' ? 'COMPILE ERROR' : task.status;
  console.log('  ' + mark + '  ' + task.passed + '/' + task.total + ' tests');
  if (task.compileError) console.log('    ' + task.compileError);
  if (task.explain && task.explain.flags.length) {
    for (const flag of task.explain.flags) console.log('    line ' + flag.line + ': ' + flag.message);
  }
" 2>/dev/null || true

# --- ship it --------------------------------------------------------------
echo "==> committing"
git add "$TARGET"
[ -f "learn/${TOPIC}/answers.json" ] && git add "learn/${TOPIC}/answers.json" || true
if git diff --cached --quiet; then
  echo "  nothing changed."
  exit 0
fi

git commit -m "${TOPIC}: ${TASK}"
git push

echo
echo "==> pushed. Say \"check ${TOPIC}\" and I will evaluate it."
