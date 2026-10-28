# Review — Loops in C

**incomplete** · **28%** · judged 2026-10-28 17:23 by Claude

**What is here right now**

`solutions/t1.c` currently holds the seeded reference answer for t1 — the working example the topic ships with, not your work yet. It is correct, and the comments are exactly the kind this topic is asking for: `for (int i = 1; i <= n; i++)` carries the reason it is `<=` and not `<`, *n itself is a factor of n!*. That sentence is the difference between code you copied and code you own.

**Fix this first**

Five of the six tasks are unwritten, and that is the whole of the gap. Do not spend another minute polishing t1 — it already passes every test, public and hidden. The next hour is better spent on t2, factorial, because it is the loop you already have plus one new idea: an accumulator that starts at 1 rather than 0.

**Then this**

The four written answers are correct, but they are written to be marked rather than to be understood. *"Because initialising it inside the body resets it every iteration"* is the right reason; the next version would say what that reset **costs** — the previous total is thrown away and only the last iteration survives.

**One thing to re-read**

Section 5, *Off-by-one: decide the range before you write the loop*. You already applied it in t1. It is the section that will cost you marks in t6 (the multiplication table, where the counter must run 1..10 and not 0..9) and in t4 (reverse a number, where the loop must stop when the number reaches 0) if you skip it.

**How this gets better**

Replace `solutions/t1.c` with your own version in CodeC, then `bash scripts/collect.sh c-loops t1`, then say **check c-loops** and I will read it, judge it and write the verdict back. The score below is the seeded example's, not yours.


## Notes

- **What I learned** — I can write a for-loop that gets the boundary right, and say why in the comment.
- **What broke** — Only one of the six tasks is written — the other five are still blank.
- **What is next** — Do t2 (factorial) next: it is the same loop, but with an accumulator that starts at 1.
