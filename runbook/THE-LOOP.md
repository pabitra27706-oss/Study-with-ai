# The loop

**This is what to do when the user says "check <topic>"** — or when they push
code and mention it.

## The shape of it

```
CodeC (write code)  ->  push  ->  GitHub  ->  you say "check data-structures-c"
                                                     |
                                        runner/brief.mjs  ->  Claude judges
                                                     |
                                        verdict.json  ->  runner/apply-verdict.mjs
                                                     |
                                        notes · review · history · progress
                                                     |
                                        commit  ->  push  ->  site rebuilds
```

The user pushes. You never push their code for them unless they ask.

## Step 1 — get their work

```bash
git fetch origin
git pull --ff-only
```

If they pushed to a branch other than the one you are on, fetch it and read it
from there. Do not merge their branch into yours without asking.

Check what landed:

```bash
git log --oneline -5
git status --short
ls learn/<topic>/solutions/
```

## Step 2 — read the brief

```bash
node runner/brief.mjs <topic>
node runner/brief.mjs <topic> --task t2      # one task only
```

The brief contains: what was taught, what the task asked, what the comment had
to explain, their code, the compile result, the test results, the comment
flags, and their written answers with keyword coverage. It ends with the rules
you must apply.

**Do not judge without reading it.** Do not judge from the diff alone.

## Step 3 — check the facts yourself

```bash
node runner/evidence.mjs
```

This recompiles and re-runs the test cases and writes `data/evidence.json`. If
the brief and the evidence disagree, trust the evidence.

## Step 4 — judge

Read [`JUDGING.md`](JUDGING.md). The short version:

- The machine facts are a **sensor**. They say what happened, not what it means.
- A failing test can be a typo or a broken mental model. The comments and the
  answers tell you which — and that distinction is the entire value you add.
- Be specific: name the task, the line, the test case, the misconception.
- Never hand over the finished program. Give the correction.
- Do not invent problems. If the work is correct, say it is correct.

Write your judgement to `learn/<topic>/verdict.json`:

```json
{
  "verdict": "correct | mostly-correct | incomplete | incorrect",
  "score": 0,
  "by": "Claude",
  "whatILearned": "one sentence, first person, under 220 characters",
  "challenges": "one sentence, first person, under 220 characters",
  "nextSteps": "one sentence, first person, under 220 characters",
  "misconceptions": ["short phrase"],
  "review": "150-300 words of markdown"
}
```

## Step 5 — apply it

```bash
node runner/apply-verdict.mjs <topic>
```

That writes `notes.json`, `review.md`, one dated line in `history.md`, the
topic's `learningNotes`, and `data/progress.json`. It is idempotent: applying
the same verdict twice replaces the history line instead of stacking a
duplicate.

## Step 6 — ship it

```bash
git add -A
git commit -m "review: <topic> — <verdict>"
git push
```

Then tell the user what you found, in three short lines. The detail is in
`review.md`; their phone should not have to scroll through it.

## Step 7 — publish into the archive

**Automatic.** The archive is a view of the engine, so the same commit that
carries the verdict carries the archive entry.

```bash
node scripts/build-archive.mjs     # regenerate archive/data + archive/content
```

It writes the topic in the archive's own schema, copies the code into
`content/`, refreshes `data/index.json` with the notes, the verdict and the
score, and never touches a hand-written entry.

Commit that alongside the verdict — or run `bash scripts/publish-archive.sh`
to do the commit and the push for you.


## Adding a topic

The teaching half is one JSON file: `curriculum/topics/<id>.json`, registered
in `curriculum/index.json`. See section 7 of `LEARNING-SYSTEM.md` for the
shape. The doing half is the learner's.
