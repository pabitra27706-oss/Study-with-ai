---
title: "The first closed-book test was worse than I expected"
date: 2026-10-24
tags: [assessment, "self-explanation"]
summary: "45 minutes, no AI, no notes — and I could not reproduce most of what I had 'learned' the week before."
mistakes: "I mistook the feeling of understanding for the ability to produce it."
---

## 01 — The question

I had spent six evenings reading about HTTP caching with the help of an AI
tutor, taking notes, writing summaries. It felt productive. So the Sunday test
was simple: explain how `Cache-Control: max-age` and `ETag` interact, from
memory, in writing, with no AI and no notes open.

## 02 — My attempt (before asking anything)

I could describe `max-age` — it is how long a response stays fresh, in
seconds. I could describe an `ETag` — a version identifier for a resource. And
then the question I actually needed to answer: what happens when a browser has
a fresh copy but the server's resource changed?

I wrote: "The browser sends the ETag, the server compares, and if it is
different the server sends the new content with a new ETag." And then I stopped,
because I did not know *what status code* came back, or whether the browser was
supposed to send the ETag at all in that request.

## 03 — Where I was wrong

Two things, and they are different in kind:

**First, a knowledge gap.** I did not know the answer. Fine — that is what the
test is for.

**Second, and worse: a process failure.** I had read the material *six times*
and had never once tried to recall it. Every session started by asking the AI
to explain something, which produces the *feeling* of a fresh, complete
understanding — but familiarity is not availability. Research on the testing
effect puts the retrieval-practice advantage around g ≈ 0.50–0.61, which is
large; and the transfer effect (being able to actually use it) is smaller at
d ≈ 0.40. I was collecting the first number and paying for it with the
second.

## 04 — What changes

From now on, the loop is: **read → close the tab → write what I remember →
then open the AI and check.** The AI's job moves to the end of the session
instead of the beginning. If I cannot write three sentences before the AI
speaks, I have not studied the thing yet.

I also started a `cards/` folder for the handful of facts that kept slipping
(Cache-Control directives, status codes, header semantics) — those go into
spaced repetition. Facts that need understanding go into prose notes; facts
that need recall go into cards. Mixing them was my other mistake.

Next week: same test, same rules. The number that matters is the second one,
not the first.
