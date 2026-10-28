# Decision log

**Append-only.** Newest at the bottom. Never rewrite an old entry — if a
decision changes, add a new one that supersedes it and say so.

This file exists so that a fresh session does not re-propose a design that was
already tried and rejected. Read it before changing the architecture.

---

## 2026-10-28 — The audit, the roadmap and the site

**Decided.** Audit both GitHub accounts, write a research-backed learning
design and a career roadmap, and ship a web interface with live links.

**Done.** `GITHUB-AUDIT.md` (both accounts, 47 repositories), `LEARNING-JOURNEY.md`
(11 sections, 40 sources), `ROADMAP.md` (JELET priority, Jadavpur CSE, part-time
income), and the Next.js site. PRs #1-#4 merged; the site is live on GitHub
Pages.

**Why it mattered.** The audit produced the fact the whole project now rests on:
**47 repositories, zero automated tests.** A repository that cannot tell you
whether you understood something is a notebook, not a learning system.

---

## 2026-10-28 — The learning engine, and the first wrong turn

**Decided.** Build the engine: curriculum packs (explanation, curated videos,
tasks with hidden tests, rubric), a deterministic sensor, the `learn/<topic>/`
artefacts, the site pages, and the portfolio exporter.

**First attempt (REJECTED).** A CI agent that judged every push with a Gemini
API key, and an issue bot that wrote the review back as a GitHub issue comment.

**Why it was rejected.** The owner said it plainly: *"I will not use agent like
that. I will use CodeC my own app for code and upload to github. Than i will
use you to evaluate, not any other ok. Your process good but i can not
interaction with ai that way do you understand."*

**The lesson.** An autonomous agent acting on a repository is not a learning
loop for this person. A conversation is. Do not re-propose a CI agent, a
model API, an issue bot, or any second AI in the loop.

---

## 2026-10-28 — The compiler is a sensor, not a judge

**Decided.** The deterministic grader may only supply hard facts — does it
compile, which hidden cases pass, does every comment explain a why, which
keyword ideas the answers hit. It never decides what those facts mean.

**Why.** A test runner can tell you a program failed on `n = 0`. It cannot tell
you whether you understand why, and those two cases look identical to `gcc` and
completely different to a teacher. One is a typo; the other is a broken mental
model.

**Earlier rejection of the opposite design.** The owner had already said: *"No
the compiler never judge it the ai will judge and give feedback and keep the
github good see and everything."*

---

## 2026-10-28 — The current architecture

**Decided.**

```
CodeC (write code)  ->  push  ->  GitHub  ->  "check <topic>"
                                            |
                                  runner/brief.mjs -> Claude judges
                                            |
                                  verdict.json -> runner/apply-verdict.mjs
                                            |
                                  notes · review · history · progress
```

No CI agent. No issue bot. No model provider. No API key. **Claude, in the
conversation, is the only judge.**

**Built.** `runner/brief.mjs` (the instrument Claude reads),
`runner/apply-verdict.mjs` (writes a verdict into the repository in one shape
every time, idempotently), `scripts/collect.sh` (the fallback bridge),
`scripts/check.sh`.

**Deleted.** `runner/agent.mjs`, `runner/lib/judge.mjs`, both providers,
`scripts/learn-workflow.yml`, `scripts/review-and-commit.sh`.

**Also decided.** The verdict and the machine facts are shown **separately** on
the site. They are different things and conflating them was hiding the point.

---

## 2026-10-28 — The learning archive slug

**Decided.** The archive is `pabitra27706-oss/portfolio`. The exporter points there.

**History.** An earlier slug 404'd. A later "fix" was itself a transcription
error — see the next entry.

---

## 2026-10-28 — The account names must never be typed

**Decided.** Both account names are read from the GitHub API, never typed by
hand, in every script, doc and command.

**Why.** The names are easy to mistype, and a mistyped account is
indistinguishable from a missing one — `gh api users/<wrong>` returns 404,
exactly as it would for an account that does not exist. This cost a real hour
of hunting a "missing" account that was there the whole time.

**How to get them.**

```bash
A1=$(gh api user --jq .login)
A2=$(gh api "repos/$A1/CodeFlow/contributors" --jq ".[] | select(.login != \"$A1\") | .login" | head -1)
```

`CodeFlow` is the repository both accounts pushed to, so its contributor list
is where the second account shows up.

---

## 2026-10-28 — CodeC pushes to GitHub itself

**Decided.** The primary submission path is CodeC committing straight to
`learn/<topic>/solutions/<task>.c` in this repository. `scripts/collect.sh` is
the documented fallback for when CodeC cannot reach GitHub from the phone.

**Why.** The owner confirmed CodeC already talks to GitHub. No copy step, no
file moving around on the phone.

**Verified from the CodeC source.** It clones into
`/data/data/com.codeci.ide/files/CodeC/projects/<repo>`, stores a PAT in
`GitCredentialsStore` and feeds it to git through an askpass script (never into
a remote URL), pushes the branch name explicitly, and has a **Publish to
GitHub** flow that creates a repo through `POST /user/repos`.

---

## 2026-10-28 — PR #6 merged, PR #5 closed

**Decided.** The owner's instruction was *"Please merge the pull request."*

**Done.** PR #6 squashed into `main` as `a8add89` — matching the repository's
existing convention, since `main` carries no merge commits, only squash
merges. The Pages deployment for it returned `success`. PR #5 was closed as a
duplicate: its only remaining diff was the `docs/` build output, which #6
deliberately removed from version control, so merging it would have undone
that.

**Also done.** The runbook was updated to match reality. A runbook that still
says "PR #6 is open" after it has merged is exactly the failure this folder
exists to prevent.

> *This entry was lost when the branch history was reset after the merge, and
> restored by hand. The log is append-only — if a reset ever drops it again,
> put it back.*

---

## 2026-10-28 — The first judgement of the learner's own work

**What happened.** The learner wrote `learn/c-loops/solutions/t2.c` — a
recursive factorial — and pushed it. That is the first submission in this
project that was not written by me.

**The verdict.** `incomplete`, 20% (machine 19%).

**What the sensor found.** It compiles. Every value it computes is right:
5! = 120, 0! = 1, 10! = 3628800, 20! = 2432902008176640000. It fails all four
test cases because it prints `Enter an integer: Factorial of 5 = 120` where the
test expects `120`. All three comments state what, not why.

**What the judgement added.** The maths is right and the exercise is not done:
this is a loops topic, and the task's comment requirement asks why an
accumulator starts at 1 and why the boundary includes N — neither of which can
exist in a recursive program. The correction is the *shape* of the solution and
the *output contract*, not the arithmetic. The full solution was not handed
over.

**A measurement bug, found and fixed.** The scoreboard was crediting the
learner with a passing task they never wrote: `learn/c-loops/solutions/t1.c`
was byte-identical to `curriculum/reference/c-loops/t1.c`, the example the
topic ships with. It was removed from the graded folder — the reference copy
stays where it belongs — so the number now measures the learner's own work.
That is why the score went *down* from 28% to 20% while the work went up.

**Also.** `learn/c-loops/.fingerprint` was removed: it belonged to the deleted
agent design and nothing read it.

---

## 2026-10-28 — The sensor was too strict, and the verdict was wrong

**The correction.** The owner, on the first judged submission: *"You say it
wrong because of a space? `Factorial of 5 = 120` is not `120`. Don't be so
strict all outputs are ok so it should be passed."*

**What was actually wrong.** The sensor compared stdout byte for byte. A
program that prints `Factorial of 5 = 120` computed 5! perfectly and was
failed for formatting. That is a noisy sensor: it makes the judge argue with
the sensor instead of judging the work.

**The change.** The sensor now asks one question — **is the right value there?**
The expected answer must appear as a whole token, or a whole line for
multi-line expectations. `120` matches `Factorial of 5 = 120`; it does not
match `1200`. Output with extra text still passes, but is recorded as
**noisy** and shown to the judge, who decides whether the extra text is
acceptable. The site shows it too, under *output carries extra text*.

**Verified it did not weaken the sensor.** Deliberately broken programs still
fail: off-by-one, wrong value, trailing digits, and exiting non-zero on an
edge case. Only cosmetics are forgiven.

**The verdict changed.** `incomplete` 20% → **`mostly-correct` 45%** (machine
30%). The programme was never wrong about the mathematics. What is missing is
the thing the task asked for: it is recursion in a loops topic, so the comment
the task requires — why the accumulator starts at 1, why the boundary includes
N — cannot exist in it, and none of its three comments explain a why.

**Also.** `runbook/START-HERE.md` is new: a permanent, copy-paste prompt for
starting a new chat, with a table for reading a push before guessing, and the
instruction to ask when it is ambiguous.

---

## 2026-10-28 — PR #8 merged

**Done.** PR #8 squashed into `main` as `e6973cd`. The Pages deployment for it
returned `success`. It carried the sensor's leniency fix, the corrected
verdict on the learner's `t2.c`, the *output carries extra text* display on the
site, and `runbook/START-HERE.md`.

**Also decided here.** The PR ledger in `STATE.md` now points at
`gh pr list --state all` as the source of truth, and the table records only
the decisions that matter. A merge on its own is no longer worth a runbook
edit — which stops this file needing a new commit after every single merge.

**The PR ledger, for the record.**

| PR | State | What it was |
|---|---|---|
| #1–#4 | merged | the site, the Termux tooling, the audit, the roadmap |
| #5 | closed | duplicate of #6 — do not merge |
| #6 | merged | the learning engine: CodeC → push → Claude judges |
| #7 | closed | superseded by #8 |
| #8 | merged | the first real judgement, and the sensor fix |
