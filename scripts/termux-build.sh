#!/usr/bin/env bash
#
# OPTIONAL — build the site *on the phone* (only if you want to).
#
#   bash scripts/termux-build.sh
#
# WHY THIS IS OPTIONAL
#   Next.js 16 ships native binaries (Turbopack, SWC, lightningcss) that are
#   compiled against glibc. Android/Termux uses bionic, so `npm run build`
#   fails on a plain Termux install. The fix is a glibc environment via
#   proot-distro — a full Ubuntu running under a userspace emulator.
#
#   You do not need this if you use the GitHub Actions workflow: the build
#   then happens on GitHub's own Ubuntu runner and never touches your phone.
#
# WHAT IT DOES
#   1. Installs proot-distro + Ubuntu.
#   2. Installs Node 22, git and build tools inside Ubuntu.
#   3. Clones the repo inside Ubuntu, runs `npm ci` and `npm run build:pages`.
#   4. Commits the rebuilt docs/ folder and pushes it.
#
# NOTE: the clone lives inside the Ubuntu filesystem (~/.root/ubuntu/...), not
# in /sdcard — Android's shared storage breaks file permissions inside proot.

set -euo pipefail

OWNER="pabitra27706-oss"
REPO="Study-with-ai"
BRANCH="main"
DISTRO="ubuntu"
NODE_MAJOR="22"

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
step() { printf '\n\033[1;36m==>\033[0m %s\n' "$1"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$1"; }
fail() { printf '\033[1;31m[fail]\033[0m %s\n' "$1"; exit 1; }

command -v pkg >/dev/null 2>&1 || fail "this script only runs inside Termux"

step "Installing proot-distro and ${DISTRO}"
pkg install -y proot-distro >/dev/null 2>&1 || true
if ! proot-distro list 2>/dev/null | grep -q "${DISTRO}"; then
  echo "  installing ${DISTRO} (a few hundred MB — this takes a while)"
  proot-distro install "${DISTRO}"
else
  echo "  ${DISTRO} is already installed"
fi

step "Preparing the Ubuntu environment (Node ${NODE_MAJOR}, git, build tools)"

# The heavy lifting happens inside proot. The inner script is passed via stdin.
proot-distro login "${DISTRO}" <<INNER
set -e
export DEBIAN_FRONTEND=noninteractive

apt-get update -qq
apt-get install -y -qq git curl ca-certificates build-essential python3 xz-utils unzip >/dev/null

if ! command -v node >/dev/null 2>&1 || [ "\$(node -v | cut -d. -f1 | tr -d 'v')" -lt "${NODE_MAJOR}" ]; then
  echo "  installing Node ${NODE_MAJOR}"
  curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash - >/dev/null
  apt-get install -y -qq nodejs >/dev/null
fi
echo "  node \$(node -v)  |  npm \$(npm -v)"

cd ~
if [ ! -d "Study-with-ai/.git" ]; then
  echo "  cloning the repository"
  git clone "https://github.com/${OWNER}/${REPO}.git"
fi
cd Study-with-ai
git fetch origin "${BRANCH}"
git checkout "${BRANCH}"
git reset --hard "origin/${BRANCH}"

echo "  installing dependencies"
npm ci --no-audit --no-fund

echo "  building the static export into docs/"
npm run build:pages

git add docs
if git diff --cached --quiet; then
  echo "  docs/ is unchanged — nothing to push"
else
  git -c user.name="Pabitra" \
      -c user.email="pabitra27706-oss@users.noreply.github.com" \
      commit -m "Rebuild published site"
  git push origin "${BRANCH}"
  echo "  pushed."
fi
INNER

cat <<'DONE'

────────────────────────────────────────────────────────────
  Build finished and pushed.

  If Pages is set to "Deploy from a branch -> main -> /docs"
  the site updates in about a minute.

  If Pages is set to "GitHub Actions", this phone build was
  unnecessary — the runner does it for you.
────────────────────────────────────────────────────────────
DONE
