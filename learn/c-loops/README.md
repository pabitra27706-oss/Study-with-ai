# Loops in C — your workspace

Read the topic first: **https://pabitrahews06-oss.github.io/Study-with-ai/learn/c-loops**

> **Seeded example.** `solutions/t1.c`, `answers.json`, `notes.json`,
> `review.md` and `history.md` in this folder are one attempt that has already
> been judged, so you can see exactly what the agent writes back. **Overwrite
> them with your own** — the agent notices the change and re-judges.

## Submit from anywhere

You do not need this repository, this machine, or even a terminal. Write the
code wherever you like and deliver it one of two ways.

### A. Push it

```bash
cd ~/Study-with-ai
nano learn/c-loops/solutions/t1.c     # your code
nano learn/c-loops/answers.json       # your four short answers
git add -A && git commit -m "c-loops: t1" && git push
```

### B. Open an issue and paste it

This is the path for when you wrote the code somewhere else — a notes app, a
different machine, a browser.

```bash
gh issue create --title "[c-loops] t1" --label "topic:c-loops" --body "$(cat <<'EOF'
# Topic: c-loops
# Task: t1

```c
// your code
```

# Answers
q1: your answer
q2: your answer
q3: your answer
q4: your answer
EOF
)"
```

The agent reads the issue, stages the code, judges it, posts the review back as
a comment, and writes the notes into the repository.

## What the agent does with it

1. **Sense** — compiles your C, runs the hidden test cases, checks that your
   comments say *why*, measures which key ideas your answers contain.
2. **Judge** — reads the topic, your code, your answers and that evidence, and
   decides what it means. Correctness alone is not enough: a program that
   passes every test and a wrong mental model in the answers look identical to
   a test runner and completely different to a teacher.
3. **Note** — writes your three notes lines, in your voice, from what your
   submission actually shows.
4. **Keep** — writes `notes.json`, `review.md` and a dated line in
   `history.md` back into the repository, refreshes the topic, and updates
   `data/progress.json`. The site picks it up on the next build.

## Your two jobs

### 1. Answer four questions

One short answer each. The agent reads the *meaning*, not just keywords.

### 2. Comment with why, never what

Every loop header and every value that changes each iteration needs a comment
**on it or on the line above it** — and it has to say why.

```c
/* ✗ restates the code */
multi = i * multi;

/* ✓ states the reason */
multi = i * multi;   // multiply, not add: factorial is a product of 1..n
```

## If you get stuck

- The topic page has **hints** under every task, and the starter code.
- Each task says, in one line, **what your comment must explain**.
- Watch one video from the topic page. Each link says why it is on the list.
- Still stuck? **Ask the AI — but paste your attempt first.** A pasted answer
  is an illusion of competence; a critique of your attempt is a lesson.

## Look at a good answer

`curriculum/reference/c-loops/` holds a worked solution for every task, with
the comments written the way the agent wants them. **Look only after you have
attempted it yourself.** Looking first is how you end up able to recognise code
but not write it.
