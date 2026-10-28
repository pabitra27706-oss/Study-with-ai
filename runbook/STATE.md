# State

**Written: 2026-10-28. Last updated: 2026-10-29, after the first real topic pack shipped and the demo pack was retired.**
Update this file when something *decides* something. A merge on its own is
not worth an edit — the live ledger is `gh pr list --state all`, and the
append-only record is [`HISTORY.md`](HISTORY.md).

## The two accounts

| | Login | ID | Public repos | Holds |
|---|---|---|---|---|
| **Primary** | `pabitra27706-oss` | 260086383 | 17 | The originals, both live sites, the Pages domain, `Jelet-prep`, `Termux-Mastery`, `matriq`, this repo |
| **Second** | `pabi217` | 204871773 | 30 | `CodeC` (star 3), `AppFlow`, the Android apps, and ~20 forks and reference repos |

> **Do not type these.** Read them from the API (see `README.md`). A
> transcription error produces a 404 that looks like a missing account.

## Live URLs

| What | URL |
|---|---|
| This site | `https://pabitra27706-oss.github.io/Study-with-ai/` |
| The learn route | `https://pabitra27706-oss.github.io/Study-with-ai/learn` |
| One topic | `https://pabitra27706-oss.github.io/Study-with-ai/learn/data-structures-c` |
| The Learning Archive | `https://pabitra27706-oss.github.io/portfolio/` |
| CodeC (Pages) | `https://pabi217.github.io/CodeC/` |
| CodeC (source) | `https://github.com/pabi217/CodeC` |

## The repository

| | |
|---|---|
| Clone | `https://github.com/pabitra27706-oss/Study-with-ai.git` |
| Canonical branch | `main` |
| Working branch | `arena/42ceaa51-study-with-ai` (this session) |
| Merged | **PR #8** — merged as `e6973cd`, deployed to Pages, green. **PR #6** — merged as `a8add89`. **PRs #1–#4** merged. |
| Closed | **PR #5** (duplicate of #6), **PR #7** (superseded). Never merge either. |
| Open | **PR #9** — runbook housekeeping only, open and clean, **waiting for the owner to say merge**. |
| The live PR ledger | `gh pr list --state all --limit 30` — the truth. This table is a summary, not the record. |
| Archive repo | `https://github.com/pabitra27706-oss/portfolio` — 68 topics, 82 files |
| Deploy | Pages workflow committed by the owner at `414c6fe`; the hardened copy lives at `scripts/deploy-workflow.yml` |

## Where the learning actually stands

| | |
|---|---|
| Topic | **`data-structures-c`** — "Data Structures in C: linked lists, stacks, queues". The first real topic pack. |
| The learner's work | **Nothing yet.** `learn/data-structures-c/` is scaffolded and empty: `answers.json` is `{}`, `solutions/` holds only a `.gitkeep`. |
| Where it stands | **0%** — 0/8 tasks, comments 0/100, answers 0%. That is the honest number for a topic nobody has touched. |
| Why it starts at 0 | The previous pack shipped a finished example inside the graded folder, which inflated it to 29%. The rule now: a topic the learner has not touched is 0%, and it says 0%. |
| The retired pack | `c-loops` — the demo. Pack and reference solutions removed; the learner's work archived at `learn/archive/c-loops/` with a note explaining what it was and what they got out of it. |
| What the learner did in `c-loops` | `t2.c` — a recursive factorial. Every value correct (5! = 120, 0! = 1, 10! = 3628800, 20! = 2432902008176640000), all four test cases passing, clean under `-Wall -Wextra`. Verdict `mostly-correct`, **45%** (machine 30%). |
| What is next | The learner writes `t1.c` in CodeC, pushes, and says **"check data-structures-c"**. |

## The learning engine

| Piece | Path | Role |
|---|---|---|
| Topic packs | `curriculum/topics/*.json` | The teaching half. One topic: `data-structures-c`. |
| Reference solutions | `curriculum/reference/data-structures-c/` | 8 worked examples, one per task, all with why-comments. |
| The learner's work | `learn/<topic>/solutions/*.c`, `learn/<topic>/answers.json` | Written in CodeC, pushed by the learner. |
| The sensor | `runner/evidence.mjs` | Compile, hidden test cases, comment check. Measures. Never judges. |
| The brief | `runner/brief.mjs` | Everything needed to judge. **This is what Claude reads.** |
| The verdict | `learn/<topic>/verdict.json` | Claude's judgement, in a fixed shape. |
| The writer | `runner/apply-verdict.mjs` | Writes the verdict into notes, review, history, progress, topic. |
| The site | `app/learn/`, `app/learn/[id]/` | The scoreboard. |
| The exporter | `scripts/export-to-portfolio.mjs` | Publishes the work into the Learning Archive. |
| The bridge | `scripts/collect.sh` | Fallback for when CodeC cannot push: copy, check, commit, push. |

## The authoring system

| Piece | Path | Role |
|---|---|---|
| The manual | `runbook/NEW-TOPIC.md` | The whole sequence for writing a topic, in order, with the commands. |
| The scaffolder | `scripts/new-topic.mjs` | `node scripts/new-topic.mjs <id> "<title>"` — creates the pack skeleton, the reference folder, the learner's folder, and registers the topic. Refuses to overwrite. |
| The validator | `scripts/check-topic.mjs` | `node scripts/check-topic.mjs <id> --deep` — the gate. Video view floor, a `why` on every video, a hidden test on every task, points = 100, a reference solution per task that compiles, passes and scores 100 on the comment check, and the index agreeing with the pack. Exits 1 on any problem. |

## Build and check

```bash
npm ci --no-audit --no-fund     # node_modules is not in git; run this first
npm run typecheck               # clean
npm run lint                    # clean
NEXT_OUTPUT=export npm run build
node scripts/serve-static.mjs 3000 out    # preview locally
node scripts/check-topic.mjs --deep       # every topic pack
```

`docs/` is the static export and is **gitignored**. Do not commit it.

## What is verified

- `npm run typecheck`, `npm run lint` — clean.
- `NEXT_OUTPUT=export npm run build` — 18 routes, `/learn` and `/learn/data-structures-c` prerendered.
- `node scripts/check-topic.mjs data-structures-c --deep` — **PASS**: 16 videos, lowest 535,687 views, 14 sections, 8 tasks, 100 points, 8 reference solutions that all compile, pass 4/4 of their own tests and score 100 on the comment check.
- The validator was tested against a deliberately broken copy: it **failed** it with *"video 3 has 327 views, below the 1,00,000 floor"* and *"task t4 has 0 hidden tests"* and exited 1. It catches the exact mistake that shipped the old pack.
- `node runner/evidence.mjs` — `data-structures-c  0/8 tasks · comments 0/100 · answers 0%`. An untouched topic honestly reads zero.
- `node runner/evidence.mjs` against the reference folder — all 8 tasks pass, comments 100/100.
- `node runner/brief.mjs data-structures-c --task t1` — the brief renders with the prompt, the tests and the rules.
- PR #8 merged to `main` as `e6973cd`; the Pages deployment for it returned `success`.
- The learner's own `t2.c` was judged end to end: brief → sensor → verdict → apply. The verdict (20%) and the machine score (19%) agree, and both are far above the old seeded 28% once the shipped example was removed from the graded folder.

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
- **`fetch_page` on a YouTube watch page returns `Views`, `Likes`, `Length`, `Uploaded by` and `Uploaded at`.** That is how the video numbers in a pack get measured — read them, never guess them.
