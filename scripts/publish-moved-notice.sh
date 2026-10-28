#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# publish-moved-notice.sh — point the old archive repository at its new home.
#
#   bash scripts/publish-moved-notice.sh
#
# The Learning Archive used to be its own repository. It is now part of this
# one, and it is generated from the learning engine. The old repository still
# serves the original site, which is a perfectly good snapshot — but its
# landing page should tell people where the live version is.
#
# This script puts the landing page and the pointer README into that
# repository, on a branch, and pushes it. It does not merge: you read the
# diff, and you decide.
#
# It needs a credential that can write to that repository. The sandbox token
# for this project cannot — it is scoped to this repository — so this is one
# of the two things only you can run from the phone.
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

TARGET_DIR="${1:-$HOME/portfolio}"
REPO="https://github.com/pabitrawriters06-oss/portfolio.git"
BRANCH="move/archive-into-the-learning-engine"

if ! command -v git >/dev/null 2>&1; then
  echo "git is missing." >&2
  exit 1
fi

if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "==> cloning the archive repository into $TARGET_DIR"
  rm -rf "$TARGET_DIR"
  git clone "$REPO" "$TARGET_DIR"
fi

cd "$TARGET_DIR"

echo "==> pulling the latest"
git fetch origin
git checkout main
git pull --ff-only origin main

echo "==> writing the landing page and the pointer README"
cp "$OLDPWD/archive/legacy/moved-page/index.html" index.html
cp "$OLDPWD/archive/legacy/moved-page/README.md" README.md

echo "==> creating the branch"
git checkout -B "$BRANCH"

git add index.html README.md
if git diff --cached --quiet; then
  echo "  nothing changed — the notice is already there."
  exit 0
fi

git commit -m "The Learning Archive has moved into the learning engine

The archive is now part of Study-with-ai, in the archive/ folder, and it is
generated from the learning engine on every build. Nothing to copy, nothing to
remember, and it cannot fall behind the work.

The old site, its data, its content and all 16 commits stay exactly as they
are, so every deep link still resolves."

echo "==> pushing"
git push -u origin "$BRANCH"

echo
echo "==> done. Open the pull request:"
echo "    gh pr create --repo pabitrawriters06-oss/portfolio \\"
echo "      --base main --head $BRANCH \\"
echo "      --title 'The Learning Archive has moved into the learning engine'"
echo
echo "    (or open it on the phone: https://github.com/pabitrawriters06-oss/portfolio/pulls)"
