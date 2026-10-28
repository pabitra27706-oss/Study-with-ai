# The learning system

> **You write it in CodeC. You push it to GitHub. I judge it.**
> No model, no API key, no automated agent — the judge is me, in the
> conversation, and the verdict is written back into the repository.

This is the machine behind the `/learn` route. It exists because of one
uncomfortable finding in the GitHub audit: **47 repositories, zero automated
tests, and a learning archive whose notes were one line long.**

A repository that cannot tell you whether you understood something is a
notebook, not a learning system.

---

## 1. The loop

```
  CodeC                          you write the code, on your phone
    │
    │  save it
    ▼
  scripts/collect.sh             copies it in, checks it, commits, pushes
    │
    ▼
  GitHub                         learn/<topic>/solutions/t1.c
    │
    │  you say: "check c-loops"
    ▼
  runner/brief.mjs               what was taught · what was asked · the code
                                 the machine facts · the written answers
    │
    │  I read it
    ▼
  learn/<topic>/verdict.json     my verdict, in a fixed shape
    │
    ▼
  runner/apply-verdict.mjs       notes.json · review.md · history.md
                                 progress.json · curriculum/topics/<id>.json
    │
    ▼
  commit → push → Pages rebuilds → the scoreboard moves
```

**Why the judge is a conversation and not a service.** An automated agent
judging in a CI log is a black box: you cannot argue with it, and it cannot
notice that you were testing a boundary case on purpose. A judge you can talk
to can. The loop is designed so that arguing is possible — the brief contains
every fact, and you can correct me.

**Why the compiler is not the judge.** A test runner can tell you a program
failed on `n = 0`. It cannot tell you whether you understand why. Those two
cases look identical to `gcc` and completely different to a teacher: one is a
typo, the other is a broken mental model. That distinction is the whole job,
and it is exactly the kind of thing a conversation does better than a script.

**Why the notes are written, not written by you.** Your three lines should
describe what your submission actually demonstrated — not what you intended.
Written by you they drift towards what you hoped happened. Derived from what
actually ran, they stay honest.

---

## 2. What is in the box

| Path | What it is | Who writes it |
|---|---|---|
| `curriculum/topics/*.json` | The **topic pack**: explanation, curated videos, tasks, rubric | AI |
| `curriculum/reference/*/` | Worked solutions showing what a good answer looks like | AI |
| `learn/<topic>/solutions/*.c` | **Your code** (written in CodeC) | You |
| `learn/<topic>/answers.json` | **Your four short answers** | You |
| `learn/<topic>/verdict.json` | **My judgement**, in a fixed shape | Claude |
| `learn/<topic>/notes.json` | The three notes lines | Claude |
| `learn/<topic>/review.md` | The written review | Claude |
| `learn/<topic>/history.md` | Every judgement, dated | Claude |
| `runner/brief.mjs` | The judging brief — everything I read before a verdict | — |
| `runner/evidence.mjs` | The sensor: compile, test, comment check | — |
| `runner/apply-verdict.mjs` | Writes a verdict into the repository | — |
| `runner/lib/explain.mjs` | The why-comment checker | — |
| `runner/lib/rubric.mjs` | The keyword-coverage scorer (a hint, not a verdict) | — |
| `runner/lib/sandbox.mjs` | Compile and run, with a timeout | — |
| `data/evidence.json` | The machine facts | Claude |
| `data/progress.json` | The verdict and the facts together | Claude |
| `scripts/collect.sh` | The CodeC bridge: copy in, check, commit, push | — |
| `scripts/check.sh` | Prints the brief | — |
| `scripts/export-to-portfolio.mjs` | Publishes your work into the Learning Archive | — |

---

## 3. The two rules

Everything else in this document is mechanics. These two are the point.

### Rule 1 — your writing is minimal, your code is not

You write **four short answers** and that is all. The three notes lines are
written for you, from what your code and answers actually show.

**The code carries the explanation.** That is why the notes can be short.

### Rule 2 — a comment must explain *why*, never *what*

| ✗ What-comment | ✓ Why-comment |
|---|---|
| `// increment i` | `// start at 1: factorial needs every value from 1..n, and i=0 would zero the product` |
| `// loop from 1 to n` | `// i<=n not i<n: n itself is a factor (n! includes n)` |
| `// multiply` | `// multiply, don't add: factorial is a product of the running range` |

A what-comment adds nothing and rots the moment the code changes. A why-comment
survives edits and it is the only thing that will still make sense to you in
six months.

`runner/lib/explain.mjs` checks this mechanically: every loop header and every
value that changes each iteration needs a comment on it or on the line above,
a comment that only restates the code is flagged, and a comment with no causal
marker (`because`, `so`, `not`, `instead of`, `must`, `to avoid`, …) is flagged.

It never tries to understand your program. It only asks whether you explained
the parts that are easy to get wrong. **Repeatable is what makes it a system.**

---

## 4. The loop, in practice

### Write it in CodeC, then:

```bash
bash scripts/collect.sh c-loops t1
```

That finds the file (in `~/codec-out/`, `~/storage/downloads/`, or wherever
CodeC saves), copies it into `learn/c-loops/solutions/t1.c`, compiles it, runs
the test cases, checks the comments, commits and pushes.

You can also just paste the code into this conversation and I will write the
file, check it and push it for you.

### Then say:

> check c-loops

### What I do:

1. `node runner/brief.mjs c-loops` — read the topic, the task, your code, the
   machine facts and your answers.
2. Write `learn/c-loops/verdict.json` — the verdict, the score, the three notes
   lines, the misconceptions and the written review.
3. `node runner/apply-verdict.mjs c-loops` — everything lands in the repository.
4. Commit, push. Pages rebuilds. The scoreboard moves.

### What you get back:

| File | Contents |
|---|---|
| `learn/<topic>/notes.json` | The three notes lines, in your voice, derived from what your submission showed |
| `learn/<topic>/review.md` | The written review: solid, fix this first, fix this next, the one section to re-read |
| `learn/<topic>/history.md` | One dated line per judgement — the record of what you could do on which day |
| `curriculum/topics/<id>.json` | The topic's `learningNotes` are refreshed |
| `data/progress.json` | The verdict, and the machine facts beside it |

The notes are capped at 220 characters and forced onto one line. A note that
needs a bullet list is a note that is not understood yet.

---

## 5. The CodeC side

CodeC is your editor. This repository is the notebook. The bridge between them
is one file on the phone.

**Option A — CodeC saves to a folder (works today, nothing to configure).**

Point CodeC's save location at `~/codec-out/` in Termux, or just use the normal
Android Downloads folder. Then:

```bash
bash scripts/collect.sh c-loops t1
```

`collect.sh` looks in `~/codec-out/`, `~/storage/downloads/`,
`$EXTERNAL_STORAGE/Download/` and `/sdcard/Download/`, takes the newest file
matching the task id, copies it into `learn/<topic>/solutions/<task>.c`,
compiles it, runs the test cases, checks the comments, commits and pushes.

If it cannot find the file it tells you the paths it tried, and you pass the
path yourself:

```bash
bash scripts/collect.sh c-loops t1 /storage/emulated/0/Download/t1.c
```

**Option B — CodeC pushes to GitHub itself.**

If CodeC already talks to GitHub, point it at this repository and commit
straight to `learn/<topic>/solutions/<task>.c`. Then `collect.sh` is not needed
at all — the file is already in the right place. Say **check \<topic\>** and I
take it from there.

Either way the rule is the same: **you decide when the work is ready to be
judged.** Nothing runs on a schedule, and nothing posts to your repository
behind your back.

> The `CodeC` repository URL could not be confirmed from the build sandbox
> (`git clone https://github.com/pabiwilliams/CodeC.git` returns *Repository not
> found* — the account or the repo name is different). Nothing above depends on
> it: the bridge only needs the file on your phone and this repository. Send me
> the real URL and I will wire the docs to it.

---

## 6. The two scores

The site shows both, and they are not the same thing.

| | What it is | Who sets it |
|---|---|---|
| **The verdict** | `correct` · `mostly-correct` · `incomplete` · `incorrect`, with a written review | Me |
| **The machine facts** | compiles · test cases · comment check · keyword coverage | `runner/evidence.mjs` |

The machine score is 70% tasks, 15% answers, 10% comments. It is deliberately
not the whole story: it cannot tell a typo from a broken mental model. The
verdict can, because it reads the code and the answers, not just the exit codes.

Keyword coverage is a **hint for you, not the truth**. The rubric lists the key
ideas an answer should contain; a correct idea that avoids the exact keyword
still gets the mark.

---

## 7. Adding a topic

A topic pack is one JSON file. I write the teaching half; you write the doing
half.

1. `topic` — id, title, language, category, difficulty, tags, description.
2. `curriculum.explanation` — an array of `{h, md}` sections. **Write the whole
   thing.** The order people get wrong, the bugs that cost marks, the idiomatic
   choice. Not a teaser and not a summary.
3. `curriculum.videos` — **each one needs a `why`.** A link without a reason is
   a list; a link with a reason is a curriculum. Prefer specific videos over
   channels. Say what each one is *for*.
4. `curriculum.references` — text references for the parts videos gloss over.
5. `curriculum.tasks` — prompt, starter code, `tests` (mark the visible ones
   with `"public": true`), `explainTarget`, `hints`.
6. `curriculum.rubric.written` — questions with `keywords` for the coverage hint.
7. `curriculum.rules` — `writingMaxChars`, `commentPolicy`, `notePolicy`.

Then register it in `curriculum/index.json` and create `learn/<id>/` with empty
`answers.json` and a `solutions/.gitkeep`.

**The `explainTarget` field is the one people skip.** It states, in one line,
what the comment for that task has to explain. It is the difference between
"write a factorial" and "write a factorial and say why the accumulator starts
at 1".

---

## 8. Publishing into the Learning Archive

Your archive lives at `pabitra27706-oss/portfolio` — 68 topics, 82 files, and
the only place people can read your code, preview it and download it.

```bash
git clone https://github.com/pabitra27706-oss/portfolio.git ../portfolio
node scripts/export-to-portfolio.mjs ../portfolio
cd ../portfolio && git status && git diff
git commit -am "Add loops in C from the AI curriculum" && git push
```

That writes the topic in the archive's own schema, copies your actual code
into `content/`, and refreshes `data/index.json` — including the notes, so the
archive shows your latest judgement, not a one-line summary.

---

## 9. Commands

| Command | What it does |
|---|---|
| `bash scripts/collect.sh c-loops t1` | The CodeC bridge: copy in, check, commit, push |
| `bash scripts/check.sh c-loops` | Print the judging brief |
| `node runner/brief.mjs c-loops --task t1` | One task only |
| `node runner/evidence.mjs` | Compile, test and score the comments; write `data/evidence.json` |
| `node runner/apply-verdict.mjs c-loops` | Apply `verdict.json` to the repository |
| `node scripts/export-to-portfolio.mjs ../portfolio` | Publish into the archive |
| `npm run preview` | Serve the built site locally |

---

## 10. Why it is built this way

- **The judge is a conversation.** You can argue with a person. You cannot argue
  with a CI log. And the whole point of the feedback loop is to change what you
  do next.
- **The compiler is kept, but demoted to a sensor.** It reports what happened.
  It does not decide what it means.
- **The notes are written for you, from the evidence.** Your own notes drift
  towards what you hoped happened.
- **Everything comes back into the repository.** The notes, the review and a
  dated history line, so the repo is the memory and the site is the scoreboard.
  Nothing lives in a chat window that is gone tomorrow.
- **The score is committed.** Git history becomes the record of what you could
  do on which day. That is a CV line with receipts.
- **No paid service, no key, no laptop.** `clang` is a Termux package, so the
  checks run on the phone.

---

**The one sentence:** *use AI to be grilled, not to be told; use Git to remember
what you actually understood, not what you hoped you did.*
