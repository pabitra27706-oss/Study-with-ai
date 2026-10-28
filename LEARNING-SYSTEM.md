# The learning system

> **The AI judges. The compiler only reports.** The agent reads your code, your
> answers and the machine evidence, decides what it means, and writes its notes
> back into the repository.

This is the machine behind the `/learn` route. It exists because of one
uncomfortable finding in the GitHub audit: **47 repositories, zero automated
tests, and a learning archive whose notes were one line long.**

A repository that cannot tell you whether you understood something is a
notebook, not a learning system.

---

## 1. The shape of it

```
   you write the code anywhere
              │
              ├── push it to learn/<topic>/solutions/
              └── or paste it into a GitHub issue
                          │
                          ▼
              ┌───────────────────────────┐
              │  1. SENSE  (the compiler) │   compiles · runs the hidden tests
              │     machine evidence      │   checks the comments · measures the answers
              └─────────────┬─────────────┘
                            │  data/evidence.json
                            ▼
              ┌───────────────────────────┐
              │  2. JUDGE  (the AI)       │   reads the topic + your code + your
              │     the verdict            │   answers + the evidence
              └─────────────┬─────────────┘
                            │  verdict · score · review · notes
                            ▼
              ┌───────────────────────────┐
              │  3. NOTE + KEEP            │   writes learn/<topic>/notes.json
              │     the agent keeps the    │   learn/<topic>/review.md
              │     repository current     │   learn/<topic>/history.md
              │                           │   curriculum/topics/<id>.json
              │                           │   data/progress.json
              └─────────────┬─────────────┘
                            ▼
                     commit → Pages rebuilds → the scoreboard moves
```

**Why the compiler is not the judge.** A test runner can tell you that a
program failed on `n = 0`. It cannot tell you whether you understand why.
Those two cases look identical to `gcc` and completely different to a teacher:
one is a typo, the other is a broken mental model. The AI sees both the machine
evidence *and* your comments *and* your written answers, and it says which one
this is.

**Why the notes are the AI's.** Your three lines should describe what your
submission actually demonstrated — not what you intended. If you write them
yourself, they drift towards what you hoped happened. The agent derives them
from what actually ran.

---

## 2. What is in the box

| Path | What it is | Who writes it |
|---|---|---|
| `curriculum/topics/*.json` | The **topic pack**: explanation, curated videos, tasks, rubric | AI |
| `curriculum/reference/*/` | Worked solutions showing what a good answer looks like | AI |
| `learn/<topic>/solutions/*.c` | **Your code** | You |
| `learn/<topic>/answers.json` | **Your four short answers** | You |
| `learn/<topic>/notes.json` | **The notes the agent wrote about your work** | Agent |
| `learn/<topic>/review.md` | **The written review** | Agent |
| `learn/<topic>/history.md` | Every judgement, dated | Agent |
| `runner/agent.mjs` | The judge, the note-taker, the keeper | — |
| `runner/evidence.mjs` | The sensor: compile, test, comment check | — |
| `runner/lib/judge.mjs` | The prompt and the verdict parsing | — |
| `runner/lib/providers/` | `gemini.mjs` (real) · `mock.mjs` (offline fallback) | — |
| `data/evidence.json` | The machine facts | Agent |
| `data/progress.json` | The verdict. Committed, so it survives and shows on the site | Agent |
| `scripts/review-and-commit.sh` | The whole loop in one command | — |
| `scripts/learn-workflow.yml` | CI that judges on every push and every issue | — |
| `scripts/export-to-portfolio.mjs` | Publishes your work into the Learning Archive | — |

---

## 3. The two rules

Everything else in this document is mechanics. These two are the point.

### Rule 1 — your writing is minimal, your code is not

You write **four short answers** and that is all. The three notes lines are the
agent's job.

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

## 4. Submitting from anywhere

You do not need this repository, this machine, or a terminal.

### Push it

```bash
nano learn/c-loops/solutions/t1.c
nano learn/c-loops/answers.json
git add -A && git commit -m "c-loops: t1" && git push
```

### Or open an issue and paste it

```bash
gh issue create --title "[c-loops] t1" --label "topic:c-loops" --body "$(cat <<'EOF'
# Topic: c-loops
# Task: t1

```c
// your code
```

# Answers
q1: your answer
EOF
)"
```

The agent reads the issue, stages the code into `learn/<topic>/solutions/`,
merges the answers, judges, posts the review back as a comment, and writes the
notes into the repository.

This is the path for work done in a notes app, on another machine, or in a
browser — and it is the reason the agent exists rather than a local script.

---

## 5. What the agent writes back

| File | Contents |
|---|---|
| `learn/<topic>/notes.json` | The three notes lines, in your voice, derived from what your submission showed |
| `learn/<topic>/review.md` | The written review: what is solid, what to fix first, what to fix next, the one section to re-read |
| `learn/<topic>/history.md` | One dated line per judgement — the record of what you could do on which day |
| `curriculum/topics/<id>.json` | The topic's `learningNotes` are refreshed with the same notes |
| `data/progress.json` | The verdict, the score and the review |
| `data/evidence.json` | The machine facts, for anyone who wants to check the agent's reasoning |

The notes are capped at 220 characters and forced onto one line. A note that
needs a bullet list is a note that is not understood yet.

---

## 6. The AI key (optional but recommended)

The agent runs without a key — it falls back to the machine-only evaluation and
says so in the review. But the difference is the whole point: without a key it
tells you *what* happened; with a key it tells you *why*.

Get a free Gemini key at <https://aistudio.google.com/apikey>, then:

```bash
export GEMINI_API_KEY=...
node runner/agent.mjs
```

Or add it as a repository secret named `GEMINI_API_KEY` and install the
workflow (section 7) and it runs unattended.

The prompt asks for JSON:

```json
{
  "verdict": "correct | mostly-correct | incomplete | incorrect",
  "score": 0,
  "whatILearned": "one sentence, first person",
  "challenges": "one sentence, first person",
  "nextSteps": "one sentence, first person",
  "misconceptions": ["..."],
  "review": "150-300 words of markdown"
}
```

And it is told, explicitly: *never hand over the full solution as a fix; give
the correction, not the finished program.* You have to write the next one.

---

## 7. Installing the CI agent

```bash
cp scripts/learn-workflow.yml .github/workflows/learn.yml
git add .github/workflows/learn.yml
git commit -m "Add the learning agent workflow"
git push
```

After that:

- every push that touches `learn/` is judged and the notes are committed back;
- every issue opened or edited is staged, judged, and the review is posted as
  a comment;
- `gh run watch` shows it happening.

**The workflow will not loop.** The agent fingerprints each submission
(SHA-256 of the code and the answers) and skips anything it has already judged,
so its own commit does not trigger another judgement.

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
into `content/`, and refreshes `data/index.json` — including the agent's notes,
so the archive shows your latest judgement, not a one-line summary.

---

## 9. Commands

| Command | What it does |
|---|---|
| `node runner/agent.mjs` | Sense, judge, note, keep |
| `node runner/agent.mjs c-loops` | One topic |
| `node runner/agent.mjs --issue` | Judge a submission that arrived as an issue |
| `node runner/agent.mjs --force` | Re-judge even if the submission is unchanged |
| `node runner/agent.mjs --dry-run` | Print the prompt the judge would receive |
| `node runner/agent.mjs --provider mock` | Run without a key |
| `bash scripts/review-and-commit.sh` | Judge, commit, push — the whole loop |
| `node scripts/export-to-portfolio.mjs ../portfolio` | Publish into the archive |
| `npm run preview` | Serve the built site locally |

---

## 10. Why it is built this way

- **The AI judges, because only a judge can distinguish a typo from a broken
  mental model.** The compiler is kept, but demoted to a sensor.
- **The notes are the agent's, because they must describe what happened, not
  what you hoped happened.**
- **The grader is local and free.** `clang` is a Termux package, so the whole
  loop runs on the phone with no key and no network. A system that needs a paid
  service is a system that stops.
- **Everything comes back into the repository.** The agent writes its notes,
  its review and a dated history line, so the repo is the memory and the site
  is the scoreboard. Nothing lives in a chat window that is gone tomorrow.
- **The score is committed.** Git history becomes the record of what you could
  do on which day. That is a CV line with receipts.

---

**The one sentence:** *use AI to be grilled, not to be told; use Git to remember
what you actually understood, not what you hoped you did.*
