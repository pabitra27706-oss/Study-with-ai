# CLAUDE.md

**Read [`runbook/README.md`](runbook/README.md) first.** Then
`runbook/STATE.md` and `runbook/THE-LOOP.md`.

This repository is not a codebase you write. It is a **learning system** a
human runs, with you as the judge. The rules are in `AGENTS.md`; the current
state, the exact steps, the judging guide and the decision log are in
`runbook/`.

## The three things that will break the work

1. **Never merge a pull request** without the user saying so. Open PRs are
   fine. Merging is not.
2. **Never write to `journal/`.** It is the learner's.
3. **Never put another AI in the loop.** The judge is you, in the
   conversation. A CI agent, a model API and an issue bot were all built and
   all rejected — the reasoning is in `runbook/HISTORY.md`.

## The one trap

The two GitHub account names are easy to mistype, and a mistyped account
returns 404 exactly like a missing one. **Never type them** — read them from
the API. The command is in `runbook/README.md`.

## The one rule of judging

The compiler is a **sensor**, not a judge. It reports what happened; you decide
what it means. A program can pass every test and still be wrong for the inputs
the task names — that is exactly the case a test runner cannot catch and you
can. Give the correction, never the finished program.
