# The AI-Assisted Learning Journey — a research-backed design

**A design document for `Study-with-ai`.** No code here — this is the thinking, the evidence behind it, and the operating system I'd build with you.

*Research current as of 28 October 2026. Every empirical claim below is linked to its source.*

---

## 1. What you are actually proposing (restating your thoughts, so we can argue with them)

Read back, your message contains five separate ideas that are usually conflated. Separating them is the first useful thing we can do, because they have different evidence, different failure modes, and different designs.

**Idea 1 — "My current way of studying is inconvenient."**
You said studying through YouTube and other sources "is very inconvenient." That is a real diagnosis, and it's worth being precise about *why* it's inconvenient, because the cause determines the fix:

- **Scattered context.** 12 browser tabs, 3 playlists, a half-finished PDF, a notes app that doesn't sync. Nothing has a home.
- **No memory.** Every session starts from zero. The video you watched 3 weeks ago is gone, and so is the thing that confused you in it.
- **Passive.** Watching a 40-minute lecture feels like studying but is mostly *being shown something*. The uncomfortable, productive part — trying to recall, being wrong, retrying — is exactly the part YouTube lets you skip.
- **No feedback.** You can rewind but you can't be *told* you're wrong until the exam.

**Idea 2 — "Starting with AI is a modern update."**
You're right, and the research says something stronger than "modern": a well-designed AI tutor is now roughly as good as an active-learning classroom (median learning gains more than double the classroom group, in *less* time) [1](https://www.nature.com/articles/s41598-025-97652-6). A systematic review across 68 studies and 337 effect sizes found a moderate positive effect of SMD 0.45 [7](https://impactaieducation.substack.com/p/a-harvard-randomized-controlled-trial). This is the first time in history that a self-learner with a phone can access something approximating an elite one-on-one tutor, at zero marginal cost. That is a genuine structural change, not a fashion.

**Idea 3 — "If I have a problem, I can solve it directly with AI, and it's free."**
This is your strongest practical point, and the "free" part deserves a hard look: **free is true of the tool and false of the risk.** The AI is free; the *learning* it can destroy is not. There's an important body of evidence — detailed in §3 — that the same free tool, used in the same way, produces *worse* unaided exam performance. Cost isn't the risk here; cognitive offloading is.

**Idea 4 — "I'll connect a Git repo; that will be the full journey."**
This is the most original part of your thinking and, I think, the best instinct in the whole message. A Git repo is not a notes app. It gives you four things no note app does: a **timeline** (the ordered record of what you actually did), a **diff** (how your understanding changed between two dates), an **attribution boundary** (which words are yours and which are the machine's), and **portability** (plain text that outlives every tool, and that any AI agent can read as context). The commit history is the one artifact in your learning life that cannot be faked by an AI.

**Idea 5 — "It will be modern update and good for me."**
This is the goal statement, and it's where I want to push back gently. Modernity is not the outcome; *retention under unaided test conditions* is. Those two things diverge, and the divergence is where most self-learners get hurt.

---

## 2. Why your instinct is right — the case for AI tutoring

### 2.1 The strongest result: Harvard, 2025
Kestin, Miller, Klales, Milbourne & Ponti ran a **randomised crossover trial** with 194 undergraduates in Harvard's largest intro physics course. Every student learned the same content both ways: once with an in-class active-learning session (the best-evidenced classroom method there is, in a course the authors describe as already well taught), once at home with a purpose-built GPT-4 tutor whose prompts were informed by the same pedagogical principles.

| Measure | AI tutor (at home) | Active-learning class |
|---|---|---|
| Median post-test score | **4.5** | 3.5 |
| Median learning gain vs. shared pre-test baseline (2.75) | **>2× the class group** | — |
| Time on task | **49 min** | 60 min |
| "I felt engaged" | 4.1 | 3.6 |
| "I felt motivated" | 3.4 | 3.1 |

Difference in learning gains was statistically significant (Mann–Whitney z = −5.6, p < 10⁻⁸), with an effect size around 0.73–1.3 SD [1](https://www.nature.com/articles/s41598-025-97652-6). Two caveats the authors themselves stress: retention was measured immediately after each lesson, not weeks later, and one course at one university isn't a law of nature. But this is the clearest signal we have that *design*, not *novelty*, drives the outcome.

### 2.2 It replicates, across countries and subjects
- **LearnLM / Eedi UK trial (2025–26):** 165 students, 5 secondary schools, 7 weeks of maths. Tutors supervised the model's drafts, approving 76.4% with zero or minimal edits. AI-drafted Socratic tutoring matched human tutoring on every outcome, and beat it on transfer to a new topic by 5.5 percentage points [4](https://arxiv.org/html/2512.23633v1).
- **Tutor CoPilot (Stanford):** 700+ tutors, 1,000 students in underserved communities — students whose tutors used the AI assistant were 4 percentage points more likely to master a maths topic (p < 0.01), and the gain was *largest* for students of lower-rated tutors (+9 pp), at roughly $20/tutor/year [9](https://edworkingpapers.com/sites/default/files/ai24_1054_v2.pdf).
- **Meta-analysis:** 68 studies, 337 effect sizes, SMD 0.45 [7](https://impactaieducation.substack.com/p/a-harvard-randomized-controlled-trial).
- **Higher ed, 334 students:** AI tutor access raised test performance by 0.23 SD; and contrary to the "premature reliance" worry, *unrestricted* access beat restricted access by 0.21 SD [22](https://scale.stanford.edu/ai/repository/ai-tutoring-enhances-student-learning-without-crowding-out-reading-effort).

### 2.3 Why this matters *specifically* for a self-learner in India
The Harvard comparison is AI tutor **vs. a good classroom**. Your real comparison is AI tutor **vs. a mediocre classroom or no classroom** — a much bigger gap in your favour. Add the constraint that free AI access removes the two biggest historical blockers for self-learners (cost and access to a good teacher), and the arithmetic becomes genuinely attractive: you can now get a personalised, patient, never-bored tutor that adapts to your pace and never judges you for asking the "stupid" question. Students rated ChatGPT highest of all options on "allows me to learn at my own pace" (4.8/5) and "comfortable asking questions" (4.9/5) [33](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1528603/full).

---

## 3. Why the same setup can make you *worse* — the risk register

This section is the most important part of the document, because your plan is a bet on *how* you use the AI, not *whether* you use it.

### 3.1 The performance paradox
The clearest evidence: **Bastani et al., PNAS 2025** — a field experiment with nearly 1,000 Turkish high-school maths students, two AI tutors, same underlying GPT-4 model.

- **GPT Base** (an ordinary ChatGPT-style interface): +48% on practice problems *with* the tool.
- **GPT Tutor** (same model, rebuilt to withhold answers and give hints): +127% on practice.
- **On the subsequent exam without AI:** GPT Base students scored **17% WORSE than students who never had AI at all**. The guarded tutor erased that harm — but didn't produce a gain either [16](https://www.pnas.org/doi/10.1073/pnas.2422633122).

Same model. Same students. Same subject. Opposite outcomes, determined entirely by design. Wharton frames it precisely: *"if we use it sort of lazily and… completely trust the machine learning model, then that's when we could be in trouble"* [9](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education/).

### 3.2 Metacognitive laziness and the illusion of competence
Fan et al. (117 students, randomised, writing task) found that ChatGPT users improved their *essay score* but showed **no better knowledge gain or transfer**, and their self-regulated learning processes shifted toward the tool: less orientation, less monitoring, less evaluation. They call it **metacognitive laziness** — the learner abdicates planning, monitoring and revision, not just the typing [4](https://bera-journals.onlinelibrary.wiley.com/doi/10.1111/bjet.13544).

Compounding it: AI output is *fluent and confident*, and fluency is a misleading cue that tells your brain "no further cognitive effort required." The University of Toronto's cognitive-offloading literature calls this the **illusion of competence** — you mistake following a polished explanation for understanding it [8](https://www.uts.edu.au/news/2026/03/experts-warn-unstructured-ai-use-in-schools-risks-cognitive-atrophy/contentassets/ai-cognitive-offloading-and-implications-for-education.pdf).

### 3.3 The failure you are most likely to hit: the second monitor
A large RCT with **2,379 undergraduates across 30 instructors** found that giving students an AI tutor *reduced* final grades by 0.37 SD and **reduced learning-management-system participation by 0.90 SD**. The students didn't study more with the AI — they studied less, and more shallowly [15](https://brendanbartanen.substack.com/p/ai-tutoring-lowers-student-performance). The mechanism is mundane and deadly: an always-available tutor becomes a second screen, and reading that screen *feels* like studying, so the primary material goes unread.

### 3.4 The self-regulated request trap
A 12-week chess RCT (Poulidis, Bastani & Bastani) randomly assigned students either to a *system-regulated* condition (AI tips delivered automatically at key moments) or a *self-regulated* one (student can request help any time). Both improved, but the self-regulated group achieved **30% gains vs. 64%** for the system-regulated group — less than half. Mediation: over 50% of the loss was diminished *productive struggle* (asking for help when outside the Zone of Proximal Development), ~15% reduced engagement. Students who were *aware* of the harms still became increasingly reliant [9](https://ssrn.com/abstract=5604932).

Read that again, because it is the single most actionable finding for your system design: **you asking the AI for help at the moment you choose to is itself a hazard.** The AI has to be allowed to interrupt, quiz and withhold — not just respond.

### 3.5 The AI's output can simply be wrong
Anki community consensus worth taking seriously: AI-generated flashcards carry a nontrivial error rate (estimates from a few percent up to ~70% depending on prompt and model), and even when correct, the cards are often recognition-type, overloaded, or simply useless to memorise [1](https://www.reddit.com/r/Anki/comments/1mewr8p/problem_with_aigenerated_flashcards/). **Never memorise an AI fact you haven't verified against a primary source.** One clean countermeasure: use the AI to *draft* cards, then have it or another model *audit* the cards before they enter your deck.

### 3.6 The risk of "solving" the problem you were supposed to study
Your instinct — "if I have any problem, I can directly solve it by AI" — is precisely the behaviour the evidence flags as harmful. There is a clean, memorable diagnostic from the *Effortless Trap* paper:

> **If letting AI in makes the task feel effortless, it is in the wrong place.** [2](https://arxiv.org/pdf/2606.26181)

The same paper offers a six-move frame for where AI belongs in learning a new idea — **Prime, Probe, Point, Attach, Strengthen, Test** — and the rule: *secure the first hard attempt and the final unaided check; scaffold with guarded AI in between* [2](https://arxiv.org/pdf/2606.26181). I'll use this as the backbone of the system in §6.

### 3.7 Summary of the risk register
| Risk | Mechanism | Structural mitigation |
|---|---|---|
| Performance without learning | Answer-giving replaces effort | AI withholds answers; you attempt first |
| Metacognitive laziness | Convenience reduces self-regulation | AI quizzes/calibrates; you keep the plan |
| Second-monitor collapse | AI substitutes for primary material | Hard rule: watch → close → recall → check |
| Illusion of competence | Fluency misread as understanding | Weekly closed-book, no-AI recall test |
| Memory of false facts | Hallucinated cards | AI drafts + audits; you verify vs. source |
| Dependency on asking | Self-regulated help-seeking | System initiates quizzes; "stuck" is time-boxed |
| No retention | No spaced review | Anki/FSRS on every topic |

---

## 4. What the learning science says you should do (and what it says you should stop doing)

AI is the *delivery mechanism*. The *mechanism of learning* is what determines whether the delivery mechanism helps or harms. Dunlosky et al. (2013) reviewed ten common techniques and rated their utility [1](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf):

| Technique | Dunlosky rating | Effect size | Cases |
|---|---|---|---|
| Distributed practice (spacing) | **High** | d = 0.85 | 150 |
| Practice testing (active recall) | **High** | d = 0.74 | 374 |
| Self-explanation | Moderate | d = 0.54 | 93 |
| Elaborative interrogation ("why is this true?") | Moderate | — | — |
| Interleaved practice | Moderate | d = 0.47 | 104 |
| Summarisation | Low | d = 0.44 | 234 |
| Highlighting | Low | d = 0.44 | 56 |
| Rereading | Low | d = 0.47 | 113 |

Meta-analytic table from [16](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full).

**The uncomfortable part:** most of what people do when they "study from YouTube" — rewatch, highlight, summarise — is on the *low utility* list. So "study more with YouTube" is not the fix. "Study differently, with AI" is.

### 4.1 The testing effect (the single highest-value technique)
Roediger & Karpicke (2006) [17](https://colinallen.dnsalias.org/Readings/2006_Roediger_Karpicke_PsychSci.pdf): students read a prose passage once and recalled it three times, versus students who read it four times.

| Delay | Read 4× | Read once + recall 3× |
|---|---|---|
| 5 minutes | **83%** | 71% |
| 2 days | 54% | **68%** |
| 1 week | 40% | **61%** |

Rereading wins in the first five minutes — which is exactly why it feels right and gets chosen. Retrieval wins from day two onward, and it also *slows forgetting*: the repeated-studying group lost 52% of what it recalled over the week; the recalling group lost 14%.

Meta-analyses: Rowland (2014), 159 effect sizes → g ≈ 0.50 vs. restudying; Adesope et al. (2017), 272 effect sizes, 15,427 participants → g = 0.61 vs. any non-testing condition, and **g = 0.82 when the gap between practice and final test was 1–6 days** [5](https://www.strive-learning.com/blog/active-recall-vs-rereading). Classroom reality check (Yang et al., 2021): 222 studies, 48,478 students → g ≈ 0.50, i.e. real classrooms, not just labs [1](https://hiperformanceculture.com/learning/trend-active-recall/).

**Feedback roughly doubles it:** g = 0.73 *with* feedback vs. g = 0.39 without; and retrieval without feedback is useless when you're drawing mostly blanks (g = 0.03) [8](https://glasp.co/articles/active-recall). → *Never do a retrieval practice where you can't check your answer.*

### 4.2 Spacing beats cramming
Karpicke & Bauernschmidt (2011): three recalls crammed into one burst gave 25% retention; spreading those same three recalls across intervals gave ~80% [23](https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JML.pdf). Cramming isn't less efficient — it's *worse than spaced practice at equal time*.

### 4.3 Video vs. text: video is not the problem
- At MIT, students who watched a video lecture vs. read the transcript scored essentially the same (81.3% vs. 82.5%) [6](https://bastakiss.com/blog/reading-vs-watching-videos-a-comprehensive-analysis-of-learning-efficiency/). There's a modality effect in *engagement*, not in *learning*.
- The difference comes from **what you do with it**. The forward-testing effect shows that pausing a video for a short interim test produces better learning than watching continuously, and that test-takers also wrote more notes and reported less mind-wandering [21](https://www.nature.com/articles/s41539-018-0024-y).
- Print still edges out digital reading for deep comprehension (~1.6 points; 22% higher recall at 24h) because of cognitive mapping and lower distraction [6](https://bastakiss.com/blog/reading-vs-watching-videos-a-comprehensive-analysis-of-learning-efficiency/).

**Conclusion for your YouTube habit:** YouTube is a fine *acquisition* channel (explanations, worked examples, intuition-building) and a poor *consolidation* channel. The fix is not "stop watching YouTube." The fix is that **the video must end with you producing something from memory, unaided, before you open the AI.**

### 4.4 The pretesting effect — a free upgrade
A 2025 multilevel meta-analysis of 60+ years of prequestion research: **prequestions** (a few questions about the topic *before* you learn it) improved learning of that content by g = 0.66, with no general benefit for other content in the same lesson; combined with feedback, prequestions beat prequestions alone [10](https://studycardsai.com/blog/active-recall-statistics). This is the cheapest single upgrade to your routine: **before watching, write down three things you expect to learn.** It also creates the diagnostic that makes the retrieval step meaningful — you can measure the gap.

### 4.5 What the AI should add that a textbook can't
- **Unlimited, zero-judgement, 24/7 adaptive questioning** (the Socratic dialogue pattern): a pedagogical chatbot built to *avoid* giving explicit answers and instead pose open questions produced significant gains in critical thinking, with Socratic tutors beating basic and random tutors at p < 0.001 (critical-thinking score 0.670 vs 0.582 vs 0.312) [3](https://doi.org/10.3390/computers14070270).
- **Error diagnosis**: FindLM's UK trial had the model identify the *specific misconception* behind a student's wrong answer and ask the question that lets them self-correct [4](https://arxiv.org/html/2512.23633v1).
- **Calibration**: telling you that your confidence is miscalibrated relative to your actual performance — the thing human teachers rarely have time to do [8](https://drphilippahardman.substack.com/p/from-ai-tutors-to-ai-study-mates).

---

## 5. Why Git is the right spine for this journey

### 5.1 The pattern that fits your idea exactly
Andrej Karpathy's **LLM Wiki** pattern (published as a gist in April 2026) is, essentially, your instinct formalised [2](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f):

- **Raw sources** — immutable. Articles, papers, transcripts, your own raw notes. The AI reads but never edits. This is your source of truth.
- **The wiki** — interlinked Markdown the AI writes and maintains: summaries, concept pages, comparisons, contradictions it flags. You read it; it owns it.
- **The schema** — one file (AGENTS.md / CLAUDE.md) telling the agent how the wiki is structured and what workflows to follow. This is the agent's operating manual.
- Plus `index.md` (a catalog with one-line summaries) and `log.md` (an append-only history of ingests, queries and checks).

The three operations are **ingest** (read a new source, update the pages it touches — a single source can touch 10–15 pages), **query** (answer from the wiki; good answers get filed back as pages), and **lint** (find contradictions, stale claims, orphan pages, concepts mentioned without a page of their own).

### 5.2 Why this beats a notes app *specifically for learning*
| Property | What it gives a learner |
|---|---|
| **Immutable raw layer** | Your source of truth can't be silently rewritten by a hallucination |
| **Git history** | A dated timeline of what you studied — the "learning curve" you can actually look at |
| **`git diff`** | Shows how a concept page evolved as *your* understanding changed — the single best revision artefact there is |
| **`git blame`** | Shows which claims came from you vs. the machine — the attribution boundary |
| **Agent-readable** | Any AI agent can load the repo as context; you are not locked into one vendor |
| **Portability** | Plain Markdown; survives every tool, and is greppable forever |
| **Social proof** | Your repo is a portfolio of your reasoning, not a folder of AI slop |

### 5.3 The failure mode to avoid
There is a real risk of building a repo that is a *library of finished-looking notes*. Every public "AI knowledge base" I found during research has this shape: `raw/` → `wiki/` → index, with the AI writing everything. It looks impressive and it can be a trap — because **a wiki the AI wrote teaches you nothing.** The knowledge is in the file; it never passed through you.

The fix, used by the best implementations, is a **third human-owned layer** — sometimes called `garden/` — that the agent may only propose edits to, never write [9](https://benemson.com/blog/agents/karpathys-llm-wiki-six-weeks-in). Your design:

- **raw/** — sources you gathered (immutable)
- **wiki/** — the agent's compiled knowledge (agent-owned, you read it)
- **journal/** — *your* words: what you tried, what you got wrong, what confused you, what you'd do differently (you-owned, agent-read-only)

That third layer is the one that makes the repo a *learning* record rather than a *storage* record. It's also the thing no AI can produce for you, which is exactly why it's the thing worth keeping.

Real examples of this pattern in the wild: `learning-journal` repos with dated entries in plain Markdown [12](https://github.com/Hamza-Zain/learning-journal), and agent frameworks that turn "work with agents" into decision journals and debriefs with an explicit note that *"encountering a concept stays separate from demonstrating mastery"* [3](https://github.com/pariosur/work-to-knowledge).

### 5.4 The one thing git gives you that nothing else does
**A record of effort that cannot be faked.** If your commits show "tried, failed, revised, understood," you have evidence. If your commits show "AI generated 400 lines of notes," you have a very polished illusion. The repo makes the difference between *performance* and *learning* visible, which is the exact distinction the entire research literature keeps circling back to.

---

## 6. The operating system for the journey

### 6.1 The daily loop (~60 minutes)
Designed around the six-move frame (Prime → Probe → Point → Attach → Strengthen → Test) [2](https://arxiv.org/pdf/2606.26181):

1. **Prime (5 min).** Before opening anything: write 3 prequestions about what you're about to study. Predict what the video will cover. (g = 0.66 on its own [10](https://studycardsai.com/blog/active-recall-statistics).)
2. **Probe (15 min).** Watch the video *with the transcript/captions open*, at 1.25–1.5×, pausing every ~8 minutes. At each pause, close the video and write 3–5 lines: what was the idea, and one question you now have. This is the single biggest change to your YouTube habit.
3. **Point (10 min).** Now, and only now, bring in the AI. Ask it your accumulated questions. **Rule: you attempt first.** Paste your own attempt before you ask for anything. If it gives you the answer before you've attempted, you've bought an illusion.
4. **Attach (10 min).** Ask the AI to connect the new material to what you already know — and to your repo. "Show me where this connects to my notes on X." This is where the wiki earns its keep: it makes cross-subject connections you'll never make alone.
5. **Strengthen (10 min).** AI generates retrieval questions *from the source material only*. You answer closed-book. AI grades and gives feedback. This is your feedback loop — the thing that makes the testing effect work (g = 0.73 with feedback vs 0.39 without [8](https://glasp.co/articles/active-recall)).
6. **Test (10 min, daily, non-negotiable).** Review the spaced-repetition queue for today. Every card you got wrong goes into a "problems" list that the AI quizzes you on again.

Then **commit**: journal entry + new/updated notes + the day's cards. One commit, one day, honest message.

### 6.2 The weekly loop (~90 minutes, same day each week)
- **Closed-book, no-AI assessment (30 min).** This is the *only* metric that matters. The AI generates an exam from the week's material. You take it with no AI, no notes, no internet. The AI grades it afterwards.
  - Why this matters: it's the direct analogue of the Bastani exam condition — the only place where the performance/learning gap becomes visible [16](https://www.pnas.org/doi/10.1073/pnas.2422633122). If you never measure this, you'll never know whether you're learning or just performing.
- **Error review (20 min).** Every mistake from the week, classified: *misconception* (wrong mental model), *slip* (careless), *knowledge gap* (never learned), *AI-trust error* (you believed the AI and it was wrong).
- **Curate cards (20 min).** Keep roughly one third of the AI-generated cards; edit them into your own words; delete the rest. Card *quality* is the bottleneck, not card *quantity* [1](https://www.reddit.com/r/Anki/comments/1mewr8p/problem_with_aigenerated_flashcards/). Making the card is itself part of the learning.
- **Lint the wiki (20 min).** Ask the agent to run its lint pass: contradictions, stale claims, orphan pages, concepts referenced but never defined. Fix the two that matter.
- **Commit** with a week summary.

### 6.3 The monthly loop (~2 hours)
- **Mastery audit:** for each topic, ask "can I now (a) explain it to a beginner, (b) solve a novel problem in it, (c) teach it back after a week of not looking?" If any fails, it's not mastered — it goes back into the queue.
- **Roadmap update:** what you're dropping, what you're adding, what's genuinely done.
- **Wipe-and-rebuild test:** pick a core topic, delete your notes on it (keep them in git history), and see if you can rebuild it from memory. This is the strongest possible self-test, and git makes it safe.

### 6.4 What goes in the repo (the shape, not the code)
```
raw/        videos, PDFs, articles, transcripts      → immutable, yours
notes/      topic notes                             → compiled by the agent
journal/    dated entries: attempts, errors, insights → yours, agent reads only
cards/      the card deck, versioned                 → AI-drafted, you-curated
roadmap.md  what you're learning and why             → yours
index.md    catalog of everything                    → agent-maintained
log.md      dated record of every session            → agent-maintained
```
The split rule, stated once: **the agent may write anywhere in `notes/`, `cards/`, `index.md` and `log.md`. It may only *read* `raw/` and `journal/`. It may propose changes to `journal/` but never write them.** That single rule enforces the attribution boundary, which is the whole difference between learning and collecting.

### 6.5 The agent's operating rules (the contract)
This is the "prompt" in prose form — the rules that make the difference between the Harvard tutor and GPT Base:

1. **Never answer before I attempt.** If I haven't shown work, reply with a hint or a question, not a solution.
2. **One hint at a time.** Escalate only after I've tried and failed. Fade the scaffolding over weeks.
3. **Quiz me, don't lecture me.** Default response to "explain X" is a question that reveals whether I already understand X.
4. **Ground in my sources.** Answer from `raw/` and `notes/` first; mark anything from general knowledge as "outside my sources."
5. **Audit your own cards.** Generate, then critique for factual accuracy, atomicity (one question per card) and recall-vs-recognition. Ship only what survives.
6. **Flag disagreement.** If a source contradicts my notes, say so explicitly and open a contradiction entry.
7. **Never write my journal.** It may suggest a line; I write it.
8. **Calibrate me.** When my confidence and my test performance diverge, tell me.
9. **Track the debt.** Maintain a list of things I got wrong, and re-test them until they're clean.
10. **Ask what I want to be able to do.** Not "what did you read?" — "what must you be able to do with this?" (This is the elaborative-interrogation / self-explanation step, d = 0.54 [1](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf).)

The most recent framework for *what a good AI tutor must do* lists six capabilities that align almost exactly with these: withhold answers architecturally, maintain a persistent learner model, adapt the trajectory, surface confidence-vs-performance gaps, fade scaffolding over time, and treat errors as diagnostic data rather than failures to be corrected [8](https://drphilippahardman.substack.com/p/from-ai-tutors-to-ai-study-mates).

### 6.6 The free stack that actually works (as of October 2026)
You said "free of cost." That is genuinely achievable — here's the verified ₹0 stack:

| Need | Tool | Free reality |
|---|---|---|
| Tutor over *your own* material | **Gemini Notebook** (formerly NotebookLM, renamed July 2026) | 100 notebooks, 50 sources each, 50 chats/day, 3 audio overviews/day — free with any Google account; answers only from what you upload, with citations [4](https://mylingasia.com/posts/best-ai-tools-students-india-2026) |
| Socratic tutor | **Gemini Guided Learning** (free inside Gemini) | Free mode; asks instead of answering [17](https://www.aiacademia.in/blog/google-gemini-study-tools-india-2026) |
| Long-form reasoning / feedback | **Claude Free** | Daily message limit; no student discount [8](https://www.getlykke.com/blog/free-ai-tools-for-students) |
| General Q&A, study mode | **ChatGPT Free** | Unlimited everyday text chats; upload/tool limits apply [4](https://mylingasia.com/posts/best-ai-tools-students-india-2026) |
| Cited web research | **Perplexity Free** | Basic search free [8](https://www.getlykke.com/blog/free-ai-tools-for-students) |
| Spaced repetition | **Anki** (desktop/Android/web) + FSRS | Free and open source; FSRS is the modern scheduler, 20–30% fewer reviews than SM-2 at the same retention; Anki's default since v23.10 [6](https://studyglen.com/guides/best-spaced-repetition-apps) |
| Fully private, offline AI | **Ollama** + open models | Free, unlimited, no API key [3](https://topinlists.com/best-free-ai-tools-for-students/) |
| Student coding perks | **GitHub Student Pack** | Free Copilot, free domains, etc. |

**India-specific free boosters worth claiming now:** Google AI Plus free for 12 months for verified college students (18+), redeemable by 31 December 2026; Google AI Pro at ₹489/month for up to 4 years; and — if you're on a Jio ₹349+ unlimited 5G plan — 18 months of Gemini AI Pro free via MyJio [4](https://mylingasia.com/posts/best-ai-tools-students-india-2026). ⚠️ These offers require a payment method for verification and **auto-renew** — set a calendar reminder for the expiry date or you'll get billed.

**Video → cards in one move:** paste a YouTube URL into a transcript tool, paste the transcript into your AI with a card-generation prompt, review, export CSV, import into Anki [3](https://blog.yttranscript.app/youtube-transcript-to-anki-flashcards). Note the free-tier trap: many "YouTube-to-flashcards" services cap free usage at 3–5 minutes of video; the transcript-then-prompt route has no length limit [3](https://blog.yttranscript.app/youtube-transcript-to-anki-flashcards).

---

## 7. How you'll know whether this is working

**The single north-star metric: your closed-book, no-AI weekly test score.** Not time spent, not notes written, not videos watched. Everything else is diagnostic.

| Metric | Why it matters | Target |
|---|---|---|
| **Unassisted recall score** (weekly, closed-book) | The only honest measure; directly mirrors the exam condition where AI harms you | Rising trend over 8 weeks |
| **Time-to-competence** per topic | Are you actually getting faster? | Decreasing |
| **Card survival at 30 days** | Retention, not coverage | >85% |
| **"Explain-back" pass rate** | Can you teach it in your own words, unaided, after a week? | >80% of core topics |
| **AI-trust errors** (believed AI, was wrong) | Hallucination exposure | Trending to zero |
| **Commit cadence** | Consistency, not learning — treat as a hygiene metric only | No missed >2-day gap |

A useful contrast to keep in mind: the AI group at Harvard reported *higher* engagement and motivation than the classroom group [1](https://www.nature.com/articles/s41598-025-97652-6). **Engagement is the thing AI reliably improves; retention is the thing it reliably damages when badly designed.** So: enjoy the engagement, audit the retention.

---

## 8. Failure modes to pre-commit against

Write these down now, while you're motivated; they'll look obvious and feel invisible later.

1. **The polished-notes mirage.** The repo looks great; you learned nothing. *Counter:* if a note contains no sentence you couldn't have written before, it doesn't count.
2. **Answer-first reflex.** You ask the AI before attempting. *Counter:* the AI's first reply to any problem is a question or a hint, never a solution. Non-negotiable.
3. **The second monitor.** The AI becomes the material and you stop reading the source. *Counter:* "watch → close → recall → check" is a closed loop; the source is read, not skimmed via a summary.
4. **Card explosion.** 800 AI cards, 4% reviewed. *Counter:* cap the deck; one third of AI cards survive curation; if you don't personally want to review a card, it dies.
5. **Tool-hopping.** Six apps, no habit. *Counter:* one agent + one notebook + one deck. Add tools only when a specific friction appears.
6. **Learning in public as performance.** Posting polished notes to look impressive suppresses messy thinking. *Counter:* keep the journey honest; the mistakes are the content.
7. **The infinite "learn more" loop.** Consumption feels like progress and never terminates. *Counter:* every topic ends in a mastery gate (§6.3), not a bookmark.
8. **Mistaking conversation for learning.** A long, satisfying AI chat that you never convert into a card, a note, or an exam answer is worth almost nothing. *Counter:* every session must produce an artifact in the repo.

---

## 9. The first 30 days

**Days 1–3 — Set the frame.** Decide: what's the domain (one subject for the first 8 weeks, not five)? What's the outcome (an exam, a job skill, a portfolio)? What's your daily time budget, honestly? Write it into `roadmap.md`. Claim the free-tier accounts and set the auto-renew reminder. Create `raw/`, `notes/`, `journal/`, `cards/`.

**Days 4–7 — Build the loop on ONE topic.** Do the full daily loop (§6.1) end-to-end once. It will feel slow and awkward. That's the point — the slowness is the effort, and effort is the mechanism. Generate 20 cards from one video. Do the first closed-book test on day 7 and record the number.

**Week 2 — Turn on the scheduler.** Move all cards into Anki with FSRS. Start the daily review, 10–15 minutes, no exceptions. This is the single biggest compounding decision in the system.

**Week 3 — Add the agent contract.** Write your operating rules (§6.5) into `AGENTS.md` and let the agent run the wiki compile + lint cycle. Start asking the AI to connect new material to existing notes.

**Week 4 — Run the monthly loop.** Mastery audit. Wipe-and-rebuild test on your first topic. Look at your commit history and your first weekly test score. Then fix the system, not yourself — the system is what you'll still have in year two.

---

## 10. The honest summary

**What you got right:**
- AI tutoring is genuinely at the point where it beats a good classroom, at zero cost, for a self-learner. That is new, and it is worth building on [1](https://www.nature.com/articles/s41598-025-97652-6).
- The Git repo is the right substrate, and better than any notes app, because it creates a timeline, a diff, and an attribution boundary that no AI can fake.
- The instinct that "modern" should mean "AI-first" is correct in spirit — but only when the AI is positioned as a *coach with guardrails*, not a *search engine with answers*.

**What your plan still needs:**
- A **retrieval-first** philosophy. Watching and summarising is low-utility; recalling and testing is high-utility [1](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf).
- A **hard rule that you attempt before you ask**, because the research on self-regulated help-seeking shows that even *aware*, motivated students lose more than half their gains when they control when the AI helps [9](https://ssrn.com/abstract/5604932).
- A **closed-book weekly test** as the only honest metric.
- **A human-owned journal layer** in the repo, because a wiki the AI wrote teaches you nothing.

**The one-sentence version:** *Use AI to be grilled, not to be told; use Git to remember, not to store; and let the closed-book exam — not the feeling of progress — be the judge.*

---

## Sources

**AI tutoring efficacy & risk**
1. Kestin et al. (2025), *Scientific Reports* — [AI tutoring outperforms in-class active learning](https://www.nature.com/articles/s41598-025-97652-6) · 2. [*The Effortless Trap: Productive Struggle, AI, and the Illusion of Learning*](https://arxiv.org/pdf/2606.26181) · 3. [*A Systematic Approach to Evaluate the Use of Chatbots in Educational Contexts*](https://doi.org/10.3390/computers14070270) · 4. [LearnLM / Eedi exploratory RCT (UK)](https://arxiv.org/html/2512.23633v1) · 5. [Bastani et al. (2025), *PNAS*](https://www.pnas.org/doi/10.1073/pnas.2422633122) · 6. [Fan et al. (2025), *BJET* — metacognitive laziness](https://bera-journals.onlinelibrary.wiley.com/doi/10.1111/bjet.13544) · 7. [Meta-analysis of 68 AI-tutoring studies (SMD 0.45)](https://impactaieducation.substack.com/p/a-harvard-randomized-controlled-trial) · 8. [Tutor CoPilot (Stanford)](https://edworkingpapers.com/sites/default/files/ai24_1054_v2.pdf) · 9. [Wharton: Without Guardrails, Generative AI Can Harm Education](https://knowledge.wharton.upenn.edu/article/without-guardrails-generative-ai-can-harm-education/) · 10. [Meta-analysis: AI tutor access reduced grades & LMS participation (2,379 students)](https://brendanbartanen.substack.com/p/ai-tutoring-lowers-student-performance) · 11. [Poulidis, Bastani & Bastani — self-regulated AI use hinders learning (chess RCT)](https://ssrn.com/abstract/5604932) · 12. [Dr Philippa Hardman — From AI Tutors to AI Study Mates (design spec)](https://drphilippahardman.substack.com/p/from-ai-tutors-to-ai-study-mates) · 13. [Stanford Scale — AI tutoring without crowding out reading](https://scale.stanford.edu/ai/repository/ai-tutoring-enhances-student-learning-without-crowding-out-reading-effort) · 14. [Brookings — what the research shows about generative AI in tutoring](https://www.brookings.edu/articles/what-the-research-shows-about-generative-ai-in-tutoring/) · 15. [OECD Digital Education Outlook 2026](https://www.oecd.org/content/dam/oecd/en/publications/reports/2026/01/oecd-digital-education-outlook-2026_940e0dd8/062a7394-en.pdf) · 16. [AI evaluation & learning analytics — recommendations for tutor design](https://arxiv.org/html/2610.31481) · 17. [Frontiers in Education — AI vs. human tutor perceptions](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1528603/full)

**Learning science**
18. Roediger & Karpicke (2006), *Psychological Science* — [Test-Enhanced Learning](https://colinallen.dnsalias.org/Readings/2006_Roediger_Karpicke_PsychSci.pdf) · 19. Dunlosky et al. (2013) — [Improving Students' Learning With Effective Learning Techniques](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf) · 20. [Frontiers in Education — meta-analysis of 10 learning techniques with effect sizes](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2021.581216/full) · 21. [Rowland (2014) / feedback effects — glasp summary](https://glasp.co/articles/active-recall) · 22. [Adesope, Trevisan & Sundararajan (2017) — practice testing meta-analysis](https://www.strive-learning.com/blog/active-recall-vs-rereading) · 23. [Karpicke & Roediger (2007) — repeated retrieval & spaced practice](https://learninglab.psych.purdue.edu/downloads/2007/2007_Karpicke_Roediger_JML.pdf) · 24. [Szpunar et al. — forward testing effect with video](https://www.nature.com/articles/s41539-018-0024-y) · 25. [Reading vs. watching videos (MIT study)](https://bastakiss.com/blog/reading-vs-watching-videos-a-comprehensive-analysis-of-learning-efficiency/) · 26. [Active recall statistics (pretesting effect, King-Shepard et al. 2025)](https://studycardsai.com/blog/active-recall-statistics) · 27. [Cognitive offloading & the illusion of competence (UTS)](https://www.uts.edu.au/news/2026/03/experts-warn-unstructured-ai-use-in-schools-risks-cognitive-atrophy/contentassets/ai-cognitive-offloading-and-implications-for-education.pdf)

**Knowledge architecture & tooling**
28. Karpathy — [LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) · 29. [Koru — What is an LLM wiki?](https://www.koru.do/en/blog/llm-wiki) · 30. [Ben Emson — LLM Wiki with a human-owned garden layer](https://benemson.com/blog/agents/karpathys-llm-wiki-six-weeks-in) · 31. [learning-journal repo (dated Markdown entries)](https://github.com/Hamza-Zain/learning-journal) · 32. [work-to-knowledge — agent work → decision journal → concept notes](https://github.com/pariosur/work-to-knowledge) · 33. [Anki docs — FSRS & the two pillars](https://docs.ankiweb.net/background.html) · 34. [Best spaced-repetition apps 2026 — FSRS vs SM-2](https://studyglen.com/guides/best-spaced-repetition-apps) · 35. [YouTube transcript → Anki flashcard workflow](https://blog.yttranscript.app/youtube-transcript-to-anki-flashcards) · 36. [r/Anki — problems with AI-generated flashcards](https://www.reddit.com/r/Anki/comments/1mewr8p/problem_with_aigenerated_flashcards/) · 37. [Free AI tools for students in India (2026)](https://mylingasia.com/posts/best-ai-tools-students-india-2026) · 38. [Free AI tools with no credit card (Ollama, AI Studio, etc.)](https://topinlists.com/best-free-ai-tools-for-students/) · 39. [Google study tools free in India (Study Notebooks, Guided Learning)](https://www.aiacademia.in/blog/google-gemini-study-tools-india-2026) · 40. [Always-free AI tiers for students](https://www.getlykke.com/blog/free-ai-tools-for-students)
