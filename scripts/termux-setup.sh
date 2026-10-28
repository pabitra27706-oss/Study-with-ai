#!/usr/bin/env bash
#
# Termux helper — publish the site from your phone.
#
#   bash scripts/termux-setup.sh
#
# What it does:
#   1. Installs the Termux packages you need (git, gh).
#   2. Clones the repo if you have not already.
#   3. Installs the GitHub Pages workflow from scripts/deploy-workflow.yml.
#   4. Commits and pushes it to main.
#   5. Turns GitHub Pages on (via gh, if you are logged in).
#
# YOU DO NOT BUILD THE SITE ON THE PHONE.
# The workflow runs on GitHub's own Ubuntu runner, so the Next.js build
# happens on a real Linux machine. Termux is used only for git + gh.

set -euo pipefail

OWNER="pabitra27706-oss"
REPO="Study-with-ai"
BRANCH="main"
SSH_URL="https://github.com/${OWNER}/${REPO}.git"
WORKFLOW_SRC="scripts/deploy-workflow.yml"
WORKFLOW_DST=".github/workflows/deploy.yml"

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
step() { printf '\n\033[1;36m==>\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$1"; }
fail() { printf '\033[1;31m[fail]\033[0m %s\n' "$1"; exit 1; }

command -v termux-am >/dev/null 2>&1 || true

# ---------------------------------------------------------------- 1. packages
step "Checking Termux packages"
if command -v pkg >/dev/null 2>&1; then
  pkg update -y >/dev/null 2>&1 || true
  for p in git gh; do
    if ! command -v "$p" >/dev/null 2>&1; then
      echo "  installing $p ..."
      pkg install -y "$p" >/dev/null 2>&1 || warn "could not install $p automatically"
    fi
  done
else
  warn "this does not look like Termux — continuing anyway"
fi

command -v git >/dev/null 2>&1 || fail "git is missing: run  pkg install git  and re-run"

# -------------------------------------------------------------- 2. repository
step "Finding the repository"
if [ -d ".git" ]; then
  REPO_DIR="$(pwd)"
  echo "  using the current directory: $REPO_DIR"
else
  TARGET="${HOME}/Study-with-ai"
  if [ -d "${TARGET}/.git" ]; then
    REPO_DIR="${TARGET}"
    echo "  using the existing clone: $REPO_DIR"
  else
    REPO_DIR="${TARGET}"
    echo "  cloning into $REPO_DIR ..."
    git clone "$SSH_URL" "$REPO_DIR"
  fi
  cd "$REPO_DIR"
fi

# ------------------------------------------------------------------ 3. gh auth
step "Checking GitHub CLI login"
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    echo "  logged in as $(gh api user --jq .login)"
  else
    echo "  not logged in."
    echo "  Run this now (it prints a one-time code, open the URL in your phone browser):"
    echo
    echo "      gh auth login --hostname github.com --git-protocol https --web"
    echo
    echo "  Then re-run: bash scripts/termux-setup.sh"
    warn "stopping here — nothing was changed yet"
    exit 0
  fi
fi

# ---------------------------------------------------------------- 4. workflow
step "Installing the deploy workflow"
if [ ! -f "$WORKFLOW_SRC" ]; then
  fail "$WORKFLOW_SRC not found — are you inside the repository?"
fi

mkdir -p .github/workflows
cp "$WORKFLOW_SRC" "$WORKFLOW_DST"
echo "  wrote $WORKFLOW_DST"

# ------------------------------------------------------------ 5. commit + push
step "Committing and pushing"
git config user.name "$(git config user.name || echo 'Pabitra')" >/dev/null
git config user.email "$(git config user.email || echo 'pabitra27706-oss@users.noreply.github.com')" >/dev/null

git add "$WORKFLOW_DST"
if git diff --cached --quiet; then
  echo "  workflow already committed — nothing to push"
else
  git commit -m "Add GitHub Pages deploy workflow"
fi

CURRENT="$(git rev-parse --abbrev-ref HEAD)"
echo "  pushing to origin/${BRANCH} (current branch: ${CURRENT})"
if git push origin "HEAD:${BRANCH}"; then
  echo "  pushed."
else
  fail "push failed — check that gh is logged in with the 'workflow' scope:
  gh auth refresh -h github.com -s workflow"
fi

# ------------------------------------------------------------- 6. enable pages
step "Turning GitHub Pages on"
if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  if gh api "repos/${OWNER}/${REPO}/pages" >/dev/null 2>&1; then
    echo "  Pages already exists — updating it to use GitHub Actions"
    gh api --method PUT "repos/${OWNER}/${REPO}/pages" \
      -f build_type=workflow >/dev/null && echo "  done." || warn "could not update Pages automatically"
  else
    if gh api --method POST "repos/${OWNER}/${REPO}/pages" \
      -f build_type=workflow >/dev/null 2>&1; then
      echo "  Pages enabled with source = GitHub Actions."
    else
      warn "could not enable Pages via the API (the token may lack admin rights)."
      echo "  Do it by hand instead:"
      echo "    github.com/${OWNER}/${REPO}/settings/pages  ->  Source: GitHub Actions  ->  Save"
    fi
  fi
else
  warn "gh is not logged in — enable Pages by hand:"
  echo "    github.com/${OWNER}/${REPO}/settings/pages  ->  Source: GitHub Actions  ->  Save"
fi

cat <<'DONE'

────────────────────────────────────────────────────────────
  Done. The site is building on GitHub's servers.

  Watch it:   gh run watch
  Or open:    https://github.com/pabitra27706-oss/Study-with-ai/actions

  Live URL (about 2 minutes after the build turns green):
  https://pabitra27706-oss.github.io/Study-with-ai/
────────────────────────────────────────────────────────────
DONE
