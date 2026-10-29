# Data Structures in C: linked lists, stacks, queues

> **You write it in CodeC. You push it here. I judge it.**
> There is no model, no API key and no bot. I read the brief, decide, and write
> the verdict back into the repository.

---

## What this topic is

One idea in three costumes: **a structure that owns its own memory and decides
where the next thing goes.** In C that means a pointer inside a struct.

The topic builds that idea up from nothing — a node, a head pointer, the links
between them — and then shows that a **stack** and a **queue** are the same
trick with a different rule about which end you work at. It also covers the
two things C makes you do by hand that no other language makes you do at all:
`malloc` and `free`.

Before starting this topic, complete **`c-foundations`**. It covers the C syntax,
arrays, pointers, structs, and memory ownership that linked lists, stacks and
queues depend on. This topic is now the next step in that sequence.

## The teaching material

| | |
|---|---|
| **The explanation** | 14 sections, written out in full — not a teaser. Why pointers come first, the node, the head pointer, insert, delete, traverse, reverse, then stack and queue. |
| **The videos** | 16 links, each with a *reason* it is on the list **and its real numbers** — views, likes, length, channel, upload date, read off the watch page on the day they were checked. The lowest reach of any video here is 535,687 views. |
| **The references** | 4 text references, including the full 42-video course the individual lessons come from. |
| **The tasks** | 8 programs, 100 points, each with **hidden edge cases** — the empty list, the first node, the last node, the position past the end. |
| **The rubric** | 6 written questions with the key ideas each answer must contain. |

## The rules

1. **Your code must explain itself.** Every loop header and every value that
   changes each iteration needs a comment saying **why** — never **what**.
   `// increment i` is worthless. `// build the new link first, so breaking the
   old one does not lose the way forward` is the thing that still makes sense
   to you in six months.
2. **Six short answers.** Nothing else. The comments in your code carry the
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
learn/data-structures-c/solutions/t1.c
learn/data-structures-c/answers.json
```

That is the whole contract. Then:

```bash
git add -A
git commit -m "data-structures-c: t1"
git push
```

If CodeC cannot reach GitHub from the phone, `scripts/collect.sh` copies the
file in for you, compiles it, runs the test cases, checks the comments, commits
and pushes:

```bash
bash scripts/collect.sh data-structures-c t1
```

You can also just paste the code into this chat and I will do all of it.

### 3 · Ask me to judge it

> check data-structures-c

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

## Where the examples live

- **The worked reference solutions** are in
  [`curriculum/reference/data-structures-c/`](../../curriculum/reference/data-structures-c/) —
  one per task, with the why-comments this topic asks for. Read them *after*
  you have attempted the task, not before.
- **`answers.json`** is empty. Fill it in with your own words. Only then does
  the "answers" number on the scoreboard mean anything.
- **`solutions/`** is yours. Only what you write in there is scored.

Your own work, then:

```bash
bash scripts/collect.sh data-structures-c t1
```

and say **check data-structures-c**.

---

## The tasks

| Task | Title | Points | The comment has to explain |
|---|---|---|---|
| t1 | One list, one node per value | 10 | why you set the new node's next pointer to NULL before you link it in. |
| t2 | Push to the front | 12 | why the line that points at the old head comes before the line that moves the head. |
| t3 | Insert at a position | 13 | why you set the new node's next pointer before you change the link of the node before it. |
| t4 | Delete at a position | 13 | why deleting is two jobs, and what breaks if you only do one. |
| t5 | Reverse the list | 15 | why you save the next pointer before you overwrite it. |
| t6 | Sum of the values | 12 | why you use `long long` for the sum and not `int`. |
| t7 | A stack: push, pop, peek | 12 | why `top` starts at -1 and why push increments it before it writes. |
| t8 | A queue: fill it, then drain it | 13 | why the front and rear indices wrap back to zero instead of just counting up. |

The full prompts, the visible test cases, the hints and the hidden edge cases
live in
[`curriculum/topics/data-structures-c.json`](../../curriculum/topics/data-structures-c.json).
The worked reference solutions live in
[`curriculum/reference/data-structures-c/`](../../curriculum/reference/data-structures-c/).

---

## Two things that will save you an hour

**Print one value per line.** Every test case in this topic expects exactly
that, and it means a stray trailing space can never cost you a point.

**Every `malloc` gets a matching `free`.** C has no garbage collector. Every
byte you ask for, you give back by hand — and the checker will look for it.
