# State

**Written: 2026-10-28. Last updated: 2026-10-28, after the first judgement of the learner's own work.**
Update this file whenever something in it changes.

## The two accounts

| | Login | ID | Public repos | Holds |
|---|---|---|---|---|
| **Primary** | `pabitra27706-oss` | 260086383 | 17 | The originals, both live sites, the Pages domain, `Jelet-prep`, `Termux-Mastery`, `matriq`, this repo |
| **Second** | `pabi277` | 204871773 | 30 | `CodeC` (star 3), `AppFlow`, the Android apps, and ~20 forks and reference repos |

> **Do not type these.** Read them from the API (see `README.md`). A
> transcription error produces a 404 that looks like a missing account.

## Live URLs

| What | URL |
|---|---|
| This site | `https://pabitra27706-oss.github.io/Study-with-ai/` |
| The learn route | `https://pabitra27706-oss.github.io/Study-with-ai/learn` |
| One topic | `https://pabitra27706-oss.github.io/Study-with-ai/learn/c-loops` |
| The Learning Archive | `https://pabitra27706-oss.github.io/portfolio/` |
| CodeC (Pages) | `https://pabi277.github.io/CodeC/` |
| CodeC (source) | `https://github.com/pabi277/CodeC` |

## The repository

| | |
|---|---|
| Clone | `https://github.com/pabitra27706-oss/Study-with-ai.git` |
| Canonical branch | `main` |
| Working branch | `arena/0daea56d-study-with-ai` (this session) |
| Merged | **PR #6** — merged as `a8add89`, deployed to Pages, green. |
| Closed | **PR #5** — closed as a duplicate of #6. Its only remaining diff was the `docs/` build output, which #6 deliberately removed. Never merge it. |
| Also closed | PR #7 — superseded by this branch; its runbook updates are folded in here. |
| Archive repo | `https://github.com/pabitra27706-oss/portfolio` — 68 topics, 82 files |
| Deploy | Pages workflow committed by the owner at `414c6fe`; the hardened copy lives at `scripts/deploy-workflow.yml` |

## Where the learning actually stands

| | |
|---|---|
| Topic | `c-loops` — the only topic pack so far |
| The learner's work | `learn/c-loops/solutions/t2.c` — their first submission |
| Verdict | `mostly-correct`, **45%** (machine 30%), judged by Claude |
| What is right | Every value correct: 5! = 120, 0! = 1, 10! = 3628800, 20! = 2432902008176640000. All four test cases pass. `unsigned long long`, clean under `-Wall -Wextra`, negatives rejected. |
| What is missing | It is recursion in a loops topic, so the comment the task asks for (why the accumulator starts at 1, why the boundary includes N) cannot exist in it. All three comments state what, not why. |
| What is next | Rewrite t2 as a for loop and explain the initialiser and the condition. Then write your own four answers. |

## The learning engine

| Piece | Path | Role |
|---|---|---|
| Topic packs | `curriculum/topics/*.json` | The teaching half. One topic: `c-loops`. |
| Reference solutions | `curriculum/reference/c-loops/` | Worked examples with why-comments. |
| The learner's work | `learn/<topic>/solutions/*.c`, `learn/<topic>/answers.json` | Written in CodeC, pushed by the learner. |
| The sensor | `runner/evidence.mjs` | Compile, hidden test cases, comment check. Measures. Never judges. |
| The brief | `runner/brief.mjs` | Everything needed to judge. **This is what Claude reads.** |
| The verdict | `learn/<topic>/verdict.json` | Claude's judgement, in a fixed shape. |
| The writer | `runner/apply-verdict.mjs` | Writes the verdict into notes, review, history, progress, topic. |
| The site | `app/learn/`, `app/learn/[id]/` | The scoreboard. |
| The exporter | `scripts/export-to-portfolio.mjs` | Publishes the work into the Learning Archive. |
| The bridge | `scripts/collect.sh` | Fallback for when CodeC cannot push: copy, check, commit, push. |

## Build and check

```bash
npm ci --no-audit --no-fund     # node_modules is not in git; run this first
npm run typecheck               # clean
npm run lint                    # clean
NEXT_OUTPUT=export npm run build
node scripts/serve-static.mjs 3000 out    # preview locally
```

`docs/` is the static export and is **gitignored**. Do not commit it.

## What is verified

- `npm run typecheck`, `npm run lint` — clean.
- `NEXT_OUTPUT=export npm run build` — 18 routes, `/learn` and `/learn/c-loops` prerendered.
- `node runner/evidence.mjs` — reference solutions: 6/6 tasks, comments 100/100. Empty submission: nothing submitted. Deliberately wrong: t1 0/3, t2 0/4, 3 comment flags.
- `node runner/brief.mjs c-loops` — the brief renders with the code, the facts and the rules.
- `node runner/apply-verdict.mjs c-loops` — notes, review, history, progress and the topic all update; re-running is idempotent.
- The whole loop, end to end, in a throwaway clone: CodeC file -> collect -> brief -> verdict -> apply. A deliberately-wrong `t2.c` using `int` instead of `long long` **passed all 4 test cases** and was still judged wrong. That is the whole argument for a human-shaped judge.
- Live site renders the verdict, the machine facts, the notes and the review.
- PR #6 merged to `main` as `a8add89`; the Pages deployment for it returned `success`.
- The learner's own `t2.c` was judged end to end: brief -> sensor -> verdict -> apply. The verdict (20%) and the machine score (19%) agree, and both are far above the old seeded 28% once the shipped example was removed from the graded folder.

## Sandbox constraints (these will bite you)

- The sandbox has **no AI API key**. Do not design around one.
- `gh secret list` -> **403**. You cannot read or set GitHub secrets from here.
- The token **cannot push workflow files** (`.github/workflows/*`). Keep canonical copies under `scripts/` and tell the user to `cp` them.
- `npm ci` is needed after every snapshot reset — `node_modules` is excluded from snapshots.
- `npx tsc --noEmit` pulls a bogus `tsc@2.0.4`. Use `npm run typecheck`.
- `next lint` is gone in Next 16. Use `eslint .`.
- Do not use `prose` classes — the markdown class is `.md`.
- `lucide-react` has no `Github` export. Use `GitBranch`.
- `gh pr edit` fails on the Projects-classic GraphQL deprecation. Use
  `gh api -X PATCH repos/<owner>/<repo>/pulls/<n> --input payload.json` instead.
