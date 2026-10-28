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
    │  save it, commit, push
    ▼
  GitHub                         learn/<topic>/solutions/t1.c
    │
    │  you say: "check data-structures-c"
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
| `scripts/collect.sh` | The fallback bridge, for when CodeC cannot push: copy in, check, commit, push | — |
| `scripts/check.sh` | Prints the brief | — |
| `scripts/build-archive.mjs` | Regenerates the Learning Archive from the engine — runs on every build | — |
| `scripts/publish-archive.sh` | One command: regenerate the archive, commit it, push it | — |

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

### Write it in CodeC, then push it:

```bash
git add -A
git commit -m "data-structures-c: t1"
git push
```

CodeC commits to `learn/data-structures-c/solutions/t1.c` — that is the whole contract.
(`scripts/collect.sh` does the copying for you if CodeC cannot reach GitHub
from the phone; see §5.)

You can also just paste the code into this conversation and I will write the
file, check it and push it for you.

### Then say:

> check data-structures-c

### What I do:

1. `node runner/brief.mjs data-structures-c` — read the topic, the task, your code, the
   machine facts and your answers.
2. Write `learn/data-structures-c/verdict.json` — the verdict, the score, the three notes
   lines, the misconceptions and the written review.
3. `node runner/apply-verdict.mjs data-structures-c` — everything lands in the repository.
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

CodeC is your editor and it already talks to GitHub. So the file goes straight
from CodeC into this repository — **no copy step, no script, no moving files
around on the phone.**

### The path

CodeC commits to:

```
learn/<topic>/solutions/<task>.c
learn/<topic>/answers.json
```

That is all. Two paths, in the `learn/<topic>/` folder of this repository, on
the branch we share.

### The loop

```bash
# in CodeC: edit learn/data-structures-c/solutions/t1.c, save
# then, from Termux (or CodeC's own git panel):
git add -A
git commit -m "data-structures-c: t1"
git push
```

Then say **check data-structures-c**. I pull, read the brief, judge, write the verdict
and push it back on the same branch.

### The fallback

If CodeC cannot reach a repo from the phone, `scripts/collect.sh` does the
copying for you:

```bash
bash scripts/collect.sh data-structures-c t1
```

It searches `~/codec-out/`, `~/storage/downloads/`, `$EXTERNAL_STORAGE/Download/`
and `/sdcard/Download/`, takes the newest file matching the task id, copies it
into `learn/<topic>/solutions/<task>.c`, compiles it, runs the test cases, checks
the comments, commits and pushes.

```bash
bash scripts/collect.sh data-structures-c t1 /storage/emulated/0/Download/t1.c
```

### Either way the rule is the same

**You decide when the work is ready to be judged.** Nothing runs on a schedule,
nothing posts to your repository behind your back, and no other AI is involved.

> The CodeC repository URL could not be confirmed from the build sandbox
> (`git clone https://github.com/pabi277/CodeC.git` returns *Repository not
> found* — the account or the repo name is different). Nothing above depends on
> it: CodeC needs this repository, not the other way round. Send me the real
> URL and I will wire the docs to it.

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
half. **The full sequence, with the commands, is in
[`runbook/NEW-TOPIC.md`](runbook/NEW-TOPIC.md).** This is the short version.

1. `topic` — id, title, language, category, difficulty, tags, description.
2. `curriculum.explanation` — an array of `{h, md}` sections. **Write the whole
   thing.** The order people get wrong, the bugs that cost marks, the idiomatic
   choice. Not a teaser and not a summary.
3. `curriculum.videos` — **each one needs a `why` and its measured numbers.**
   A link without a reason is a list; a link with a reason is a curriculum.
   Prefer specific videos over channels. Say what each one is *for*.
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

### The video rule

Every video carries its **real** numbers:

```json
{ "title": "…", "url": "…", "channel": "mycodeschool",
  "length": "17:13", "views": 1738697, "likes": 19798,
  "published": "2013-03-28", "measuredOn": "2026-10-29",
  "why": "…", "order": 4 }
```

They are read off the watch page on the day they are checked — never estimated,
never copied from a search snippet. The floor is **100,000 views**, and
`scripts/check-topic.mjs` enforces it. This rule exists because the first pack
shipped a video with **327 views and 12 likes**, and nothing noticed.

Two things to check before you pick one, because both are invisible in the
title:

- **the language it is taught in** — an English-only learner cannot use a
  Hindi course, however many views it has;
- **the language of the code** — a 886,367-view "learn linked lists in 13
  minutes" video is written in **Java**.

### The two commands

```bash
node scripts/new-topic.mjs <id> "<title>"    # scaffold: pack, folders, index
node scripts/check-topic.mjs <id> --deep    # validate: the gate
```

`--deep` compiles every reference solution, runs it against its own tests and
scores its comments. It fails the pack if a video is under the floor, if a
task has no hidden test, if the points do not add up to 100, if a reference
solution is missing or does not compile, or if a task has no `explainTarget`.

---

## 8. Publishing into the Learning Archive

The Learning Archive — every topic, the code that came out of it, the notes
and the verdict — used to be a **second repository** with a **second site**.
Publishing into it meant remembering four folders and running a copier by
hand, on a phone. That is exactly the kind of thing that quietly stops
happening.

It is now a **view of the engine**, in this repository:

```
you finish a task -> I judge it -> verdict.json
   -> apply-verdict writes notes, review, history, progress
   -> build-archive regenerates archive/data + archive/content
   -> the site build renders /archive from it
```

There is nothing for you to do. The archive cannot fall behind the work,
because it is generated from the work.

```bash
node scripts/build-archive.mjs            # regenerate
node scripts/build-archive.mjs --check    # fail if it is out of date
bash scripts/publish-archive.sh           # regenerate, commit and push
```

**What a generated entry carries:** the code you actually wrote, the verdict
and its score, the machine facts, your three notes lines, the
misconceptions, and the written review. The hand-written entries — the 68
topics catalogued by hand between January and August 2026 — are never
overwritten.

The archive's own folder documents the schema: [`archive/README.md`](archive/README.md).

### The archive is also an input

The archive is not only what the engine writes out. It is also a place you
can write code into, and the generator will find it.

Drop a file into `archive/content/<language>/` and the next build will:

- work out which topic it belongs to from the header the file carries
  (`Topic`, `Created`, `Purpose`), or give it a topic of its own;
- copy it into the catalogue with a date, a description and a download;
- **never overwrite it again.** An adopted topic is written once and then it
  is a hand-written entry, so the notes, the verdict and the score written
  into it afterwards survive every build.

Five files were sitting in the archive this way, from before the engine
existed, and not one of them was in the catalogue: `functions.py`,
`lists.py`, `arrays.js`, `dom-manipulation.js` and
`ticket-price-calculator.c`. They are topics now, with verdicts.

**And then I judge it.** A file in the archive has no task sheet, so it is
graded on the archive's own rubric — does it run (40), is it right (30),
does it explain itself (30) — and the review says which rubric it used. The
rules are in [`runbook/JUDGING.md`](runbook/JUDGING.md).

**And nothing waits in silence.** A file that has code but no verdict is
listed in `archive/data/archive-pending.json` — newest work first, the older
backlog after it. The page says *waiting to be judged* instead of showing
nothing, `scripts/check.sh` prints the queue before the brief, and the brief
itself knows how to read an archive file:

```bash
node runner/brief.mjs --pending                          # the queue
node runner/brief.mjs --archive archive/content/c/foo.c  # one file
node runner/brief.mjs c-foo                             # by topic id
```

---

## 9. Commands

| Command | What it does |
|---|---|
| `bash scripts/collect.sh data-structures-c t1` | The CodeC bridge: copy in, check, commit, push |
| `bash scripts/check.sh data-structures-c` | Print the queue, then the judging brief |
| `node runner/brief.mjs data-structures-c --task t1` | One task only |
| `node runner/brief.mjs --pending` | The archive work that has no verdict yet |
| `node runner/brief.mjs --archive archive/content/c/foo.c` | The brief for a file with no task sheet |
| `node runner/evidence.mjs` | Compile, test and score the comments; write `data/evidence.json` |
| `node runner/apply-verdict.mjs data-structures-c` | Apply `verdict.json` to the repository |
| `node scripts/build-archive.mjs` | Regenerate the Learning Archive from the engine |
| `bash scripts/publish-archive.sh` | Regenerate the archive, commit it and push it |
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
