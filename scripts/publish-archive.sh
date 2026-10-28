#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# publish-archive.sh — refresh the Learning Archive and ship it.
#
#   bash scripts/publish-archive.sh
#
# You used to have to remember this:
#
#   clone the portfolio repo -> copy files into data/ and content/ ->
#   update the index by hand -> commit -> push
#
# ...which is four folders and a lot of remembering, on a phone, every time
# you finished a task. That is exactly the sort of thing that stops
# happening.
#
# Now the archive is a view of the learning engine. This script regenerates
# it from what is already in the repository, shows you what changed, and
# pushes it.
#
# In practice you should not need this at all: the archive is regenerated
# during the site build, so every merge to main refreshes it. It is here for
# when you want the archive current in the repository itself without waiting
# for a build.
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v node >/dev/null 2>&1; then
  echo "Node is missing. In Termux: pkg install nodejs" >&2
  exit 1
fi

echo "==> regenerating the archive from the engine"
node scripts/build-archive.mjs

echo
echo "==> what changed"
CHANGED=$(git status --porcelain -- archive/ || true)
if [ -z "$CHANGED" ]; then
  echo "  nothing — the archive is already in step with the engine."
  exit 0
fi
echo "$CHANGED" | sed 's/^/  /'

echo
echo "==> committing"
git add archive/
if git diff --cached --quiet; then
  echo "  nothing changed."
  exit 0
fi

git commit -m "Sync the Learning Archive from the learning engine"

if [ "${1:-}" = "--commit-only" ]; then
  echo
  echo "==> committed, not pushed (--commit-only)."
  exit 0
fi

echo "==> pushing"
git push

echo
echo "==> done. The archive is current, and the site rebuilds on merge."
