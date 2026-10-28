# The learning system

> AI writes the topic. You attempt it. The compiler decides whether you got it.
> Nothing here asks you to feel like you are learning.

This is the machine behind the `/learn` route. It exists because of one
uncomfortable finding in the GitHub audit: **47 repositories, zero automated
tests, and a learning archive whose notes were one line long.**

A repository that cannot tell you whether you understood something is a
notebook, not a learning system.

---

## 1. What is in the box

| Path | What it is | Who writes it |
|---|---|---|
| `curriculum/topics/*.json` | The **topic pack**: explanation, curated videos, tasks, rubric | AI |
| `curriculum/reference/*/` | Worked solutions that show what a good answer looks like | AI |
| `learn/<topic>/solutions/*.c` | **Your code** | You |
| `learn/<topic>/notes.json` | Your three lines | You |
| `learn/<topic>/answers.json` | Your four short answers | You |
| `runner/grade.mjs` | Compiles, tests, scores, explains | — |
| `data/progress.json` | The score. Committed, so it survives and shows on the site | The grader |
| `scripts/grade-and-commit.sh` | The whole loop in one command | — |
| `scripts/learn-workflow.yml` | Optional CI that grades on every push | — |
| `scripts/export-to-portfolio.mjs` | Publishes your work into the Learning Archive | — |

---

## 2. The two rules

Everything else in this document is mechanics. These two rules are the point.

### Rule 1 — your writing is minimal, your code is not

You write **three lines** of notes per topic:

```json
{
  "whatILearned": "for-loop = init; test; step. Product, not sum.",
  "challenges": "Used i=0 and got an off-by-one on the first term.",
  "nextSteps": "Rewrite t2 using a while-loop."
}
```

Maximum 220 characters each. If it needs more than a sentence, it is not
understood yet — and the grader tells you so.

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

`runner/lib/explain.mjs` checks this mechanically:

- every loop header and every value that changes each iteration needs a
  comment on it or on the line above;
- a comment that only restates the code is flagged;
- a comment with no causal marker (`because`, `so`, `not`, `instead of`, `must`,
  `to avoid`, `rather than`, …) is flagged.

It never tries to understand your program. It only asks whether you explained
the parts that are easy to get wrong. **Repeatable is what makes it a system.**

---

## 3. The loop, from a phone

```bash
# 1. read the topic:  https://pabitrahews06-oss.github.io/Study-with-ai/learn

# 2. write your attempt
mkdir -p learn/c-loops/solutions
nano learn/c-loops/solutions/t1.c
nano learn/c-loops/notes.json
nano learn/c-loops/answers.json

# 3. grade — compiles your C, runs the hidden tests, writes the score
node runner/grade.mjs

# 4. ship
bash scripts/grade-and-commit.sh
```

**Setup on Termux, once:**

```bash
pkg install nodejs clang
```

No API key, no cost, no network. The grader is local.

---

## 4. How the score is built

A topic score is four parts:

| Part | Weight | What it measures |
|---|---|---|
| **tasks** | 70% | Do the programs actually work? |
| **written** | 15% | Do the four answers contain the key ideas? |
| **notes** | 5% | Are all three lines written, and short enough? |
| **explain** | 10% | Does the code argue for itself? |

### Tasks (70%)

Each task compiles with `gcc -std=c17 -Wall -Wextra` and runs against test
cases. You see one public example per task; the grader also runs the hidden
edge cases — zero, one, leading zeros, the boundary. A program that only works
on the example does not pass.

A task earns partial credit per test, so a partially-correct program shows a
gradient rather than a cliff.

### Written answers (15%)

Each rubric question has key ideas attached. The scorer counts how many your
answer contains. It is deliberately dumb — keyword coverage, not judgement.
A dumb scorer is honest: it cannot be fooled by a confident paragraph that
says nothing, and it never silently rewards a lucky phrase.

### Notes (5%)

Three fields filled, each under 220 characters. Over the limit costs points.

### Explainability (10%)

The checker described in rule 2.

### Status

| Status | Meaning |
|---|---|
| `not-started` | No submission yet |
| `learning` | Something submitted, not finished |
| `done` | ≥70% and every task passed |
| `mastered` | ≥90%, every task passed, all tasks submitted |

---

## 5. Adding a topic

A topic pack is one JSON file. The agent writes the teaching half; you write
the doing half.

```bash
cp curriculum/topics/c-loops.json curriculum/topics/c-pointers.json
```

Then edit it:

1. `topic` — id, title, language, category, difficulty, tags, description.
2. `curriculum.explanation` — an array of `{h, md}` sections. **Write the whole
   thing.** The order people get wrong, the bugs that cost marks, the idiomatic
   choice. Not a teaser and not a summary.
3. `curriculum.videos` — **each one needs a `why`.** A link without a reason is
   a list; a link with a reason is a curriculum. Prefer specific videos over
   channels. Say what each one is *for*.
4. `curriculum.references` — text references for the parts videos gloss over.
5. `curriculum.tasks` — prompt, starter code, `tests` (mark the ones the learner
   may see with `"public": true`), `explainTarget`, `hints`.
6. `curriculum.rubric.written` — questions with `keywords` for scoring.
7. `curriculum.rules` — `writingMaxChars`, `commentPolicy`, `notePolicy`.

Then register it in `curriculum/index.json` and create `learn/<id>/` with empty
`notes.json` and `answers.json`.

**The `explainTarget` field is the one people skip.** It states, in one line,
what your comment for that task has to explain. It is the difference between
"write a factorial" and "write a factorial and say why the accumulator starts
at 1".

---

## 6. The AI review (optional)

The deterministic grader is the judge. The AI review is the extra pair of eyes.

Set a **free-tier Gemini key** at <https://aistudio.google.com/apikey>, then:

```bash
export GEMINI_API_KEY=...
node runner/grade.mjs
```

The review reads your three lines, your four answers and the task results, and
returns exactly four things: what is solid, what to fix first, what to fix
next, and the one section to re-read.

It is **strictly optional** — without a key, nothing else changes.

To make it automatic, add `GEMINI_API_KEY` as a repository secret and install
the workflow (section 7).

---

## 7. Installing the CI grader

The grader works locally, which is the point. But if you would rather never
think about it, install the workflow:

```bash
cp scripts/learn-workflow.yml .github/workflows/learn.yml
git add .github/workflows/learn.yml
git commit -m "Add the learning grader workflow"
git push
```

After that, every push that touches `learn/` is graded automatically and the
score is committed back. `gh run watch` shows it happening.

---

## 8. Publishing into the Learning Archive

Your archive lives at `pabitrahews06-oss/portfolio` — 68 topics, 82 files, and
the only place people can read your code, preview it, and download it.

```bash
git clone https://github.com/pabitrahews06-oss/portfolio.git ../portfolio
node scripts/export-to-portfolio.mjs ../portfolio
cd ../portfolio && git status && git diff
git commit -am "Add loops in C from the AI curriculum" && git push
```

That writes:

- `data/topics/<lang>/<id>.json` in the archive's own schema, so the topic
  page, the code preview, the search and the ZIP download all work;
- `content/<lang>/<id>-<task>.c` — your actual code;
- `data/curriculum/<id>.json` — the full pack, so an agent can read the
  teaching material later;
- an updated `data/index.json`.

It writes and never pushes. Review the diff, then commit.

---

## 9. Commands

| Command | What it does |
|---|---|
| `node runner/grade.mjs` | Grade everything, write `data/progress.json` |
| `node runner/grade.mjs c-loops` | Grade one topic |
| `node runner/grade.mjs --json` | Machine-readable output |
| `node runner/grade.mjs --solutions DIR` | Grade a different solutions folder |
| `node runner/grade.mjs --no-ai` | Skip the AI review even if a key is set |
| `bash scripts/grade-and-commit.sh` | Grade, commit, push — the whole loop |
| `node scripts/export-to-portfolio.mjs ../portfolio` | Publish into the archive |
| `npm run preview` | Serve the built site locally |

---

## 10. Why it is built this way

- **The grader is local and free.** No API key, no quota, no network. It runs
  in Termux because `clang` is a Termux package. A system that needs a paid
  service is a system that stops.
- **The checks are mechanical, not clever.** Keyword coverage and comment
  shape. Clever graders fail in ways you cannot debug from a phone; mechanical
  ones fail in ways you can read.
- **The score is committed.** Git history becomes the record of what you could
  do on which day. That is a CV line with receipts.
- **The explanation is written once, in full.** Re-reading the same concept in
  six different videos is not revision, it is a tax. One written explanation
  plus one video for the part that will not stick is cheaper and better.
- **Your writing stays minimal on purpose.** Writing is expensive on a phone
  and it is not where the learning happens. The thinking goes into the code.

---

**The one sentence:** *use AI to be grilled, not to be told; use the compiler
to judge, not the feeling of progress.*
