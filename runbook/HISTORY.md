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
