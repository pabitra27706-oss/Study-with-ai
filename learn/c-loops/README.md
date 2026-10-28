# Loops in C

> **You write it in CodeC. You push it here. I judge it.**
> There is no model, no API key and no bot. I read the brief, decide, and write
> the verdict back into the repository.

---

## What this topic is

One idea: do a thing again until a condition stops being true.

C gives you three spellings of it — `for`, `while`, `do...while` — and they are
not equally good. This pack teaches the exact evaluation order of a `for` loop
(the part everyone gets wrong), how to choose between the three forms, how to
avoid off-by-one errors by deciding the range *before* you write the loop, and
how `scanf` and loops interact — the single most common source of "my program
skips my input" bugs.

## The teaching material

| | |
|---|---|
| **The explanation** | 10 sections, written out in full — not a teaser. The evaluation order of a `for` loop, the `scanf` trap, the four bugs to check for before you run anything. |
| **The videos** | 6 links, each with a *reason* it is on the list. Nothing here is "a good channel" — every link is for a specific thing. |
| **The references** | 2 text references for the parts the videos gloss over. |
| **The tasks** | 6 programs, 100 points, each with **hidden edge cases** — zero, one, the boundary, leading zeros. |
| **The rubric** | 4 written questions with the key ideas each answer must contain. |

## The rules

1. **Your code must explain itself.** Every loop header and every value that
   changes each iteration needs a comment saying **why** — never **what**.
   `// increment i` is worthless. `// i<=n not i<n: n itself is a factor` is
   the thing that still makes sense to you in six months.
2. **Four short answers.** Nothing else. The comments in your code carry the
   reasoning.
3. **You never see the hidden test cases.** That is the point of them.
4. **You do not get the finished program.** You get the correction. The next
   one is yours to write.

---

## The loop

### 1 · Write it in CodeC

Save the file. CodeC can put it anywhere — `~/codec-out/` or your Downloads
folder both work.

### 2 · Push it

CodeC commits straight to this repository, to:

```
learn/c-loops/solutions/t1.c
learn/c-loops/answers.json
```

That is the whole contract. Then:

```bash
git add -A
git commit -m "c-loops: t1"
git push
```

If CodeC cannot reach GitHub from the phone, `scripts/collect.sh` copies the
file in for you, compiles it, runs the test cases, checks the comments, commits
and pushes:

```bash
bash scripts/collect.sh c-loops t1
```

You can also just paste the code into this chat and I will do all of it.

### 3 · Ask me to judge it

> check c-loops

### 4 · I write it back

| File | What lands there |
|---|---|
| `notes.json` | Your three notes lines, in your voice, derived from what your submission actually showed |
| `review.md` | The written review: what is solid, fix this first, fix this next, the one section to re-read |
| `history.md` | A dated line per judgement — what you could do, and when |
| `../data/progress.json` | The verdict, and the machine facts beside it |

Then the site rebuilds and the scoreboard moves.

---

## The two scores

| | What it measures | Who sets it |
|---|---|---|
| **The verdict** | `correct` · `mostly-correct` · `incomplete` · `incorrect`, with a written review | Me, in this conversation |
| **The machine facts** | compiles · test cases · comment check · keyword coverage | `runner/evidence.mjs` |

The machine score is 70% tasks, 15% answers, 10% comments. It is a sensor, not
the verdict — it cannot tell a typo from a broken mental model. I can, because
I read the code and the answers too.

---

## The seeded example

`solutions/t1.c` currently holds a worked reference answer for **t1**, and
`answers.json` holds four sample answers, so the site has something real to
show on the first run.

Replace both with your own work. Then run:

```bash
bash scripts/collect.sh c-loops t1
```

and say **check c-loops**.

---

## The tasks

| Task | Title | Points | The comment has to explain |
|---|---|---|---|
| t1 | Print 1 to N | 10 | the loop starts at 1 and not at 0. |
| t2 | Factorial of N | 15 | the accumulator starts at 1 and not at 0, and why the boundary includes N. |
| t3 | Sum of digits | 15 | you take the remainder before dividing. |
| t4 | Reverse a number | 15 | the accumulator is `rev * 10 + digit` and not `rev + digit`. |
| t5 | FizzBuzz | 20 | you test divisibility by 15 (or check FizzBuzz first) instead of testing 3 and 5 independently. |
| t6 | Multiplication table | 25 | the counter runs 1..10 rather than 0..9. |

The full prompts, the visible test cases, the hints and the reference solutions
live in [`curriculum/topics/c-loops.json`](../../curriculum/topics/c-loops.json).
