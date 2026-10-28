#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# check.sh — the judging brief.
#
#   bash scripts/check.sh data-structures-c
#
# Prints everything needed to judge a submission: what was taught, what the
# task asked, the code, the machine facts and the written answers.
#
# This is what I read before giving a verdict. There is no model and no API
# key — the judge is me, in the conversation.
# ---------------------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")/.."
exec node runner/brief.mjs "$@"
