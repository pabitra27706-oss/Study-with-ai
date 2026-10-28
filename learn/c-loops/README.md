# Loops in C — your workspace

Read the topic first: **https://pabitrahews06-oss.github.io/Study-with-ai/learn/c-loops**

Then do this, in this order. Nothing here needs a laptop, an API key or a network.

## 1. The three files you create

```bash
cd ~/Study-with-ai
mkdir -p learn/c-loops/solutions

nano learn/c-loops/solutions/t1.c    # your code for task 1
nano learn/c-loops/solutions/t2.c    # task 2 ... and so on up to t6
nano learn/c-loops/notes.json        # three lines
nano learn/c-loops/answers.json      # four short answers
```

`notes.json` and `answers.json` already exist as empty templates. Fill them in.

## 2. The three lines (`notes.json`)

One sentence each. 220 characters maximum. The code carries the explanation, so
these can be short.

```json
{
  "whatILearned": "for-loop = init; test; step. Product, not sum.",
  "challenges": "Used i=0 and got an off-by-one on the first term.",
  "nextSteps": "Rewrite t2 using a while-loop."
}
```

## 3. The rule for your comments

Every loop header and every value that changes each iteration needs a comment
**on it or on the line above it** — and the comment has to say *why*.

```c
/* ✗ restates the code */
multi = i * multi;

/* ✓ states the reason */
multi = i * multi;   // multiply, not add: factorial is a product of 1..n
```

The grader flags comments that only repeat what the code says. It never tries
to understand your program — it only checks whether you explained the parts
that are easy to get wrong.

## 4. Grade it

```bash
node runner/grade.mjs
```

You get a table: which tasks passed, which failed, the exact expected-vs-got
output for each failing case, any compile error, every comment it did not like,
and which rubric answers are missing a key idea.

The hidden edge cases run too — zero, one, leading zeros, the boundary. A
program that only works on the visible example does not pass.

## 5. Ship it

```bash
bash scripts/grade-and-commit.sh
```

That grades, commits and pushes. Pages rebuilds and your score updates on the
site.

## 6. If you get stuck

- The topic page has **hints** under every task, and the starter code.
- Each task says, in one line, **what your comment must explain**.
- Watch one video from the topic page. Each link says why it is on the list.
- Still stuck? **Ask the AI — but paste your attempt first.** A pasted answer
  is an illusion of competence; a critique of your attempt is a lesson.

## 7. Look at a good answer

`curriculum/reference/c-loops/` holds a worked solution for every task, with
the comments written the way the grader wants them. **Look only after you have
attempted it yourself.** Looking first is how you end up able to recognise code
but not write it.
