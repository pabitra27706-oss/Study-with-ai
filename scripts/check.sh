#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# check.sh — the judging brief.
#
#   bash scripts/check.sh data-structures-c
#   bash scripts/check.sh --pending            just the queue
#   bash scripts/check.sh --archive <path>     one archive file
#
# Prints everything needed to judge a submission: what was taught, what the
# task asked, the code, the machine facts and the written answers.
#
# It also prints the queue — the work in the archive that has no verdict
# yet — because a file can arrive in the archive without ever being a task
# submission, and that work must not sit there unnoticed.
#
# This is what I read before giving a verdict. There is no model and no API
# key — the judge is me, in the conversation.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "${1:-}" != "--pending" ]; then
  node runner/brief.mjs --pending || true
  echo
  echo "======================================================================"
  echo
fi

exec node runner/brief.mjs "$@"
