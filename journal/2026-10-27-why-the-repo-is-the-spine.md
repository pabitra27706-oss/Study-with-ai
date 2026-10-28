---
title: "Why the repository is the spine and the AI is only the tutor"
date: 2026-10-27
tags: [system-design, git, "metacognition"]
summary: "I had been treating the repo as an archive of notes. It is not an archive — it is the only place where my understanding is stored in a form I can audit."
mistakes: "I was using the AI to produce content instead of using it to test content I had produced."
---

## 01 — The question

I kept hitting the same wall: a chat window full of good explanations, and
nothing I could point to a month later. Notes lived in one app, code in
another, half-formed thoughts in the chat history itself. The AI was doing the
remembering for me, and AI conversations do not age well.

## 02 — My attempt

I asked the AI to design a better system for me. It produced a tidy diagram:
ingest → summarise → store → review. Clean. And I noticed immediately that it
had removed the only part that was actually mine — the attempt. The pipeline
had no place for me to be wrong, and being wrong is the part that produces the
learning.

## 03 — Where I was wrong

Two corrections, and they came from the evidence rather than from taste.

**The guarded-tutor result.** In a real course with GPT-4 assistance, students
who used the tutor freely improved their *practice* performance (about +48%)
but performed **17% worse unaided** on the exam. The harm disappeared when the
tutor was constrained — hints instead of answers, quizzes instead of lectures.
So the design constraint is not "AI tutor", it is "AI that cannot answer the
question for me".

**The effort trap.** Open-ended chatbot tutoring pushes people into the
cheapest available action — accept the answer. A study of this found the
sequence Prime → Probe → Point → Attach → Strengthen → Test: the learner
generates the question, attempts it, gets the explanation, connects it,
consolidates it, and is finally tested. Each step is *more* work than the
last, which is exactly the point.

So the repository — not the chat — is the spine. A commit is a dated,
immutable record of what I understood at a specific moment. If I cannot
express it in a file, I did not understand it yet.

## 04 — What changes

Concrete rules now in `AGENTS.md`:

- The AI reads `raw/` and `notes/`; it **never** writes `journal/`. That
  folder is mine.
- Every session ends with a commit. Not a summary — a decision.
- The weekly test is closed-book and no-AI. It is the only score that counts.
- `raw/` is append-only. Notes are AI-compiled and I own them. Cards are
  curated by me — roughly a third of what the AI generates survives.

One more thing I am keeping: the AI is allowed to disagree with me and to
flag contradictions between my notes. A tutor that only agrees is a mirror,
and mirrors do not teach.

Next: write the actual `AGENTS.md` and make the loop runnable rather than
aspirational.
