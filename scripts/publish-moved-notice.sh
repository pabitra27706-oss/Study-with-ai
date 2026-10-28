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
# ---------------------------------------------------------------------------
# A note on the clone, because this bit us once.
#
# The old repository is not readable by everyone. An anonymous `git clone` of
# it comes back with:
#
#     remote: Repository not found.
#
# which reads exactly like a typo in the URL, and is not one. GitHub answers
# "404, no such thing" for a repository you are not allowed to see, and it
# answers the same way for a repository that does not exist. So this script
# never trusts a bare clone: it asks GitHub who it is first, it clones
# through gh so the credential is actually sent, and when the clone is
# refused it says which of the two problems it found.
#
# The fix, if the clone is refused, is a credential in the same shell:
#
#     export GH_TOKEN=<your classic PAT>
#     gh auth setup-git
#
# Note the `<` and `>`: typing that line into a shell unquoted will not work.
# Put your actual token in place of the placeholder, without the angle
# brackets.
#
# ---------------------------------------------------------------------------
set -euo pipefail

cd "$(dirname "$0")/.."

TARGET_DIR="${1:-$HOME/portfolio}"
OWNER="pabitra27706-oss"
REPO_NAME="portfolio"
REPO="https://github.com/${OWNER}/${REPO_NAME}.git"
BRANCH="move/archive-into-the-learning-engine"

die() {
  echo "" >&2
  echo "  $1" >&2
  echo "" >&2
  exit 1
}

# --- 1. can we see the repository at all? -----------------------------------
# Deliberately NOT `gh auth status`. That command makes a live network call
# to validate the token, so on a flaky phone connection it reports
# "authentication failed" for a token that is perfectly fine — and then it
# sends you looking for a problem you do not have. The only honest question
# is "can GitHub see the repository with the credential I have right now",
# and the answer to that is the API call itself.
echo "==> checking the repository"
GH_WORKS=0
if command -v gh >/dev/null 2>&1; then
  if gh api "repos/${OWNER}/${REPO_NAME}" --jq .full_name >/dev/null 2>&1; then
    echo "  GitHub answered. The credential works."
    GH_WORKS=1
  else
    echo "  GitHub did not answer — it may be the network, not the token."
  fi
fi

# --- 2. clone (or reuse) ---------------------------------------------------
if [ ! -d "$TARGET_DIR/.git" ]; then
  echo "==> cloning ${OWNER}/${REPO_NAME} into $TARGET_DIR"
  rm -rf "$TARGET_DIR"
  CLONED=0
  if [ "$GH_WORKS" -eq 1 ]; then
    # gh hands git the credential properly; a bare clone does not.
    if gh repo clone "${OWNER}/${REPO_NAME}" "$TARGET_DIR" -- --quiet 2>/dev/null; then
      CLONED=1
    fi
  fi
  if [ "$CLONED" -eq 0 ]; then
    if ! git clone "$REPO" "$TARGET_DIR" 2>/tmp/clone-error.txt; then
      echo "" >&2
      sed 's/^/  /' /tmp/clone-error.txt >&2
      die "The clone was refused.

  Two things look identical from here and only one of them is real:
    1. the repository is not readable by everyone, so an anonymous clone
       is refused;
    2. the URL is wrong.

  The URL in this script is the canonical one, so it is almost certainly (1):
  git went out without a credential.

  Fix it in this shell, then run this script again:
      export GH_TOKEN=ghp_your_token_here
      gh auth setup-git

  (Replace the placeholder with your real token, and leave out the angle
  brackets — a shell reads < and > as redirection and will refuse the line.)

  If gh is not installed, use the token directly with git:
      git config --global credential.helper store
      git clone https://${OWNER}/${REPO_NAME}.git $TARGET_DIR
      (it will ask for a username — use your GitHub username — and for a
      password — use the PAT as the password.)"
    fi
  fi
else
  echo "==> reusing the clone at $TARGET_DIR"
fi

cd "$TARGET_DIR"

echo "==> pulling the latest"
git fetch origin
git checkout main
git pull --ff-only origin main

echo "==> writing the landing page and the pointer README"
SOURCE_DIR="$OLDPWD/archive/legacy/moved-page"
if [ ! -f "$SOURCE_DIR/index.html" ]; then
  die "Could not find $SOURCE_DIR/index.html — is your Study-with-ai clone up to date?
  Run:  cd ~/Study-with-ai && git pull"
fi
cp "$SOURCE_DIR/index.html" index.html
cp "$SOURCE_DIR/README.md" README.md

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
if ! git push -u origin "$BRANCH"; then
  die "The push was refused — git had no credential for the push.
  Export a classic PAT in this shell and run:
      export GH_TOKEN=ghp_your_token_here
      gh auth setup-git
  then run this script again."
fi

echo
echo "==> done. Open the pull request:"
echo "    gh pr create --repo ${OWNER}/${REPO_NAME} \\"
echo "      --base main --head $BRANCH \\"
echo "      --title 'The Learning Archive has moved into the learning engine'"
echo
echo "    (or open it on the phone:"
echo "     https://github.com/${OWNER}/${REPO_NAME}/pull/new/${BRANCH})"
