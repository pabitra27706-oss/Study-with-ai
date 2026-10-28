# Study-with-ai

**A skill-readiness journey, tracked in Git and published to the web.**

I am a Computer Science & Technology diploma student at APC Ray Polytechnic,
Kolkata. This repository is where I build the skills that a diploma does not
teach — and where I prove them.

🌐 **Live site:** <https://pabitra27706-oss.github.io/Study-with-ai/>

---

## What lives here

| Path | What it is |
| ---- | ---------- |
| [`LEARNING-JOURNEY.md`](LEARNING-JOURNEY.md) | The research-backed design of the learning system: how AI is used, what Git is for, and the guardrails that keep it honest. 12 sections, 40 sources. |
| [`ROADMAP.md`](ROADMAP.md) | The career roadmap — JELET + Jadavpur University CSE on one spine, TypeScript + AI + a shipped portfolio on the other, plus the part-time income plan. 13 sections, 79 sources. |
| `app/` `components/` `content/` `lib/` | The website. Next.js 16 + Tailwind v4, static export, content generated from `content/*.ts` and `journal/*.md`. |
| `journal/` | The learning log. **Human-owned.** An AI agent may read it but must never write it. |
| `raw/` | Append-only source material, exactly as collected. |
| `notes/` | AI-compiled, human-owned topic notes. |
| `cards/` | Spaced-repetition cards, curated by hand from mistakes. |
| [`AGENTS.md`](AGENTS.md) | The contract for any AI working in this repo. Read it before touching anything. |
| `docs/` | The **built site**, committed so GitHub Pages can serve it straight from the `main` branch (`/docs`). Regenerate with `npm run build:pages`. |
| [`DEPLOY.md`](DEPLOY.md) | How to build and deploy the site (GitHub Pages, Vercel, Netlify, Cloudflare). |

> **JELET is deliberately a separate repository.** This repo is skill-readiness
> and the web interface. The exam track (syllabus tracker, MCQ practice, mock
> tests, error log) belongs in its own project so that neither one pollutes the
> other.

---

## The two rules

Everything in this repository follows from two rules.

1. **Attempt before you ask.** Research shows unguarded AI tutoring improves
   practice scores while **reducing unaided exam performance by 17%** in a
   measured course setting. So the AI never hands over the answer — it gives
   one hint, then asks a harder question. I write my attempt *before* the AI
   sees the problem.
2. **A weekly closed-book, no-AI test.** Every Sunday: 45 minutes, no AI, no
   notes, no browser. Whatever I can reproduce is what I actually know. It is
   the only score that counts — and it goes on the website, including the bad
   weeks.

---

## The core belief

> **AI-first, but AI-constrained.**
> Use AI to be *grilled*, not to be *told*.
> Use Git to *remember*, not to *store*.
> Let the closed-book test — not the feeling of progress — be the judge.

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

1. Repo → **Settings** → **Pages** → Source: **Deploy from a branch** →
   **main** / **/docs** → Save. (The built site is already committed in
   `docs/`.)
2. For automatic deploys on every push instead, commit
   `.github/workflows/deploy.yml` and switch the Pages source to **GitHub
   Actions**. See [`DEPLOY.md`](DEPLOY.md).

---

## The stack — free, and chosen for the job market

**Primary:** TypeScript end to end — Next.js + React, Node + Express,
PostgreSQL + Prisma, Docker, CI/CD.
**AI layer:** Python, LLM APIs, RAG, agents, MCP, evaluation harnesses.
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
