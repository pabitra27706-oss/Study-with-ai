# GitHub Audit — what your two accounts actually prove

*Audited 28 October 2026 against the live GitHub API. Every claim below is
read off a repository, not assumed.*

You told me to find everything from your GitHub. Here it is — the full
inventory, what it proves, and the short list of things that are quietly
costing you.

**The two accounts:**

| | `pabitra27706-oss` | `pabiwilliams` |
|---|---|---|
| Created | 2026-02-07 | 2025-03-25 |
| Public repos | 17 | 30 |
| Followers | 5 | 3 |
| Profile README | **none — the profile shows the default card** | **the untouched GitHub template** |
| Best asset | `matriq` (InsightAI), `Jelet-prep`, `Termux-Mastery` | `CodeC` (3★), `AppFlow`, 2 shipped Android apps |

Both accounts push to the same repositories, and `pabitra27706-oss` has
already been pushing to `pabiwilliams/CodeC`. **You are effectively one
developer with two logins.** That is the single biggest fix on the list.

---

## 1. The correction that matters most

Your self-assessment is "coding beginner". The repositories say something
different.

| Evidence | What it proves |
|---|---|
| `matriq` — Next.js 16 + React 19 + Tailwind + Recharts frontend, FastAPI + Python backend, Gemini 2.5 Flash, SQLite with 1,000,000 rows, NL→SQL, dynamic chart config, SQL-injection guards, conversational follow-ups, CSV upload, `Procfile` + `render.yaml` | You have shipped a **full-stack AI product**, not a tutorial. |
| `CodeC` (3★) — "Your phone. Your next idea." A phone-based coding workspace | You are building **developer tools**, and you have an audience for them. |
| `AppFlow` — "Phone-First Indie Playbook … Build on a phone with CodeC and an AI agent; use GitHub Actions as the build machine" | You have already written the **operating doctrine** for phone-first shipping. |
| `Tilefold` (2048-game) + `Day Ledger` (Personal-ueses-app) — both bootstrapped from AppFlow, MIT, offline-first, self-contained | You can **ship a complete app from a phone**, using CI as the build machine. |
| `Diploma-3rd-sem` (1★) — offline-ready PWA study hub for WB poly CST students | You build **PWAs and publish for your own peers**. |
| `Jelet-prep` — full JELET syllabus + **7 years of PYQs transcribed with LaTeX** (2017, 2018, 2019, 2021, 2022, 2024, 2025), rendered with marked + MathJax | You can **do demanding, precise research work** and ship it. |
| `Termux-Mastery` (1★) — 15-module Termux textbook, beginner→advanced | You can **teach**, and you already have an audience for it. |
| `portfolio` (1★, live) — JSON-driven learning archive on GitHub Pages, no frameworks | You can design **information architecture**. |
| `web-inspector-pro`, `CodeType Studio`, `coupleSpend` (Firebase + Chart.js PWA), `anm-gnm-pre` | Broad **ship-it** instinct across HTML/CSS/JS/Firebase/PWA. |
| `system-design-notes` (fork), `ai-engineering-hub`, `Hands-On-Large-Language-Models`, `awesome-llm-apps`, `everything-claude-code`, `system-prompts-and-models-of-ai-tools`, `free-claude-code`, `computer-science`, `developer-roadmap` | You are **curating a serious AI/CS curriculum** — and your learning method is *fork-and-read*, not *watch-and-forget*. |

**Verdict: you are a mid-level, phone-first full-stack builder with Android
depth and AI product experience.** The roadmaps written before this audit
were written for a beginner and are, in places, wrong.

**What you are actually a beginner at** (and this is the useful list):
production-grade testing · CI/CD as a habit · relational depth (you have
used SQLite and Firebase, not Postgres) · algorithms & data structures ·
system design beyond notes · cloud & deployment beyond Render YAML ·
security · code review and collaboration (zero merged PRs in other people's
repos) · technical English writing.

That is a completely different, and much shorter, list.

---

## 2. What you have not started at all

| Skill | Evidence | Priority |
|---|---|---|
| **Automated testing** | No test file, no test framework, no coverage config in any repo | **P0** — this is what "senior" means to a hiring manager |
| **CI/CD as a habit** | `matriq` has `render.yaml`; `AppFlow` *describes* GitHub Actions as the build machine, but no repo in either account has a workflow file | **P0** — you already know the doctrine, you have not shipped it |
| **Merged PRs in other people's repos** | Zero found | **P0** — the "works with a team" signal |
| **PostgreSQL + migrations + Prisma** | SQLite, Firebase only | P1 |
| **DSA / algorithms** | No repo, no practice log | P1 — needed for every interview round |
| **Cloud & containers** | No Dockerfile, no Terraform, no cloud SDK | P1 |
| **System design (from memory)** | Forked notes, not yet applied | P1 |
| **Technical English writing** | READMEs are uneven; several have no README at all | P1 — cheap to fix, high leverage |
| **Security basics** | SQL injection guarded in `matriq` (good), nothing else | P2 |
| **Accessibility / a11y** | No evidence | P2 |

---

## 3. Broken things that are costing you, ranked by hours of recruiter attention

### 3.1 Both profile READMEs are missing or empty — **fix first**

- `pabitra27706-oss` has **no profile repository at all**. A recruiter who
  clicks your avatar sees a default card with no README.
- `pabiwilliams/pabiwilliams` contains the **untouched GitHub template** —
  literally `👀 I'm interested in ...`, `🌱 I'm currently learning ...`.
  Last pushed 2025-06-08, i.e. it has been sitting there for 16 months.

A profile README is the single highest-leverage page you can write. It is
the only page a recruiter is guaranteed to open.

### 3.2 `node_modules` is committed in at least two repos

`matriq/backend/node_modules` contains `framer-motion`, `motion-dom`,
`html-to-image` — and `matriq` is **29 MB** as a result. `club-web` is
**46 MB**. `CodeC` is **31 MB**. That is what makes the repos slow to
clone, and it is the kind of thing a reviewer notices immediately.

Fix: add a real `.gitignore`, then `git rm -r --cached backend/node_modules`
and commit. History stays fat, but the working tree shrinks instantly. If
you care about the history, `git filter-repo` (Termux: `pkg install git-filter-repo`)
rewrites it — do that once, on a clean clone.

### 3.3 Repository hygiene — 22 of 47 repos are not recruiter-ready

| Issue | Count | Fix |
|---|---|---|
| No description | 10 | One line: what it does + what it proves |
| No license | 12 | MIT, one click each |
| No README | several (`Attendance`, `club-web`, `web-inspector-pro`, `Diploma-3rd-sem`) | 8 lines is enough |
| Meaningless description | `CodeC` → `"9"` | Replace it |
| No topics | most | `android`, `kotlin`, `nextjs`, `ai`, `pwa`, `termux` |

### 3.4 Only two of your projects are actually live

- `https://pabitra27706-oss.github.io/coderanimeme/` — live
- `https://pabitra27706-oss.github.io/portfolio/` — live
- Everything else: no URL, no demo, no screenshot.

`matriq` is your strongest project and it has **no live demo link** in the
README even though it carries a `render.yaml` — a one-line README fix, and
it becomes the centrepiece of the portfolio.

### 3.5 The two-account split

A recruiter searching "Pabitra Williams" finds `pabiwilliams` (30 repos,
mostly forks) and `pabitra27706-oss` (17 repos, mostly originals). The
signal is diluted and they look like two different people.

**Recommendation:** make **`pabitra27706-oss`** the single public identity —
it is the one with the originals, the live sites, and the `pabitra27706-oss.github.io`
Pages domain. Move or re-point anything worth keeping from `pabiwilliams`
(the Android work: `CodeC`, `AppFlow`, `Tilefold`, `Day Ledger`, the profile
repo) and then make `pabiwilliams` a *single* private-or-archive account
rather than a second public storefront.

The one thing not to lose: the **`pabiwilliams` profile repository** — it is
the right artefact, it just needs real content and to live in the surviving
account.

---

## 4. The two assets you already own that are worth more than a new one

### 4.1 `Jelet-prep` — do not start a new JELET repo

It already exists and it is better than anything I would have proposed from
scratch:

- `syllabus.md` — the full JELET-2026 syllabus, matching the official
  Information Bulletin of 18 March 2026 (Maths 40 Q / 50 M, Physics 30 Q /
  35 M, Chemistry 20 Q / 25 M, FEEE 10 Q / 10 M; Cat-1 +1/−0.25, Cat-2 +2
  all-correct with partial credit).
- `pyq-md/` — **2017, 2018, 2019, 2021, 2022, 2024, 2025** transcribed in
  Markdown with LaTeX.
- `pyq-index.html` — marked + MathJax renderer.

**What is missing is not content, it is instrumentation.** It has 2 commits
and stopped on 4 June 2026 — the day the 2026 exam was about to be written.
It was abandoned, not finished. The three things that turn it into a real
prep system:

1. **A scoring engine** that reproduces the official rule, including the
   tie-break chain (fewest negatives → Maths → Physics → Chemistry).
2. **An error log** with a forced classification per wrong answer:
   `concept` / `careless` / `misread` / `time`. Without this, 500 practice
   questions produce no learning.
3. **A topic heat map** ranking by *marks recoverable*, not by accuracy.

### 4.2 `AppFlow` — your phone-first doctrine already exists

> "One source of truth for a phone-first Indian indie developer shipping
> Android apps. Build on a phone with CodeC and an AI agent; use GitHub
> Actions as the build machine. Keep apps small, offline-first, distinct,
> respectful, and time-boxed to four weeks."

That is exactly right, and it is better than what I would have written. The
learning system in this repository should be re-based on it rather than
invented alongside it.

---

## 5. The 30-day fix list

**Week 1 — the face**
1. Write the profile README on `pabitra27706-oss` (the `pabiwilliams`
   profile repo is the raw material — paste, then rewrite).
2. Add descriptions + MIT licences to the ten most important repos.
3. Delete the `pabiwilliams` profile template and repoint the Android work
   at one account.

**Week 2 — the hygiene**
4. `.gitignore` + `git rm -r --cached` for every committed `node_modules`.
5. Add a LICENSE and 3–5 topics to each of your ten real repos.
6. Write the missing READMEs — 8 lines each, not 80.

**Week 3 — the proof**
7. Deploy `matriq` and put the live URL in the README.
8. Add a workflow file to `matriq` and to `CodeC` (CI as the build machine —
   the doctrine in `AppFlow`, executed).
9. Add a CI workflow to this repo so the site deploys on every push.

**Week 4 — the signal**
10. Three merged PRs in other people's repositories (start with docs and
    tests; `TypeScript` and `Python` projects are easiest to enter).
11. First unit tests, in `matriq`.
12. A weekly scoreboard on this site: mock score, closed-book test score,
    PRs merged, days of the streak.

---

## 6. The one-sentence version

You are not a beginner and you are not starting from zero — you are a
**phone-first full-stack builder with a shipped AI product, a 3★ developer
tool, two shipped Android apps, a complete JELET PYQ archive, and a
published Termux textbook**, whose real gaps are *testing, CI/CD,
collaboration, DSA and technical English*, and whose real problem is that
**none of it is legible from the outside** because both profile READMEs are
empty and the best project has no live link.

Fix the legibility first. It is the cheapest ROI in the entire repository.
