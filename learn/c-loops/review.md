# Review — Loops in C

**incomplete** · **20%** · judged 2026-10-28 17:57 by Claude

**What is solid**

The mathematics is right, and that is the hard part. `5! = 120`, `0! = 1`, `10! = 3628800`, `20! = 2432902008176640000` — every value correct. `unsigned long long` covers 20! with room to spare, `%llu` matches it, so there is no format bug. It compiles clean under `-Wall -Wextra`. And you reject a negative input before calling the function — the task never asked for that, and it is the right instinct.

**Fix this first**

Your program prints three things the task did not ask for: a prompt, the words *Factorial of*, and the number N. The task says *print N!* — the answer, alone, on stdout. The test compares stdout exactly, so `Enter an integer: Factorial of 5 = 120` is not `120`. Two changes fix all four failures: drop the prompt line, and print only the number.

**Then this**

This is a loops topic, and this task's comment asks why an *accumulator* starts at 1 and why the *boundary* includes N. Recursion has neither, so the comment you were asked to write cannot exist in this program. Recursion deserves its own topic — but as written, this never practises the thing you are here to learn.

**One thing to re-read**

Section 3, *The four parts of a for loop — and the exact order they run*. Those four parts are exactly what the task's comment is about: the initialiser is where the accumulator starts at 1, the condition is where the boundary includes N. Write the loop header in English first, then explain those two parts.

**One number, honestly**

The score fell from 28% to 20% — not because your t2 got worse. The `t1.c` in your folder was the shipped example, byte-identical to the reference copy, and it was being counted as a task you had passed. You never wrote it, so I removed it. Your four written answers are still the shipped examples too.

## Misconceptions to unlearn

- A correct program is not the same as a correct submission — the task asked to print N!, and 'Factorial of 5 = 120' is not 120
- A prompt for a human belongs on stderr, not stdout — with stdin piped there is no human, only noise in the answer
- In a loops topic, recursion skips the thing being learned: the comment the task asks for can only exist if you wrote a loop

## Notes

- **What I learned** — My factorial maths is right — 5! is 120 and 0! is 1 — but I printed the answer wrongly.
- **What broke** — My program prints a prompt and a sentence instead of just the number, so it fails all four test cases.
- **What is next** — Print only the number, then rewrite it as a for loop and say why the accumulator starts at 1 and why the loop stops at N.
