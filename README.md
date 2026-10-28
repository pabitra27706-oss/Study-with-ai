# Study-with-ai

**A skill-readiness journey, tracked in Git and published to the web.**

I am a Computer Science & Technology diploma student at APC Ray Polytechnic,
Kolkata. I have no computer — a Termux terminal on Android is my only
machine, so everything in this repository was typed on a phone, and GitHub
Actions is the build machine.

🌐 **Live site:** <https://pabitra27706-oss.github.io/Study-with-ai/>

---

## What lives here

| Path | What it is |
| ---- | ---------- |
| [`GITHUB-AUDIT.md`](GITHUB-AUDIT.md) | **Start here.** A full audit of both GitHub accounts — 47 repositories, what each one proves, what is broken, and a 30-day fix list. |
| [`LEARNING-JOURNEY.md`](LEARNING-JOURNEY.md) | The research-backed design of the learning system: how AI is used, what Git is for, the guardrails that keep it honest, and how all of it works from a phone. 11 sections, 40 sources. |
| [`runbook/`](runbook/) | **The operating procedure.** State, the loop, how to judge, setup, the decision log (including what was rejected) and the open list. Written so that a fresh chat with no memory can pick up the thread. |
| [`LEARNING-SYSTEM.md`](LEARNING-SYSTEM.md) | **The machine that judges you.** AI-written topics with curated video sources, machine-checked tasks, a why-comment checker, a written rubric — and the brief that I read before I judge, and the script that writes my verdict back. How it works, how to add a topic, how to publish into the archive. |
| `curriculum/` | **Topic packs** — the teaching half. Explanation, videos with a reason for each, tasks with hidden test cases, rubric. Written by AI. |
| `learn/` | **Your half and my half.** You write `solutions/*.c` and `answers.json` in CodeC; I write `verdict.json`, `notes.json`, `review.md` and `history.md` back. |
| `runner/` | The instrument: `evidence.mjs` is the sensor (compile, test, comment check); `brief.mjs` assembles the judging brief; `apply-verdict.mjs` writes a verdict into the repository. |
| [`ROADMAP.md`](ROADMAP.md) | The career roadmap — JELET + Jadavpur University CSE on one spine, Android/Full-Stack/AI on the other, plus the part-time income plan. 79 sources. |
| `app/` `components/` `content/` `lib/` | The website. Next.js 16 + Tailwind v4, static export, content generated from `content/*.ts` and `journal/*.md`. |
| `journal/` | The learning log. **Human-owned.** An AI agent may read it but must never write it. |
| `raw/` | Append-only source material, exactly as collected. |
| `notes/` | AI-compiled, human-owned topic notes. |
| `cards/` | Spaced-repetition cards, curated by hand from mistakes. |
| [`AGENTS.md`](AGENTS.md) | The contract for any AI working in this repo. Read it before touching anything. |
| `scripts/` | `collect.sh` (the CodeC bridge — copy in, check, commit, push), `check.sh` (print the judging brief), `termux-setup.sh` (one-command deploy from Android), `export-to-portfolio.mjs` (publish into the archive), `deploy-workflow.yml` (the hardened Pages workflow). |
| `scripts/deploy-workflow.yml` | The canonical Pages workflow. Copy it into `.github/workflows/deploy.yml` and push — that is what makes every push to `main` redeploy the site. |
| [`DEPLOY.md`](DEPLOY.md) | How to build and deploy the site (GitHub Pages, Vercel, Netlify, Cloudflare) — including the Termux walkthrough. |

> **JELET is deliberately a separate repository.** This repo is skill-readiness
> and the web interface. The exam track lives in
> [`Jelet-prep`](https://github.com/pabitra27706-oss/Jelet-prep) — which already
> holds the complete 2026 syllabus and seven years of previous-year papers.
> The missing half is instrumentation: a scoring engine, an error log and a
> topic heat map. See ROADMAP §3A.7.

---

## The two rules

Everything in this repository follows from two rules.

1. **Attempt before you ask.** Research shows unguarded AI tutoring improves
   practice scores while **reducing unaided exam performance by 17%** in a
   measured course setting. So the AI never hands over the answer — it gives
   one hint, then asks a harder question. I write my attempt *before* the AI
   sees the problem.
2. **A weekly closed-book, no-AI test.** Every Sunday: 45 minutes, no AI, no
   notes, no browser — and, on a phone, **in a different room**. Whatever I
   can reproduce is what I actually know. It is the only score that counts,
   and it goes on the website, including the bad weeks.

---

## The core belief

> **AI-first, but AI-constrained.**
> Use AI to be *grilled*, not to be *told*.
> Use Git to *remember*, not to *store*.
> Let the closed-book test — not the feeling of progress — be the judge.
>
> And on a phone: **use the phone to think and commit, use CI to compile,
> use the closed-book test to prove it.**

---

## Run the site locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Other commands:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # static export into ./out
npm run build:pages  # static export with the GitHub Pages base path -> ./docs
npm run preview      # serve ./out locally
npm run stats        # repo status in the terminal
```

Static export (what GitHub Pages gets):

```bash
NEXT_OUTPUT=export npm run build
```

### Publish it

The live URL is **`https://pabitra27706-oss.github.io/Study-with-ai/`**.

**You are already live** at that URL, with Pages set to **GitHub Actions** —
every push to `main` rebuilds and redeploys automatically.

If you ever need to reinstall the workflow (it lives at
`scripts/deploy-workflow.yml`):

```bash
mkdir -p .github/workflows
cp scripts/deploy-workflow.yml .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deploy workflow"
git push
```

See [`DEPLOY.md`](DEPLOY.md) for the Vercel / Netlify / Cloudflare paths and the
full Termux walkthrough.

**From a phone (Termux on Android), one command does it all:**

```bash
git clone https://github.com/pabitra27706-oss/Study-with-ai.git
cd Study-with-ai
bash scripts/termux-setup.sh
```

---

---

## The learning system — you write it, I judge it

The single biggest hole in the audit was this: **47 repositories, zero
automated tests.** A repository that cannot tell you whether you understood
something is a notebook, not a learning system.

So this repository now has one — and the judge is a conversation, not a service.

| | |
|---|---|
| **The topic** | AI writes it out in full — the idea, the exact evaluation order, the bugs that cost marks. Plus curated video links, each with a *reason* it is on the list. |
| **Your code** | Written in **CodeC**, on your phone. Pushed here by you. |
| **The sensor** | `gcc -std=c17 -Wall -Wextra` compiles it and runs the **hidden edge cases** — zero, one, leading zeros, the boundary. The comment checker flags every line that restates the code instead of explaining it. |
| **The brief** | `runner/brief.mjs` assembles everything needed to judge: what was taught, what the task asked, your code, the machine facts, your answers. |
| **The judge** | **I read the brief and decide what it means.** No model, no API key, no CI agent — the judge is me, in this conversation, so you can argue with me. |
| **The notes** | I write your three notes lines, in your voice, from what your submission actually showed — not what you hoped it showed. |
| **The keeping** | Notes, written review, a dated history line, the refreshed topic and the verdict all go back into the repository. Git history is the record of what you could do on which day. |

**The compiler is not the judge.** A test runner can tell you a program failed
on `n = 0`. It cannot tell you whether you understand why — and those two cases
look identical to `gcc` and completely different to a teacher. One is a typo.
The other is a broken mental model. Reading the evidence *and* your comments
*and* your answers is what tells them apart.

**Your writing stays minimal. Your code does the explaining.** Four short
answers, and the comments in the code carry the reasoning. On a phone, that is
the difference between a system you will actually use and one you will not.

**The whole loop, from Termux:**

```bash
pkg install nodejs clang            # once

bash scripts/collect.sh c-loops t1  # CodeC -> repo -> compile, test, commit, push
# then, in this chat:
#   check c-loops
```

No paid service, no key, no laptop, and no bot talking to your repository
behind your back. `clang` is a Termux package, so the checks run on the phone.

See **[`LEARNING-SYSTEM.md`](LEARNING-SYSTEM.md)** for the full design, and
**[/learn](https://pabitra27706-oss.github.io/Study-with-ai/learn)** for the
live version.

---

## The stack — free, and chosen for the job market

**Primary:** TypeScript end to end — Next.js + React, Node + Express,
PostgreSQL + Prisma, Docker, CI/CD.
**AI layer:** Python, LLM APIs, RAG, agents, MCP, evaluation harnesses.
**Mobile:** Kotlin and Android — already shipped, and it is where the recent
work is.
**Fallback:** Java for DSA and enterprise roles.
**Also free:** the syllabus subjects (DBMS, DSA, Networks, OS, SE) double as
interview preparation, so nothing is wasted.

No paid tool is required anywhere in this system. That was a constraint I
chose, and it turned out to be an advantage.

---

## The live link

The site is generated from this repository — edit `content/skills.ts`, commit,
and the dashboard moves. Every number on it comes from the repo, and a skill
without a proof link is capped at 85% so that a feeling can never be reported
as a fact.

```
https://pabitra27706-oss.github.io/Study-with-ai/
```
