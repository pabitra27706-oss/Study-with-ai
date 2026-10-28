# Review — Loops in C

**mostly-correct** · **45%** · judged 2026-10-28 18:09 by Claude

**What is solid**

Your program computes every case correctly: `5! = 120`, `0! = 1`, `1! = 1`, `10! = 3628800`, `20! = 2432902008176640000`. All four test cases pass. `unsigned long long` holds 20! comfortably, `%llu` matches it, `0!` is handled, and you reject a negative input before calling the function — the task never asked for that. It compiles clean under `-Wall -Wextra`.

**And I was wrong to fail you on the output.** The sensor compared byte for byte, which is stricter than the task deserves — `Factorial of 5 = 120` *contains* `120`. That is fixed: the sensor now checks the right value is *there*, and hands the extra text to me to read instead of failing you for it.

**Fix this first**

Nothing on correctness. What is missing is the thing the task asked for. This is a **loops** topic, and t2's comment asks why an *accumulator* starts at 1 and why the *boundary* includes N. Recursion has neither, so the comment you were asked to write cannot exist in your program. You solved the arithmetic; the exercise is about the loop.

**Then this**

Your three comments all state what, not why: *Recursive function declaration*, *Base case: 0! = 1*, *Recursive case*. The last two are where the reasoning lives. The base case is the interesting one — the recursion has to stop somewhere, and `0! = 1` is what makes the whole product come out right. That is a why worth writing down.

**One thing to re-read**

Section 3, *The four parts of a for loop — and the exact order they run*. The initialiser is where the accumulator starts at 1; the condition is where the boundary includes N. Write the loop header in English first, then explain those two parts.

## Misconceptions to unlearn

- Recursive is not a substitute for a loop here — the comment the task asks for only exists if you wrote a loop
- A comment that names the line is not a comment: 'Recursive case' explains nothing
- The base case is where the reasoning lives — the recursion must stop somewhere, and 0! = 1 is what makes the product right

## Notes

- **What I learned** — My factorial works for every case — 5! is 120, 0! is 1 — and it handles a negative input.
- **What broke** — I solved it with recursion instead of a loop, so the comment about the accumulator cannot exist, and none of my comments say why.
- **What is next** — Rewrite t2 as a for loop, say why the accumulator starts at 1 and why the loop stops at N, then write my own four answers.
