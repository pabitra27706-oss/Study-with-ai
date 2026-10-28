# CS Career Roadmap — CST Diploma, WB APC Ray Polytechnic

**Tailored plan for: Computer Science & Technology diploma (3 years, after Class 10), Kolkata.**
Goal: **CS career ready** — skills, job, and the opportunities that come with both.
Target seat: **Jadavpur University B.E./B.Tech (Lateral), Computer Science & Engineering.**

> **One structural note up front:** this plan has **two spines that share the same hours.**
> - **JELET spine** — Maths + Physics + Chemistry + FEEE. This is your *exam*, and it is 100% your syllabus (or your Class 10–12 science).
> - **Job spine** — Android + Full-Stack (TypeScript/Python) + AI + a legible portfolio. This is your *career*, and it is entirely outside your syllabus.
>
> Everything else in this doc is either one of those two spines, or the operating system that runs them both (your repo, your agent, your loop).

> **And one constraint that shapes the mechanics of all of it:** **you have no computer.** A Termux terminal on Android is your only machine. Every line of code in every repository was typed on it, and the plan is built around that fact rather than apologising for it — `git push` is the build command, and GitHub Actions is the build machine. See §1A, and your own doctrine in [`AppFlow`](https://github.com/pabi277/AppFlow).

> **Version note (28 October 2026):** §0, §1A, §1B, §3A.7, §6, §12 and §13 were rewritten after a **full audit of both GitHub accounts** (47 repositories). The plan's starting assumption changed from *"coding beginner"* to *"mid-level phone-first builder with five specific gaps"*. The full evidence is in **[`GITHUB-AUDIT.md`](GITHUB-AUDIT.md)**. Sections not listed above are unchanged and still accurate.

*Research current as of 28 October 2026.*

---

## 0. Your position, updated (after the GitHub audit, 28 Oct 2026)

**Sem 3 · JELET-priority → JU CSE · phone-first builder, _not_ a beginner · 2–3 hours/day · 9.3 GPA in 1st year · 88.17% Madhyamik · 80% HS.**

> **This whole section was rewritten on 28 October 2026 after a full audit of both your GitHub accounts.** The earlier version of this plan was written from a self-report of *"coding beginner"*. That self-report is wrong, and the difference is not cosmetic — the plan below is **no longer a beginner's plan**. It is a plan for someone who has already shipped work and now needs to (a) make that work legible to a stranger and (b) close five specific gaps.

### 0.1 What the repositories actually prove

| Evidence | What it means |
| -------- | ------------ |
| `matriq` — Next.js 16 + React 19 + Tailwind + Recharts, FastAPI + Python, Gemini 2.5 Flash, SQLite at 1,000,000 rows, NL→SQL, dynamic chart config, SQL-injection guards, `Procfile` + `render.yaml` | You have shipped a **full-stack AI product**, not a tutorial. |
| `CodeC` (3★) — "Your phone. Your next idea." A phone-based coding workspace | You build **developer tools**, and other developers find them on their own. |
| `AppFlow` — "Phone-First Indie Playbook … build on a phone with CodeC and an AI agent; use GitHub Actions as the build machine" | You have already written the **operating doctrine** this plan needs. |
| `Tilefold` + `Day Ledger` — two complete Android apps, MIT, offline-first, both bootstrapped from AppFlow | You can **ship an app from a phone**, with CI as the build machine. |
| `Diploma-3rd-sem` (1★), `Diploma-2nd-sem` (1★), `anm-gnm-pre` — offline-ready PWAs for WB poly students | You can **serve an audience** and publish for your own batch. |
| `Jelet-prep` — full JELET-2026 syllabus + **7 years of PYQs** (2017, 2018, 2019, 2021, 2022, 2024, 2025) transcribed with LaTeX and rendered with marked + MathJax | You can do **precise, demanding research work** and ship it. The JELET spine is further along than this plan assumed. |
| `Termux-Mastery` (1★) — a 15-module Termux textbook, beginner → advanced | You can **teach**, and people follow the teaching. |
| 47 repositories across two accounts, ~12 originals | **Consistency** — the rarest item on this list. |

The full inventory, the things that are quietly broken (committed `node_modules` in three repos, 12 repos without a licence, 10 without a description, **two empty profile READMEs**), and a 30-day fix list are in **[`GITHUB-AUDIT.md`](GITHUB-AUDIT.md)**.

**One honest sentence: you are a mid-level, phone-first full-stack builder with Android depth and real AI product experience. You are a beginner at testing, CI/CD, collaboration, DSA and system design — and nowhere else.** That is a much shorter list than "beginner", and it is the list this plan is built around.

### 0.2 Your academic profile is still a genuine asset

88.17% in Class 10, 80% in Class 12, and a 1st-year diploma GPA of 9.3 (≈93% if that is a 10-point scale) put you comfortably over the single hardest gate on your entire path: **Jadavpur University's lateral entry demands a 60% diploma aggregate** — 15 points higher than every other college in West Bengal [JELET 2026 bulletin](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf). You cleared that in year one. **The remaining challenge is not paperwork. It is the exam rank** — a pure skills problem, which is exactly what the AI learning system is for.

**2–3 hours/day for 3.5 years is roughly 3,000+ hours.** But note the change: you are no longer spending 3,000 hours learning *from zero*. You are spending them **compounding what already works, and repairing what is broken**. That is a much better use of the same hours, and it means the first 30 days should not look like a beginner's at all.

### 0.3 Correction 1 — "Learn something not for my studies" needs one exception

You said you want to learn *not for your studies*. I mostly agree — but **JELET, which you've now chosen as your spine, is 100% your studies.** JELET Paper I is **Mathematics, Physics, Chemistry, and Fundamentals of Electrical & Electronics Engineering** — there is no Computer Science paper at all.

That single fact reshapes the plan: the highest-leverage thing you can do at 2–3 hours/day from Sem 3 onwards is **master Maths, Physics and Chemistry properly in English, using the AI as a tutor.** That single activity simultaneously:
- protects the **45% diploma aggregate** that JELET eligibility depends on,
- is **~92% of the JELET marks** (Math 41.7% + Physics 29.2% + Chemistry 20.8% + FEEE 8.3%) [JELET pattern](https://collegedunia.com/exams/jelet/exam-pattern),
- and is *not* the CS skills that get you a job.

So the structure is unchanged: **JELET subjects = the exam spine. CS + AI = the job spine. Both run in parallel from day one.** They're not competing for time — the syllabus overlap means your core academic effort and your exam prep are the same hours.

**But the JELET starting point is better than assumed.** `Jelet-prep` already holds the complete 2026 syllabus and seven years of papers. The missing half is not content — it is *instrumentation*: a scoring engine, a forced error log, a topic heat map. See §3A.7.

### 0.4 Correction 2 — Don't serialise degree-then-job

You chose "degree first, jobs after." I'll support that. But the thing to understand is that **the degree only converts into a job if the portfolio exists at the same time.** By the time you sit JELET (~2029–30), the market will have moved further from where it is today — entry-level postings have already fallen ~60% since 2022 [9](https://www.nucamp.co/blog/the-junior-developer-hiring-crisis-in-2026-how-to-get-your-first-full-stack-job), and AI fluency has moved from nice-to-have to baseline [7](https://www.edstellar.com/blog/most-in-demand-skills-in-it).

The right version of "degree first" is: **the degree is the spine; the portfolio is built in the same 3.5 years, not after it.** The B.Tech years (Sem 7–12) are then where you convert both into a job — and you can start applying during them too, not only after graduation.

**The change from the old plan:** the portfolio already exists. What it lacks is *legibility* — a profile README, descriptions, licences, live links, and one identity instead of two. That is a 30-day job, not a 3-year job. See §1B.

### 0.5 Correction 3 — You are not a beginner, so the first 6 months are about five specific gaps

The old plan said: *"Not React. Not Docker. Not TypeScript. Foundations — one language done properly."* You have all three of those, shipped. Starting over with them would be a **worse** use of a year than building on top of them.

The first six months, in priority order:

1. **Make the work legible.** One GitHub account, a real profile README, a live demo on every project, descriptions and licences. *(§1B)*
2. **Automated tests.** Zero tests across 47 repositories. This is the gap that reads as "hobbyist" rather than "engineer". *(§1B)*
3. **CI/CD.** The doctrine exists in `AppFlow`; not one workflow file exists in either account. On a phone this is not a nice-to-have — it is the only way to compile. *(§1B, §4.5)*
4. **Three merged PRs in other people's repositories.** The "works with a team" signal, currently at zero. *(§6, Repo 4)*
5. **DSA, with a weekly score.** The one filter that can still reject you at every interview. *(§7.1)*

**A deliberate demotion:** Java was in the old first-six-months list. It moves down. Three languages at once (Kotlin, Python, JavaScript/TypeScript) is how people stall, and you already have two of them in production. Java comes back for DSA practice in Sem 5, not before.

### 0.6 Correction 4 — You have no computer. The phone is the machine.

This is a hard constraint, and it changes the *mechanics* of everything in this plan, so it is stated here rather than buried.

- **Termux is your terminal, editor, classroom and deployment console.** You have already written the 15-module textbook other people learn it from.
- **You cannot build Next.js or Gradle on the phone** — Android is bionic, those toolchains need glibc. This is not a limitation to work around; it is the reason **`AppFlow`'s rule exists**: *use GitHub Actions as the build machine*. You wrote that rule. Now execute it.
- **So: `git push` is the build command.** Typecheck, lint, build and deploy all happen on GitHub's runner, and you watch the run from the phone with `gh run watch`.
- **The daily loop is the same, sized for twenty-minute sessions** — pull, attempt, commit, push, log. Full manual: [`/phone`](https://pabitra27706-oss.github.io/Study-with-ai/phone) on the site, or `scripts/termux-setup.sh` in the repo.
- **Consequence for the portfolio:** every project needs a CI workflow and a one-command run path, because nobody — including a future employer — will ever open a terminal on your phone. Design for the browser.

**What the phone gives you that a laptop would not:** enforced small sessions, no distraction, and the discipline of everything being text. **What it costs you:** long-form editing, local builds, and any task that needs a big screen. Design around it, do not fight it.

### 0.7 One thing to settle this week

**Ask your college office two questions:**
1. *"Is a final-semester-appearing diploma candidate eligible to apply for JELET provisionally?"* — the WB rules say yes: *"Candidates who are appearing in their final semester of the qualifying exam can apply provisionally — admission will be confirmed only after submitting the final marksheet at document verification"* [Collegedunia — JELET 2026](https://collegedunia.com/exams/jelet/exam-pattern). This single fact determines whether your target is **JELET 2029** (apply while appearing, join after results) or **JELET 2030**.
2. *"For JU, which B.Tech branches can a CST diploma holder apply to under JELET, and what do you know about JU's 60% rule and the 9 CSE seats?"* — **CST → JU CSE is explicitly listed** in the JU seat matrix (as "Computer Science & Engineering / Computer Science & Technology"), so your main target is clean. But the JU brochure also requires the diploma to be *"in the relevant branch"* for other departments, so **JU IT/ECE may not be open to you** — confirm before you build a tiered list on false assumptions. See §3B.

**And two questions for yourself, answerable in ten minutes:**
3. *Which account is your identity?* `pabitra27706-oss` (17 repos, the originals, the live sites, the Pages domain) or `pabi277` (30 repos, mostly forks, plus the Android work)? **Recommendation: `pabitra27706-oss`**, and move the Android work across.
4. *What is the one project you would want a recruiter to open first?* Right now `matriq` is the answer — and it has **no live link**, which is a five-minute fix with a very large return.

---

## 1. Where you actually stand

Let's be precise, because the plan depends on it.

**What you have (and shouldn't underestimate):**
- A 3-year AICTE-recognised diploma in CST from a West Bengal government polytechnic. The WB syllabus for CST is genuinely strong in the fundamentals: C → Java/OOP → Data Structures → DBMS → Computer Networks → Operating Systems → Microprocessor/Microcontroller → IoT → Web Technology → AI/ML electives, plus a **Minor Project** and a **Summer Internship** [1](https://gsmp.co.in/wp-content/uploads/2023/02/CST_STRUCTURE.pdf) [2](https://polytechnic.wbtetsd.gov.in/polytechnic/college/download_file/184260348236f9554fe9375772ff966e/1731949424.pdf).
- Your college sits in **Jadavpur, Kolkata** — inside the city's IT corridor. That matters more than the college name.
- You already have **47 repositories across two GitHub accounts**, including a shipped full-stack AI product (`matriq`), a 3-star phone-based IDE (`CodeC`), two complete Android apps, a 7-year JELET PYQ archive, a 15-module Termux textbook and two live websites. That is a head start on the "AI-native developer" profile that employers are now paying a premium for — *and* it is currently invisible, which is §1B's entire subject.*

**What you don't have (and what actually blocks hiring):**
- Publicly, the college reports **no median placement salary** [3](https://www.shiksha.com/college/acharya-prafulla-chandra-ray-polytechnic-jadavpur-kolkata-58865/course-diploma-in-computer-science-and-technology-640035). Which means: **nobody will hire you on the strength of your college.** Your proof has to come from outside it.
- Your syllabus is a 2022 state curriculum. It is not what the job market is hiring for in 2026. That's fine — it's a floor, not a ceiling. But do not confuse "I did the syllabus" with "I'm employable."

**The one piece of good news nobody tells diploma students:** in 2026, **skills-first hiring is real.** Remote junior roles now routinely say *"No degree required"* and *"We do not care about pedigree. We care about passion, potential, and proof of work"* [4](https://www.remoterocketship.com/country/india/jobs/junior-backend-developer/) [5](https://www.glassdoor.co.in/Job/india-junior-frontend-developer-remote-working-jobs-SRCH_IL.0,5_IN115_KO6,46.htm). A diploma holder with a great GitHub can beat a B.Tech holder with an empty one. But only one of those two things is under your control.

---

## 1A. The phone-first constraint — the mechanic that runs everything

You have no computer. A Termux terminal on Android is your only machine, and every line of code in every repository was typed on it. That is not a limitation to apologise for — it has already produced a 3-star developer tool and two shipped Android apps. It is a **constraint with a known solution**, and you already wrote the solution yourself.

**The doctrine, verbatim from your own `AppFlow` repo:**

> "One source of truth for a phone-first Indian indie developer shipping Android apps. Build on a phone with CodeC and an AI agent; use GitHub Actions as the build machine. Keep apps small, offline-first, distinct, respectful, and time-boxed to four weeks."

Everything below is that doctrine, applied.

### 1A.1 The division of labour

| The phone does | The CI runner does |
| -------------- | ----------------- |
| Read, write, commit, push | `npm ci`, TypeScript, ESLint, static export |
| Git, `gh`, PR review, issues, releases | Gradle builds, release APKs, Docker images |
| Python, Node, shell, a local static server | Deployment to Pages / Vercel / Netlify / Render |
| The learning loop: read → attempt → quiz → log | Anything that needs a real Linux userland |

### 1A.2 Why the build *cannot* happen on the phone

Next.js 16's Turbopack and SWC binaries, lightningcss and Gradle's native parts are all compiled against **glibc**. Android is **bionic**. They will not load. There are exactly two honest answers:

1. **Push the build to CI** (recommended, free, and what `AppFlow` says).
2. **Run a glibc userland on the phone** with `proot-distro` + Ubuntu — `bash scripts/termux-build.sh` in this repo does it. It works. It downloads a few hundred MB, it is slow, and it is strictly worse than option 1.

**Rule: never build locally. `git push` *is* the build command.** The only exception is a five-second type check to catch a typo before you push.

### 1A.3 The daily loop, sized for a phone

```
cd ~/Study-with-ai && git pull     # 10 seconds
nano notes/<topic>.md              # write the attempt BEFORE asking
git add -A && git commit -m "What I decided, not what I changed"
git push && gh run watch           # the build is somebody else's job now
$EDITOR journal/$(date +%F)-<slug>.md   # attempt, mistake, fix
```

Full manual on the site: **`/phone`**. Deploy tooling in the repo: `scripts/termux-setup.sh` (one command, installs the Pages workflow and switches Pages on) and `scripts/termux-build.sh` (optional on-device build).

### 1A.4 What this changes about every other decision in this document

- **Every project needs a CI workflow.** A future employer will never open a terminal on your phone, so the run path must be a URL and a button.
- **Every README needs a one-command start.** `git clone && npm ci && npm run dev` — and if that fails on their machine, it fails for them too.
- **Scope is four weeks, not four months.** A phone session is 20 minutes. `AppFlow` already says it; now it is load-bearing.
- **Text is your medium.** Markdown, plain files, one commit per decision. The phone is a text device, and that constraint has made your repository history legible — keep it.
- **The studio ends, the server does not.** Everything you make is deployed and reachable from any phone on any network. That is the whole point.

---

## 1B. The real gap list — five items, ranked by recruiter impact

Not "what a beginner lacks". **What you lack, given what you already have.** The full evidence is in [`GITHUB-AUDIT.md`](GITHUB-AUDIT.md).

### Gap 1 — Legibility (do this first; it is 30 days, not 3 years)

A stranger cannot tell what you have done. Specifically:

- `pabitra27706-oss` has **no profile repository** → your GitHub profile shows a default card.
- `pabi277/pabi277` contains the **untouched GitHub template** (`👀 I'm interested in ...`), unchanged since 2025-06-08.
- `matriq` — your strongest project — has **no live link** in the README, despite shipping a `render.yaml`.
- 10 of your repos have **no description**; 12 have **no licence**; `CodeC`'s description is literally `"9"`.
- `node_modules` is **committed** in `matriq`, `club-web` (46 MB) and `CodeC` (31 MB) — the single most visible sign of an unfinished repo.

**Fix order:** one identity → profile README → live link on `matriq` → descriptions + licences → `.gitignore` and `git rm -r --cached` → READMEs.

### Gap 2 — Automated testing (currently 0%)

Zero tests across 47 repositories. This is the gap that separates "hobbyist who ships" from "engineer who is trusted with a codebase". It is also the cheapest signal to add: three repos with real tests changes how a senior engineer reads your work.

Start with the one that pays for itself: **`matriq`** — the SQL generator is exactly the kind of pure function that is easy to test and expensive to get wrong. One `pytest` file that asserts the generated SQL never drops a table, and the project has a spine.

### Gap 3 — CI/CD (doctrine written, never executed)

`AppFlow` says "use GitHub Actions as the build machine". **Not one workflow file exists in either account.** The plan is not "learn CI" — it is "type the file you already described". This one also unlocks phone-first shipping in general, so it is the highest-leverage single commit in the next month.

### Gap 4 — Collaboration (0 merged PRs)

The one signal that reads as "works with a team" is completely absent. You have 47 repositories and zero contributions to someone else's. Start with docs and tests (easiest to enter), in `TypeScript` and `Python` projects. Target 3–5 merged PRs before the B.Tech applications start.

### Gap 5 — DSA, with a weekly score

The one filter that can still reject you at every interview, and the only item on this list with **no repository at all**. It is also the one you have been avoiding, which is exactly why it is still empty. It does not need a big plan: one LeetCode-style problem a day, a weekly closed-book mock, and a score on this site.

### What is *not* on the list

Java (demoted to Sem 5, for DSA only). Kubernetes. Terraform. System design beyond what `AppFlow` already shows. Any new framework. Any new language. **Your problem is not breadth. It is that your breadth is invisible and your depth is unmeasured.**

---

---

## 2. The market reality (read this part carefully)

### 2.1 The numbers
- **AI is now the #2 most-requested hard skill** in tech job postings — 19.8% of 360,336 postings, behind only communication (23.1%) and *ahead of* Python (18.6%), SQL (11.7%), AWS (11.3%), Java (10.5%) [6](https://www.qarera.com/reports/most-in-demand-skills-2026).
- **65% of tech leaders would choose an AI-enabled developer with 2 years of experience over a non-AI developer with 5 years** [7](https://www.edstellar.com/blog/most-in-demand-skills-in-it).
- Python is the #1 skill in AI-adjacent postings (60% of them), with AI agents at 21%, AWS 18%, SQL 16% [8](https://remoteai.io/articles/ai-skills-in-demand).

### 2.2 The bad news — and why it actually favours you
- **Entry-level postings dropped ~60% between 2022 and 2024.** Explicitly junior roles now sit **under 3% of the market**; senior/cloud-native roles make up about **two-thirds** of openings [9](https://www.nucamp.co/blog/the-junior-developer-hiring-crisis-in-2026-how-to-get-your-first-full-stack-job).
- **~70% of hiring managers believe AI can perform much of the work typically assigned to interns** [9](https://www.nucamp.co/blog/the-junior-developer-hiring-crisis-in-2026-how-to-get-your-first-full-stack-job).
- The rung has been cut out. "I did a course and got a certificate" no longer buys you anything.

**But here's the flip side, and this is your opening:** because grunt work is automated, employers now want juniors who arrive *already capable*. The scarcity is not "people who know nothing" — it's "people who can ship." A diploma student who can show **two deployed full-stack apps, an AI feature, and merged open-source PRs** is a much better bet for a hiring manager than a B.Tech fresher with a syllabus and no proofs [9](https://www.nucamp.co/blog/the-junior-developer-hiring-crisis-in-2026-how-to-get-your-first-full-stack-job).

### 2.3 What a diploma CS graduate actually gets vs. what you should aim for
| Role | Typical pay (India/Kolkata) | Reality check |
|---|---|---|
| Data Entry Operator | ₹9,000–15,000/mo | Avoid. Zero skill compounding. |
| IT Support / Desktop Support | ₹12,000–25,000/mo | Fine as a fallback, but caps your trajectory. |
| MIS Executive | ₹14,000–22,000/mo | Excel-heavy. Not a CS career. |
| Junior Software Developer (local) | ₹20,000–22,000/mo | The realistic diploma-floor role. [10](https://in.indeed.com/q-diploma-computer-science-l-west-bengal-jobs.html) |
| **Full Stack Developer, fresher** | **₹3.2–4.7 LPA (avg ₹4.0 LPA)** | Your realistic target. [11](https://vtricks.in/salary/full-stack-developer-salary-kolkata.html) |
| **Junior Software Engineer, remote** | **₹5–7 LPA** | React + Node + Prisma + Docker/AWS. No degree required. [12](https://www.glassdoor.co.in/Job/remote-github-jobs-SRCH_IL.0,6_IS12563_KO7,13.htm) |
| **Remote AI/Agentic engineer (0–1 yr)** | ₹4.5 LPA+ post-internship | Python, APIs, agents. [13](https://internshala.com/jobs/github-jobs/) |

**Bottom line:** the same diploma gives you ₹12,000/mo at the bottom and ₹6 LPA at the top. **The gap is entirely made of what you build outside the syllabus.** That's exactly what you said you want to do.

---

## 3. The positioning decision (pick one spine)

Three viable routes. I'm recommending **Track A+**, but all three share the same skill stack and portfolio.

**Track A — Skills-first job hunt (start now, whatever your semester).**
Diploma is sufficient for remote junior roles and most startups. Build the portfolio, apply hard from month 3 onward. *Fastest to income, lowest ceiling.*

**Track B — B.Tech Lateral Entry via JELET (West Bengal's own route).**
- WBJEEB runs **JELET** for admission to 2nd year B.Tech. Eligibility: 3-year engineering diploma with **45% aggregate** (40% for SC/ST/OBC/PwD), **West Bengal domicile**, and diploma branch matching the target B.Tech branch [14](https://www.kgec.edu.in/admissions) [15](https://collegedunia.com/exams/jelet).
- JELET 2026 was held 13 June 2026; **JELET 2027 notification is awaited** [16](https://www.myeducationwire.com/latest/jelet-2027/). Expect ~June 2027.
- You get a full B.Tech in **3 more years** instead of 4, from WB government colleges (KGEC Kalyani, JGEC Jalpaiguri, GCETTS Serampore, JISCE, GNIT, etc.).
- *Slower to income, much higher ceiling — unlocks campus placements, higher salary bands, and eligibility for master's.*

**Track C — AI/ML specialisation.** Highest ceiling, highest risk for a diploma student without a degree. Best entered *after* A or B, not instead of.

> **My recommendation: Track A + Track B together.**
> Start Track A immediately (portfolio + apply from month 3). Sit JELET 2027 if your semester maths works out and you want the degree. A job + a JELET rank are not mutually exclusive, and the degree becomes a *credential upgrade* rather than a *four-year delay*.
>
> ⚠️ **One check for you:** the WB rule says "Diploma branch must correspond to the target B.Tech branch" in some colleges, and "Often yes (e.g., Mech diploma → CSE lateral)" in others [17](https://findurcollege.com/direct-second-year-btech). Verify that **CST → CSE lateral entry is allowed at the specific colleges you target** before you invest in JELET prep. Ask your college office — this is a 5-minute question that saves 3 months.

---

## 3A. The JELET track, in detail

Because you chose this as your spine, here is everything you need, precisely.

### 3A.1 The exam
**JELET (Joint Entrance Examination for Lateral Entry)**, conducted by WBJEEB. Offline, OMR-based, pen-and-paper, **medium: English**, **2 hours (11:00 AM–1:00 PM)**. No re-exam. [JELET 2026 bulletin](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf) [WBJEEB](https://wbjeeb.nic.in/jelet/)

**Paper I** (for Diploma in Engineering/Technology candidates — that's you):

| Subject | Cat-1 Q (1 mark, −0.25) | Cat-2 Q (2 marks, partial credit) | Total Q | Total marks | % of paper |
|---|---|---|---|---|---|
| Mathematics | 30 | 10 | 40 | 50 | **41.7%** |
| Physics | 25 | 5 | 30 | 35 | **29.2%** |
| Chemistry | 15 | 5 | 20 | 25 | **20.8%** |
| Fundamentals of Electrical & Electronics Engineering | 10 | 0 | 10 | 10 | 8.3% |
| **Total** | **80** | **20** | **100** | **120** | 100% |

**Category 2 scoring** (the one to understand): mark *all* correct options → +2. Mark only some correct options and no wrong ones → partial credit (2 × correct marked ÷ total correct). Mark even one wrong option → **0**. No negative marking on Cat-2. So in Cat-2, a wrong extra option costs you everything — precision beats guessing.

**Tie-breaking order** (useful if two candidates tie): fewer negative marks → more positive Maths marks → fewer negative Maths → more positive Physics → fewer negative Physics → more positive Chemistry. **Note that Mathematics dominates the tie-break.** Another reason Math is your #1 subject. [JELET 2026 bulletin](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf)

**Syllabus, in short:**
- **Maths:** Matrices & determinants (up to order 3), Complex numbers, Coordinate geometry (2D), Vector algebra, Differential calculus, Applications of derivatives, Partial differentiation, Integral calculus, Ordinary differential equations, Probability, Statistics (central tendency & dispersion), Sets/relations/functions, Permutations, Logarithms [JELET syllabus](https://admission.aglasem.com/wbjee-jelet-syllabus/) [Careers360](https://engineering.careers360.com/articles/jelet-syllabus)
- **Physics:** Laws of Motion, Work/Power/Energy, Rotational Motion, Thermodynamics, Solid & Liquid properties, Oscillations & Waves, Electrostatics, Current Electricity, Magnetism, EMI & AC, Modern Physics (atoms, nucleus), Semiconductor physics, Optics [sib](https://www.shiksha.com/engineering/wbjee-jelet-exam-syllabus)
- **Chemistry:** Atomic structure, Chemical bonding, Thermodynamics, Equilibrium, Redox, s/p/d/f-block, Coordination compounds, Organic basics, Alcohol/Phenol/Ether, Carboxylic acids, Chemical kinetics, Ionic equilibrium [sib](https://www.shiksha.com/engineering/wbjee-jelet-exam-syllabus)
- **FEEE:** Basic electrical quantities, Ohm's & Kirchhoff's laws, DC/AC circuits, series-parallel, Thevenin/Norton, transformers, AC sources, electrical machines, analogue & digital electronics [sib](https://www.shiksha.com/engineering/wbjee-jelet-exam-syllabus)

**Note what this means for you:** almost none of it is Computer Science. It is **Class 10–12 science + first-year diploma engineering + digital electronics.** Your CST syllabus's Digital Electronics / Microprocessor units map directly onto FEEE — that's your 8.3%. Everything else is Maths, Physics and Chemistry.

### 3A.2 Eligibility (the hard gate)
- 3-year diploma in Engineering/Technology, **≥45% aggregate** (40% for SC/ST/OBC/PwD) [bulletin](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf)
- Diploma in **any** branch of Engineering & Technology per the AICTE Approval Process Handbook [bulletin](https://wbjeeb.in/wp-content/uploads/2024/02/2024020274-1-jelet-2024.pdf)
- **No upper age limit** for diploma holders [MyEducationWire](https://www.myeducationwire.com/latest/jelet-2027-eligibility-criteria/)
- **West Bengal domicile** required for the counselling/document stage (domicile certificate is in the mandatory documents list for admission) [seat allotment notice](https://admittanceedutech.in/wb-jelet-round-3-counselling-2026/)
- **No minimum score is needed to get a rank** — everyone who appears gets a General Merit Rank. The 45% is the only exam-side filter, and it's applied at *application* time [Collegedunia](https://collegedunia.com/exams/jelet/results)
- **Jadavpur University specifically** requires **60%** (45% reserved) for lateral entry [FindMyCollege](https://findmycollege.com/exam/jelet/eligibility) — worth knowing given you're in Jadavpur.

### 3A.3 Your timeline
| Milestone | Expected date | Your action |
|---|---|---|
| JELET 2026 (reference cycle) | Exam 13 Jun 2026 · Result 14 Jul 2026 · Counselling Aug–Oct 2026 | Study the pattern + previous-year papers |
| **JELET 2027** | Notification ~Mar 2027 · Apply ~Mar–Apr 2027 · Exam ~Jun 2027 | **Not your cycle** (diploma not complete) — but use the 2027 paper as your first full mock |
| **JELET 2028** | Exam ~Jun 2028 | Not your cycle either |
| **JELET 2029** | Exam ~Jun 2029 | ⚠️ **Your target** — provisional application if you're appearing in the final semester |
| **JELET 2030** | Exam ~Jun 2030 · Counselling ~Jul–Oct 2030 | Your confirmed-admission cycle |

Application windows have been consistently **~4 weeks** (2026: 19 Mar – 11 Apr; exam 13 Jun) and the exam has been in **June** for two years running [WBJEEB](https://wbjeeb.nic.in/jelet/) [MyEducationWire](https://www.myeducationwire.com/latest/jelet-2027/). JELET 2027's notification was still pending as of 1 September 2026 [MyEducationWire](https://www.myeducationwire.com/latest/jelet-2027/), so treat these as patterns, not promises — **watch wbjeeb.nic.in from February 2029 onward.**

**→ So: your first JELET attempt is ~3 years away. That is a gift, not a wait. Use it.**

### 3A.4 The three things that actually decide your JELET outcome
1. **The 45% diploma aggregate.** You have four semesters left (Sem 3–6). Your WB diploma exams are theory-heavy (typically 60 theory + 10 continuous assessment + 10 assignment/viva per 3-credit subject, per the WB format [WBTESD](https://polytechnic.wbtetsd.gov.in/polytechnic/college/download_file/184260348236f9554fe9375772ff966e/1731949424.pdf)). **Aim for 55–60% to be safe**, and treat every subject's internal as a real exam. Track your running aggregate in your journal every semester. This is the #1 thing that can kill the plan, and it's fully in your control.
2. **Mathematics.** 41.7% of the paper *and* it dominates tie-breaking. Calculus + matrices + vectors + probability is the whole game.
3. **Physics.** 29.2%, and it has the highest question density. Physics also has the best free-resource ecosystem (MIT OCW, Khan Academy, 3Blue1Brown, Physics Wallah-style free content) — and it maps onto your FEEE prep.

### 3A.5 The preparation method (this is where your AI system earns its keep)

**The loop from `LEARNING-JOURNEY.md` §6.1, applied to Maths/Physics/Chem:**

1. **Prime** — Before studying a chapter, write 3 prequestions: "What is the derivative of a product?", "Why does a series diverge?", "What does Ohm's law not explain?" Prequestions lift learning of that content by g = 0.66 [meta-analysis](https://studycardsai.com/blog/active-recall-statistics).
2. **Probe** — Study the chapter from an English source (textbook + video). Pause every 8 minutes, close it, write what you remember and a question you now have.
3. **Point** — Now use the AI. Paste your attempt first. The AI must ask before it tells (§6.5 of the learning doc). This is the non-negotiable rule: **unguarded AI left students 17% worse on an unaided exam** [Bastani, PNAS](https://www.pnas.org/doi/10.1073/pnas.2422633122).
4. **Attach** — Ask the AI to connect the new concept to your existing notes and to a real physical or numerical example. Then **solve 3 problems from the previous two JELET papers on that chapter, unaided, timed.**
5. **Strengthen** — AI generates MCQs in the *exact JELET format* (Cat-1 single-correct with −0.25, Cat-2 multiple-correct with partial credit). You answer. AI grades with the real marking scheme, so you internalise the penalty. **This is the single highest-value use of the AI in your entire plan** — it turns a 1-in-1000 candidate into someone who has seen 500 JELET-format questions.
6. **Test** — Cards into Anki/FSRS (formulas, conditions, traps). Weekly closed-book, no-AI mock of a full 100-question Paper I under 2 hours, with the real marking scheme.

**JELET-specific additions:**
- **Solve the previous 10 years' papers, in JELET format, timed.** Nothing else comes close for pattern recognition.
- **Negative marking is a strategy question.** At −0.25 per wrong Cat-1 answer, guessing on a question you have 25% confidence on is roughly break-even. Train yourself to *skip* Cat-1 questions you're unsure about, and to mark *only* options you're sure about on Cat-2 (because one wrong option zeroes the whole question).
- **Keep a "JELET traps" note** — the recurring tricks in the paper (e.g., matrix order-3 limits, unit conversions in FEEE, ionic equilibrium approximations). Review it every week.
- **Read the English question paper carefully.** The exam is in English and many of your instincts will come from a Bengali-medium or Hindi-medium schooling. English comprehension in exam conditions is a *skill you can train* — do it deliberately.

### 3A.6 A 2029 decision checkpoint
Write this in your journal now, and revisit it in **February 2029**:
> *"If my diploma aggregate is ≥45%, I will appear for JELET 2029 provisionally. If I am below 45% in Sem 5 results, I will skip JELET, go straight into the job market with my portfolio, and reconsider MCA/BCA later as a part-time route."*

Having the decision rule written in advance stops you from making an emotional choice in a high-stakes week.

### 3A.7 You already have the archive — now turn it into an instrument

`Jelet-prep` (2026-06-04) is **not** an empty repo. It contains:

- `syllabus.md` — the complete JELET-2026 syllabus, matching the official Information Bulletin of 18 March 2026 (Maths 40 Q / 50 M, Physics 30 Q / 35 M, Chemistry 20 Q / 25 M, FEEE 10 Q / 10 M; Cat-1 +1/−0.25, Cat-2 +2 all-correct with partial credit and no negative).
- `pyq-md/` — **2017, 2018, 2019, 2021, 2022, 2024, 2025** transcribed with LaTeX.
- `pyq-index.html` — marked + MathJax rendering.

It has **two commits** and stopped on 4 June 2026 — the week the 2026 exam was written. It was **abandoned, not finished**, and the reason is the classic one: an archive is satisfying to build and produces no score, so there is no feedback loop to keep going.

**The missing half is instrumentation, not content.** Three additions, in this order:

**1. A scoring engine that reproduces the official rule.**
100 questions, 120 marks, 2 hours, OMR, English. Cat-1: 80 × (+1 / −0.25). Cat-2: 20 × (+2 if all correct options marked, partial credit if no wrong option, zero if any wrong option). Then apply the **official tie-break chain**: fewest negatives → Maths → Physics → Chemistry. A score without the tie-break is a score you cannot compare to a rank, and rank is the only thing that matters for a 9-seat programme.

**2. A forced error log.**
Every wrong answer must be tagged with *why*: `concept` (did not know it) · `careless` (knew it, slipped) · `misread` (bad question reading) · `time` (ran out of clock). Without this, 500 practice questions produce zero learning. With it, 200 produce thirty specific fixes. This is the same discipline as the journal in this repo — a spreadsheet, not a journal.

**3. A topic heat map ranked by *marks recoverable*, not by accuracy.**
A topic where you sit at 60% on 35 marks is worth more than one where you sit at 90% on 10. Sort by `weight × (1 − accuracy)`, not by accuracy. That single change is usually worth 8–15 marks on a 120-mark paper, and 8–15 marks is the difference between GMR 30 and GMR 15.

**Why this matters more than you think:** JU CSE lateral has **9 seats** and closes around **GMR 9–55** (see §3B). At 120 marks, the difference between rank 15 and rank 40 is roughly 12 marks. These three features are the 12 marks.

**Weekly rhythm:** 2 MCQ blocks (target 40 questions) · 1 full mock every Sunday, timed, closed-book · Sunday review = error-log classification only, no re-reading · re-mock the same weak topics in 7 days (spacing, d ≈ 0.85).

**No AI inside the mock runner.** It is a measuring instrument, and an instrument that helps you cheat measures nothing. AI is allowed in the *review* step, and only after you have written your own attempt — the same rule that protects this repository.

---

## 3B. The Jadavpur University CSE target — the exact seat you're aiming at

You named the target. Let's make it precise, because "Jadavpur University CS" is not one thing — it's **one seat with 9 people fighting for it**.

### 3B.1 The facts

| | Detail | Source |
|---|---|---|
| **Route** | JELET → 2nd-year B.E./B.Tech (Lateral) at JU, via WBJEEB centralised counselling | [JU brochure](https://admissionju.jadavpuruniversity.in/fengadmission/frontend/upload/brochure/jelet_admission.pdf) |
| **Seats at JU (all branches)** | **150** lateral-entry seats across all JU B.Tech programmes | [Telegraph India](https://www.telegraphindia.com/west-bengal/kolkata/ju-reverses-decision-on-jelet-admissions-allowing-diploma-holders-with-online-classes-prnt/cid/2137208) |
| **JU CSE lateral seats (2026 matrix)** | **9** — listed as *"Computer Science & Engineering / Computer Science & Technology"* | [JELET 2026 seat matrix](https://engineering.careers360.com/articles/jelet) |
| **Your eligibility bar** | **60% diploma aggregate** (45% for SC/ST/OBC-A/OBC-B/PwD) | [JELET 2026 bulletin](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf) |
| **Quota** | **90% Home State / 10% All India** — WB domicile required even for general-category seats | [JU admission page](https://collegedunia.com/university/26008-jadavpur-university-ju-kolkata/admission) |
| **Branch match** | ✅ **Your CST diploma is explicitly named in the JU seat matrix** for the CSE seat | [JELET 2026 seat matrix](https://engineering.careers360.com/articles/jelet) |

**That last row is the good news: CST → JU CSE lateral is explicitly allowed.** You don't have to argue it with the college office.

### 3B.2 How competitive is it, actually?

This is the number you need in your head:

| JU lateral seat | JELET closing rank (Home State) |
|---|---|
| **CSE / CST (BE Lateral)** — **9 seats** | **Round 1 closing rank: 9** (2026) — i.e. it fills on merit, well before the branch-average cut |
| CSE expected UR closing (prediction) | **30–55** (2026) |
| JU B.Tech Lateral — **all branches** (150 seats) | **74 (2026)**, 107 (2025), 46 (2024) |
| JU Civil (17 seats) | 129–1,614 | 
| JU Electrical (16 seats) | 236–472 |
| JU IT (9 seats) | 320–582 |

Sources: [Collegedunia JU cutoff](https://collegedunia.com/university/26008-jadavpur-university-ju-kolkata/cutoff) · [FindMyCollege JELET cutoff trends](https://findmycollege.com/exam/jelet/cutoff) · [JELET 2026 expected cutoffs](https://collegedunia.com/articles/e-553-jelet-2026-cutoff-previous-year-rank-trends-and-2026-prediction) · [Pagalguy JU round-1 ranks](https://www.pagalguy.com/colleges/jadavpur-university-kolkata)

**Read that table carefully:** CSE at JU closes around rank **9–55**. That is the **top 1% of a state-level engineering entrance.** For comparison, JU's *regular* WBJEE 1st-year CSE closing rank is 238 — lateral entry into the *same department, same course, same university* is **4–25× more competitive**, because the applicant pool is all of WB's diploma students and the seat count is 9.

### 3B.3 Translating a rank into a score — your actual target number

JELET Paper I is 120 marks. To land in the top ~50, you need roughly:

> **Target score: 95–105 out of 120 (≈80–88%)**
> **Stretch target for CSE specifically: 105–112 (≈88–93%)**

Work it out yourself, per subject, and track it every week:

| Subject | Marks | Target for ~100/120 | Target for ~110/120 (CSE) |
|---|---|---|---|
| Mathematics | 50 | 40 (80%) | 45 (90%) |
| Physics | 35 | 28 (80%) | 32 (91%) |
| Chemistry | 25 | 20 (80%) | 22 (88%) |
| FEEE | 10 | 8 (80%) | 9 (90%) |

**80% in every subject is the baseline. Maths is the tie-breaker, so a 45/50 in Maths beats a 42/50 + 4 extra elsewhere.** [bulletin tie-break](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf)

### 3B.4 Your academic position — you're already past the hard gate

| Gate | Requirement | You | Status |
|---|---|---|---|
| Madhyamik (Class 10) | — | 88.17% | Comfortable (not used by JELET, but it says something about your baseline) |
| HS (Class 12) | — | 80% | Comfortable; also keeps WBJEE-based 1st-year JU open as a fallback (JU 1st-year CSE needs 60% in PCM) [JU eligibility](https://collegedunia.com/university/26008-jadavpur-university-ju-kolkata/admission) |
| **Diploma aggregate** | **60% at JU** | **9.3 GPA in 1st year** | ✅ **Already clear** — if 9.3 is on a 10-point scale, that's ~93% |

**Two things follow:**

1. **You already pass the only hard eligibility gate.** JU's 60% is *higher* than everyone else's 45%, and you cleared it in year one. The remaining challenge is **purely the exam rank**, which is a pure skills problem — and skills problems are what the AI learning system is for.
2. **Don't get complacent.** Your cushion is large *now*. The risk isn't that you'll suddenly drop below 60% — it's that polytechnic theory papers (Microprocessor & Microcontroller, Theory of Automata, AI/ML in Sem 5–6) are hard and the aggregate is computed over all six semesters. **Target 70%+ overall and track your running aggregate every semester.** Keep a cushion of 10+ points, not 33.

### 3B.5 The one thing that could cost you the seat (and it isn't the exam)

**JELET has no re-exam.** And **CSE at JU is 9 seats.** So the plan needs a *tiered* college list, not a single target. Build this list in the counselling portal in priority order:

| Tier | Target | Why |
|---|---|---|
| **A** | **JU CSE (9 seats)** | Your stated dream. Needs GMR ≲ 40, ideally ≲ 20. |
| **B** | JU B.Tech Lateral, other branches | Same university, same degree brand. *But check branch correspondence — JU requires the diploma to be "in the relevant branch" [JU brochure](https://admissionju.jadavpuruniversity.in/fengadmission/frontend/upload/brochure/jelet_admission.pdf), and a CST diploma may not qualify for JU IT/ECE.* **Ask.** |
| **C** | Other WB government engineering colleges with CSE/IT lateral seats (KGEC, JGEC, GCETTS Serampore, MAKAUT, and similar) | Same WB govt degree, same JELET rank, far better odds. A WB govt B.Tech is a genuine degree at a fraction of the private-college cost. |
| **D** | Self-financing WB engineering colleges | Backstop. Still a B.Tech from an AICTE-approved institute. |
| **E** | **The job market with your portfolio, no degree at all** | This tier is *always* open, and by Sem 6 you will have a portfolio that beats most B.Tech graduates. Never leave this tier empty. |

**A note on Tier E, because it's underrated:** a strong diploma + a strong portfolio + 5 merged open-source PRs is a completely legitimate path to the same junior-developer jobs. JU is the better *credential*, but it is not the only door. Don't let Tier A become a reason to neglect Tier E.

### 3B.6 One structural risk to watch for
In late 2025, JU **temporarily blocked** JELET lateral entry and then **restored it**, and for the delayed 2025–26 cycle it required JELET students to complete **online bridging coursework** (via central government learning platforms) to cover the 2nd-year syllabus they had missed [Telegraph India](https://www.telegraphindia.com/west-bengal/kolkata/ju-reverses-decision-on-jelet-admissions-allowing-diploma-holders-with-online-classes-prnt/cid/2137208). That was a one-off caused by the exam-delay backlog — **not** a permanent rule. But it teaches you to **read the JELET Information Bulletin each year** rather than relying on last year's rules. The bulletin is published on [wbjeeb.nic.in](https://wbjeeb.nic.in/jelet/) around Feb–March. **Read the 2029 bulletin when it appears, and check for changes to JU's 60% rule and seat matrix.**

---

## 4. The stack: what to learn (and what to ignore)

### 4.1 The decision
Your syllabus is Java-first. The 2026 market is **JavaScript/TypeScript-first for junior full-stack roles**, with **Python-first for AI roles**. Both are defensible. Pick one primary and one AI layer:

> **Primary stack: TypeScript across the whole stack (Next.js/React + Node/Express + PostgreSQL).**
> **AI layer: Python (FastAPI + LLM APIs + RAG).**
> **Keep Java for DSA practice and as a fallback for enterprise roles** (Java is still 10.5% of postings [6](https://www.qarera.com/reports/most-in-demand-skills-2026), and it's what your syllabus already gives you).

Why TypeScript-primary: React appears in 43.2% of full-stack postings, JavaScript 34.7%, TypeScript 28.2% [6](https://www.qarera.com/reports/most-in-demand-skills-2026); the remote junior roles explicitly asking for "no degree required" list React, TypeScript, Node, Postgres, Docker, cloud [4](https://www.remoterocketship.com/country/india/jobs/junior-backend-developer/). One language across frontend + backend + AI tooling means one language to learn deeply instead of four shallowly.

**Full-stack posting share of individual skills** [18](https://interviewstack.io/blog/fullstack-developer-skills-companies-want-2026):

| Skill | Share of full-stack postings | Skill | Share |
|---|---|---|---|
| React | 54.1% | SQL | 35% |
| TypeScript | 45.2% | APIs | 34.3% |
| CI/CD | 42% | Python | 33.5% |
| JavaScript | 41.5% | Java | 32.8% |
| AWS | 39.9% | Node.js | 31.1% |

### 4.2 The stack, in layers — with what your syllabus already gives you

| Layer | Learn | Syllabus credit |
|---|---|---|
| **Language** | TypeScript (primary), Python (AI) | Java (scripting languages elective — Python is in your syllabus) |
| **Frontend** | React, Next.js, Tailwind | — (Web Technology is Sem 6) |
| **Backend** | Node.js + Express, REST APIs, auth | — |
| **Database** | PostgreSQL + Prisma, basic SQL | **DBMS — already in your syllabus. Free.** |
| **DevOps** | Git, Docker, CI/CD, deploy | **Software Engineering — free.** |
| **Cloud** | AWS free tier (or GCP), deploy a real app | — |
| **AI** | LLM APIs, RAG, agents, evals, MCP | **Fundamentals of AI elective — partial credit** |
| **Core CS** | DSA, Networks, OS | **All three already in your syllabus. Use them for interviews.** |
| **Practice** | English communication, GitHub, writing | — |

### 4.3 What to deliberately ignore for now
- **Java Spring Boot, .NET, Angular, PHP/WordPress** — real jobs exist, but they'd split your attention three ways.
- **System design, Kubernetes, Terraform** — real, but premature. Come back in year 2.
- **A second programming elective** — you already have Python and Java. Add TypeScript, not more languages.
- **Paid bootcamps.** Free + a portfolio beats them.

### 4.4 When to start each layer (sequenced for a beginner)

You are at the start. Do **not** open all these doors on day one. This is the order, with the reason:

| When | Open this | Why then |
|---|---|---|
| **Now (Sem 3)** | Python (or C, whichever your college teaches first) · **Git/GitHub properly** · Maths & Physics depth · English technical reading | These four are the load-bearing walls. Git especially: you are using it *right now* and most students never learn it properly, and it's on every job listing. |
| **Sem 3–4** | The learning system in this repo, fully working (AGENTS.md contract, Anki pipeline, weekly closed-book tests) | It is your own tooling. Everything you learn afterwards gets captured by it. Building it early is leverage. |
| **Sem 4** | JavaScript basics → **Node.js + Express** · **SQL/PostgreSQL** (your DBMS course makes this fast) · Docker · first deployed app | The backend + database is where a diploma student can realistically ship something real. |
| **Sem 5** | **TypeScript** → React/Next.js · GitHub Actions (CI/CD) · AWS free tier deploy · open-source PRs begin | Frontend + CI/CD + cloud is what turns a project into a portfolio piece. |
| **Sem 5** | **Python + LLM APIs** → RAG → evals → agents/MCP | The AI layer. Come to it *after* you can build a boring app properly, or you'll ship a demo instead of an application. |
| **B.Tech year 1–2** | System design, Docker deeper, Kubernetes basics, Terraform, more cloud | Come back to these once you've shipped and maintained something real. |
| **Job-hunt year** | DSA to interview standard, SQL, system design lite, English communication | Only now do interview-prep skills pay off — you need a portfolio to be worth interviewing for. |

**The one thing to internalise:** the order above is roughly *decreasing urgency, increasing payoff*. Foundations are urgent but invisible on a resume. The AI layer is visible but worthless without the foundations. You have three and a half years — use them in that order and you will not be the beginner who "learned React in 3 weeks" and still can't write a SQL query.

---

## 5. The AI-native layer — this is your actual edge

Since ~84% of developers use AI coding tools weekly or daily [19](https://www.nucamp.co/blog/most-in-demand-full-stack-skills-in-2026-react-node-typescript-and-beyond) and 26.5% of full-stack postings explicitly require new-wave GenAI skills [20](https://interviewstack.io/blog/how-ai-is-changing-fullstack-developer-2026), **"I can work with AI agents and ship" is now a job requirement, not a bonus.**

**The specific skills to acquire (these are the ones in postings):**
1. **Working with coding agents** — Claude Code / Codex / Cursor / Copilot. You're already doing this in this repo. Learn to *delegate, review, and verify* — not just prompt.
2. **LLM API integration** — streaming, tool/function calling, structured output, error handling, cost control.
3. **RAG** — chunking, embeddings, vector search, **citations** (source grounding is what makes it trustworthy rather than a hallucination generator).
4. **Agents & MCP** — agent orchestration, Model Context Protocol, tool design.
5. **Evals & guardrails** — how do you know the AI feature is correct? This is the single most underrated skill and it separates hobbyists from engineers.
6. **Prompt design** — as a discipline, not a trick: context, constraints, failure modes.

**The interview angle nobody prepares you for:** they will ask *"how did you use AI in this project?"* — and most candidates will say "I used Copilot." The strong answer is: *"I built the feature with an agent, but I wrote the tests first; the agent's output had 3 failures on my test suite that I had to fix; I rejected its caching suggestion because it would have broken freshness guarantees."* **Build that story deliberately.**

**And the learning rule from our earlier research still applies to code:** attempt first, then compare. See `LEARNING-JOURNEY.md` §3 for the evidence — a plain ChatGPT-style workflow left students **17% worse** on unaided exams, and self-regulated "ask AI when stuck" lost more than half the gains vs. system-initiated help [21](https://www.pnas.org/doi/10.1073/pnas.2422633122) [22](https://ssrn.com/abstract/5604932).

---

## 6. The portfolio architecture (rewritten: you already have most of it)

> **Rewritten 28 Oct 2026 after the GitHub audit.** The old version of this section said "you need to build four repos from scratch". That is wrong now. You have **12 original repositories**, a shipped AI product, two shipped Android apps, a 3-star developer tool, a 7-year JELET archive, a 15-module textbook and two live sites. The job is no longer *building* the portfolio. It is **(a) making it legible** and **(b) adding the three pieces of evidence a portfolio is missing: tests, CI, and collaboration.**

**The new build order is:** Legibility (30 days) → CI in every repo → tests in `matriq` → 3 merged PRs → then the *new* repos, in this order:

| Order | What | When | Why this order |
| ----- | ---- | ---- | -------------- |
| **Now** | **Legibility pass** | 30 days | Cheapest ROI in the whole plan. One identity, profile README, live link on `matriq`, descriptions, licences, `.gitignore`, un-commit `node_modules`. |
| **Now** | **CI in every repo** | with the legibility pass | Your phone cannot build. Without a workflow, half your portfolio is unrunnable for anyone else. |
| **Now** | **Tests in `matriq`** | Sem 3 | The SQL generator is a pure function — trivial to test, expensive to get wrong. This is the gap that reads as "engineer". |
| **Sem 4** | **Repo 4 — open source (3–5 merged PRs)** | from Sem 4 | The only signal that reads as "works with a team". Currently zero, and the only way to fix zero is to start. |
| **Sem 5** | **Repo 2 — a deployed full-stack app with auth + Postgres + tests + Docker** | Sem 5 | You have SQLite and Firebase. You do not have migrations, auth, or a real relational schema. That gap is exactly what a backend interview probes. |
| **Sem 6** | **Repo 3 — the AI-native one, with `evals/`** | Sem 6 | `matriq` proves you can build AI. It does **not** prove you can *measure* AI. An `evals/` folder with a test set, a scoring method and before/after numbers is what turns "uses AI" into "engineers AI". |

### What you already have — the honest portfolio list

| Repo | Proves | Status |
| ---- | ------ | ------ |
| `matriq` / **InsightAI** | Full-stack AI product: NL→SQL over 1M rows, dynamic charts, KPI cards, injection guards, `render.yaml` | Shipped, **no live link** |
| `CodeC` | Phone-based developer tooling; 3★ organic adoption | Shipped |
| `Tilefold` (2048-game) | End-to-end Android shipping from a phone | Shipped, MIT |
| `Day Ledger` | A repeatable pipeline — the same doctrine, a second app | Shipped, MIT |
| `AppFlow` | Process design: phone-first indie shipping doctrine | Shipped |
| `Jelet-prep` | Rigorous research + LaTeX transcription across 7 exam years | Shipped, needs instrumentation |
| `Termux-Mastery` | Technical teaching; a 15-module textbook | Shipped, 1★ |
| `portfolio` (live) | Information architecture, static-site design | Shipped, live |
| `CoderAnimeMe` (live) | Building in public, keeping a public surface alive | Shipped, live |
| `Diploma-2nd/3rd-sem` (1★ each) | Serving an audience of students in your own stream | Shipped |
| `Study-with-ai` (this repo) | Agentic AI product design with a hard human-in-the-loop boundary | Live |
| Open-source PRs | Collaboration in someone else's codebase | **0 — the biggest single gap** |

### Repo 1 — `Study-with-ai` (this one). **Your AI learning agent.**Turn this repo into a working system: spaced-repetition cards generated from your own notes, Socratic questioning, weekly closed-book tests, a human-owned journal layer. Document the AI-safety design in the README (guardrails, the "attempt first" rule, the human-owned layer).
> **Why this is repo #1 and not a toy:** it demonstrates agentic AI design, retrieval, scheduling, evaluation, and careful human-in-the-loop product thinking — in the exact domain you understand. It's also genuinely useful to you. One repo, two returns.

### Repo 2 — A deployed full-stack app solving a real problem for real users.
Pick a problem you personally understand: college attendance & study timetable, a second-hand textbook marketplace for WB students, a mess/hostel expense tracker, a local-language study assistant for your classmates.
**Non-negotiables (this is what hiring managers check):** real auth, real database with migrations, a real API, a real deployed URL, tests, CI on every push, Docker, a proper README with architecture and a screenshot, and a `LICENSE`.
> Pick something your classmates will actually use. Usage = a demo you can put in a video call.

### Repo 3 — An AI-native product (your differentiator).
Extend Repo 2, or build fresh: a RAG assistant over your course materials/PDFs **with clickable citations to the exact page**, an agent that automates something real, or a study-tutor with genuine mastery tracking.
**This is the repo that makes you "AI-enabled" rather than "uses AI."** Include an `evals/` folder showing you measured output quality.

### Repo 4 — Open source contributions (3–5 merged PRs).
Not your own repo — *merged into someone else's*. This is the signal that reads as "works with other people," which is what a team needs. Start with small fixes: docs, tests, typo fixes, then a real feature.
**Where to start:** `good first issue` labels on beginner-friendly projects; the projects you already use; repos whose maintainers respond to PRs. Target: a Python or TypeScript project with an active issue tracker.

### The resume block (copy this structure)
```
PROJECTS                                    ← above Education, always
  Study-with-ai — AI study agent (TypeScript, Postgres, LLM APIs, RAG)  → live link
  <App name>   — <one line problem it solves>  → live link + demo video
  Open source — N merged PRs in <project>  → link

SKILLS
  TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, Git/GitHub,
  Python, FastAPI, LLM APIs, RAG, agents/MCP, AWS | DSA, DBMS, Networks, OS
```
> A good detail: recruiters and the nucamp guidance both note that the Projects section should sit **above** Education for exactly your situation [23](https://www.nucamp.co/blog/top-10-tech-jobs-that-don-t-require-a-degree-in-india-in-2026).

---

## 7. The semester-anchored plan (Sem 3 → Sem 6 → JELET → B.Tech → job)

### 7.0 The shape of the next 3.5 years

| When | Your job | Big deliverable | JELET weight |
|---|---|---|---|
| **Now → Sem 3 end** (~3 months) | Foundations: one language, Git, Maths/Physics depth, the learning system | **Repo 1 working** (this repo, with AGENTS.md + Anki + weekly test) | Maths + Physics |
| **Sem 4** (~2027-28) | Your core CS subjects *properly* (DSA, DBMS, Networks, OS) + first backend | First **deployed** app with a real database | Physics + Chem |
| **Sem 5** (~2028-29) | **Summer Internship (SI301)** + TypeScript/React + CI/CD + open source | 2nd deployed app + 2 merged PRs + internship letter | Full mock papers |
| **Sem 6** (~2029-30) | JELET preparation + AI-native project + diploma aggregate defence | **JELET** + Repo 3 (AI project) + full portfolio | **The exam** |
| **B.Tech Yr 1–2** (2030-32) | System design, deeper DevOps, more open source, English polish | 5 merged PRs, 2 strong deployed apps, AI feature | — |
| **B.Tech Yr 2–3** (2032-33) | **Job conversion**: apply, interview, internship, convert | **Your first job** | — |

### 7.1 Now → end of Sem 3: the foundations quarter

**This quarter has one job: build the machine that will capture the next 3.5 years.** Everything else is secondary.

*Week 1-2 — remove friction:*
- [ ] Claim the **GitHub Student Developer Pack** (education.github.com/pack) — GitHub Pro, Codespaces, MongoDB $50 + free certification path, DigitalOcean, Heroku [24](https://creditforstartups.com/students/cloud-credits-for-students) [25](https://spca.education/free-tech-giant-services-for-students-certification-guide/)
- [ ] Check Copilot / AI-credit eligibility in the pack (terms changed in 2026 — verify on the live page) [26](https://builder.aws.com/content/3IUXtk3cJbrpRXiG1Y3wenPstPI/free-premium-tech-every-student-should-claim-in-2026-a-verified-guide)
- [ ] Apply for **Google AI Plus free for 12 months** (Indian college students 18+, redeem by 31 Dec 2026) — **set a calendar reminder, it auto-renews** [27](https://mylingasia.com/posts/best-ai-tools-students-india-2026). Jio ₹349+ 5G users: 18 months Gemini AI Pro free via MyJio [27](https://mylingasia.com/posts/best-ai-tools-students-india-2026)
- [ ] Install: Git, VS Code, Python, Anki (FSRS), Node.js, Docker, Ollama
- [ ] Ask the college office the two JELET questions (§0) and **write the answers in your journal**
- [ ] **Download the JELET Information Bulletin from [wbjeeb.nic.in/jelet](https://wbjeeb.nic.in/jelet/)** and read the eligibility + seat matrix pages. This is your exam's rulebook; re-download it every year — JU changed its lateral-entry policy once already [Telegraph India](https://www.telegraphindia.com/west-bengal/kolkata/ju-reverses-decision-on-jelet-admissions-allowing-diploma-holders-with-online-classes-prnt/cid/2137208)
- [ ] **Start tutoring this week** (§8A.1): find 2 students — one Class 10, one Class 11–12 — Maths and Physics. ₹250–400/hr to start. Build your teaching kit in `teaching/`
- [ ] Find your **college SPOC** for Smart India Hackathon — you're a Sem 3er; the SIH 2027 internal round is ~Aug–Sept 2027, and you need to build a team of 6 + a mentor over a year [SIH](https://thenewviews.com/smart-india-hackathon/)

*Week 3-8 — the learning machine (Repo 1):*
- [ ] Create the folder structure: `raw/ notes/ journal/ cards/ projects/` + `AGENTS.md`
- [ ] Write your **agent contract** (the 10 rules from `LEARNING-JOURNEY.md` §6.5) into `AGENTS.md`
- [ ] Set up the **Anki/FSRS pipeline**: transcript → AI-drafted cards → you curate → deck. Cap the deck; one third of AI cards survive curation [card-quality discussion](https://www.reddit.com/r/Anki/comments/1mewr8p/problem_with_aigenerated_flashcards/)
- [ ] Run the **weekly closed-book test** — no AI, no notes, 45 min, every Sunday
- [ ] Set up the **JELET MCQ generator prompt**: AI produces Paper-I-format questions from your chapter, with the real Cat-1/Cat-2 marking scheme
- [ ] **Track your running diploma aggregate** in your journal at every internal assessment

*Week 9-12 — language + Maths/Physics depth:*
- [ ] One programming language done properly (Python if your college uses Java for DSA — Java is fine too, keep it)
- [ ] **Git/GitHub genuinely mastered**: branching, merging, rebase, PRs, issues, CI on every push, a good README. Most students never get past `commit`. Your *interview* will ask.
- [ ] Maths: **calculus + matrices + vectors + probability**, in English, from a proper source
- [ ] Physics: mechanics, electricity, magnetism, modern physics, semiconductors
- [ ] First **tiny** project: a Python CLI tool that does something real (unit converter, budget tracker, marks calculator). Deploy nothing. Just ship it and write a README.

**Weekly template (2.5 hours/day, 6 days):**
| | Hours | What |
|---|---|---|
| Mon–Fri | 1.5 h | **JELET subject depth** (Math/Phys/Chem) — the exam spine |
| Mon–Fri | 1.0 h | **CS skill** (language, DSA, Git, eventually stack) — the job spine |
| Sat | 2.5 h | Weekly closed-book test (1 h) + project work (1.5 h) |
| Sun | 1.0 h | Weekly review: journal, Anki catch-up, plan next week |
| Daily | 15 min | Anki reviews — non-negotiable, this is the compounding engine |

### 7.2 Sem 4: your core CS subjects become the job

Your Sem 4 syllabus is where the CS career track becomes real: **Data Structures, DBMS, Computer Networks, Operating Systems** [WBTESD](https://polytechnic.wbtetsd.gov.in/polytechnic/college/download_file/184260348236f9554fe9375772ff966e/1731949424.pdf). These are the interview subjects *and* the JELET-supporting disciplines (Networks → Physics intuition, DBMS → the SQL you'll use forever).

- [ ] **DSA**: solve 3–5 problems a week in your syllabus' Data Structures course. Start easy. Write the *why*, not just the code.
- [ ] **DBMS → SQL → PostgreSQL**: your course is the textbook. Do every lab *properly*, then build a schema of your own.
- [ ] **Networks & OS**: understand them; these are cheap interview wins and they're on your JELET-adjacent Physics.
- [ ] **JavaScript basics → Node.js + Express**; connect to PostgreSQL; build a small API
- [ ] **Docker + first deployment** (free tier). A live URL beats a screenshot.
- [ ] JELET: **solve the last 5 years' papers, chapter by chapter, in JELET format, timed**
- [ ] Your **summer internship (SI301) is coming** — research local IT companies *now* and line up a dev/IT internship, not data entry. Get a written offer letter.

### 7.3 Sem 5: the portfolio year (and your mandatory internship)

- [ ] **Summer Internship (SI301)** — the single most valuable resume line you'll have. Aim for a *development* internship at a startup or agency, or an IT role where you write code. Ask for a written offer letter; it goes on your resume under Experience, not under Training.
- [ ] **TypeScript → React/Next.js** · **GitHub Actions (CI/CD)** · **AWS free tier deploy**
- [ ] **Repo 2**: a deployed full-stack app solving a real problem for real users. Non-negotiables: real auth, real DB with migrations, a real API, tests, CI on every push, Docker, a live URL, a serious README, a `LICENSE`.
- [ ] **First 2 open-source PRs** — docs, tests, small fixes. Learn the workflow of someone else's codebase.
- [ ] **TypeScript** replaces JavaScript in your stack once you're comfortable. Java stays for DSA and enterprise fallback.
- [ ] JELET: full-length timed mocks, 2 hours, exact format, once a week from now on
- [ ] **Start applying** — see §7.7

### 7.4 Sem 6 (final year): JELET + the AI project

- [ ] **JELET exam** (~June) — this is the year. See §3A.5 for the 10-month prep plan.
- [ ] **Repo 3 (AI-native)** — RAG with clickable citations, or an agent that does something real. Include an `evals/` folder showing you *measured* output quality. This is what makes you "AI-enabled" rather than "uses AI" [InterviewStack](https://interviewstack.io/blog/how-ai-is-changing-fullstack-developer-2026).
- [ ] **Portfolio complete**: 3 shipped repos + open-source PRs + a written LinkedIn profile that leads with Projects, not Education [nucamp](https://www.nucamp.co/blog/top-10-tech-jobs-that-don-t-require-a-degree-in-india-in-2026).
- [ ] One free certificate only if it attaches to a project (AWS Cloud Practitioner path, Azure AI-900) [Edubracket](https://edubracket.com/articles/best-free-ai-certifications-2026)
- [ ] **Apply.** You're a final-year student with a portfolio and a JELET rank pending. This is the strongest you'll ever be on paper.

### 7.5 The JELET prep year (12 months out)

| Months out | Focus |
|---|---|
| 12–9 | **Maths rebuild**: calculus, matrices, vectors, probability — the 41.7%. Use your AI tutor to diagnose gaps chapter by chapter. |
| 9–6 | **Physics**: mechanics, electricity, magnetism, EMI, modern, semiconductors. + **Chemistry**: bonding, equilibrium, redox, coordination, organic basics. |
| 6–3 | **Full timed mocks** every week. **FEEE** (8.3%) — lean on your Digital Electronics/Microprocessor units. **Previous 10 years' papers**, all of them. |
| 3–1 | Only mocks and error analysis. No new topics. **Write the "JELET traps" note** and memorise it. |
| 2–0 | Register, admit card, logistics, sleep, breakfast. Do not study new material. |
| June | **The exam.** 2 hours, 100 questions, 120 marks, English, OMR. Skip what you don't know. Mark only what you're sure of on Cat-2. |

**Remember the tie-break: Mathematics.** [bulletin](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf)

### 7.6 B.Tech years 1–2: the job track

- [ ] **Year 1:** System design fundamentals, Docker/Kubernetes basics, Terraform, deeper cloud. More open source (5 merged PRs). Improve English: write everything in English; speak daily.
- [ ] **Year 2:** **Apply seriously.** Target: Junior Software Engineer, Junior Full Stack Developer, Associate AI Engineer, AI-Engineer Intern, Backend Engineer (remote), Full Stack Intern (remote). Filter on "no degree required" [Remote RocketShip](https://www.remoterocketship.com/country/india/jobs/junior-backend-developer/).
- [ ] **Interviews:** DSA (your syllabus' DS course), SQL, "explain Repo 3's architecture in 5 minutes", and *"how did you use AI in this project?"* — build that story deliberately.
- [ ] **Keep going to GSoC / SIH / internships** — GSoC accepts diploma students (enrolment not required since 2022) and pays ₹60,000–2.5 lakh [LeapScholar](https://leapscholar.com/blog/google-summer-of-code/).
- [ ] **Apply during the B.Tech too.** Don't wait for graduation — the degree is nice-to-have on paper; the portfolio is what interviews you.

### 7.7 When to start applying — the honest answer
**Sem 5, with Repo 1 and Repo 2 shipped.** Reason: you need *rejection data* early, when a single rejection is cheap. Applying in the final year with no rejections behind you means you learn nothing until it's too late to fix. Applications are a skill too, and they need practice. Keep applying throughout — the offer often arrives from a role you'd have rejected a year earlier.

### 7.8 A note on expectations, because you should plan around reality
A Sem 3 beginner will not be a full-stack developer in 6 months, and any plan that says so is selling something. What *is* realistic:
- **End of Sem 4:** competent in one language + Git + SQL + maths/physics depth + a learning system that works. Already ahead of 90% of your batch.
- **End of Sem 5:** one deployed full-stack app, an internship letter, 2 merged PRs. **Employable for junior/IT roles** if you want to earn early.
- **End of Sem 6:** JELET attempt + a real portfolio + B.Tech admission. **Employable for ₹4–7 LPA roles** [Glassdoor — remote junior full stack ₹5–7 LPA](https://www.glassdoor.co.in/Job/remote-github-jobs-SRCH_IL.0,6_IS12563_KO7,13.htm).
- **B.Tech years 1–2:** real interviews, real offers, real money — with a degree *and* a portfolio, which is the only combination that beats the market.

That's the whole game. It's boring and it works.

---

## 8. The opportunity channels (with actual deadlines)

These are the "opportunities" half of what you asked for. Ranked by value-to-effort for your situation.

### Tier 1 — high value, real money or real credential
| Channel | What it is | Timing | Why for you |
|---|---|---|---|
| **Google Summer of Code (GSoC)** | 12-week remote open-source internship, **stipend ₹60,000–2.5 lakh** for Indian contributors | Apps ~Feb–Apr 2027 for 2027 | ⭐ **College enrolment has not been required since 2022 — diploma students are explicitly eligible.** 18+, ~2 yrs max experience, no prior GSoC needed. Your summer-internship slot is the natural place to do it [30](https://leapscholar.com/blog/google-summer-of-code/) [31](https://theinternship.in/gsoc-i/) |
| **Smart India Hackathon (SIH)** | MoE + AICTE national hackathon, real government problem statements, ₹1L per problem, internship/incubation offers | SIH 2027: internal hackathon ~Aug–Sept 2027, finale ~Dec 2027 | ⭐ Free entry. Needs **6 students from your institute + 1 mentor + ≥1 female member**, entered via your college **SPOC** — so find your SPOC now and start recruiting your team in the spring [32](https://thenewviews.com/smart-india-hackathon/) [33](https://velonx.in/blog/top-company-hackathons-for-students-in-india-2026) |
| **Your curriculum's Summer Internship (SI301)** | Compulsory internship in Sem 5 | Per your college's calendar | Get a *development* internship with a written offer letter. It's mandatory anyway — so spend it on your resume. |
| **Freelance work** | Real client, real deadline, real money | Immediate | Local Kolkata small businesses + agencies need web work. ₹25,000–40,000/month freelance web work is visible in Kolkata listings [34](https://www.simplyhired.co.in/search?q=diploma+in+computer+science&l=kolkata%2C+west+bengal). It's the fastest proof-of-work generator you have. |

### Tier 2 — portfolio + network, no guaranteed cash
- **Linux Foundation LFX Mentorship** — remote, ~3 months, ~$5,000 depending on track, open to all [35](https://ossium.in/home/oss-programs)
- **MLH Fellowship** — remote, 12 weeks, paid, open to all [35](https://ossium.in/home/oss-programs)
- **GirlScript Summer of Code (GSSoC)** — beginner-friendly, no formal enrolment restriction, open-source + AI-agents tracks [36](https://www.prepnplaced.com/apprenticeships/remote)
- **Outreachy** — Dec–Mar / May–Aug, remote [37](https://www.prepnplaced.com/apprenticeships/open-source-programmes)
- **Wikimedia GSoC / Julia JSoC / IIIT-Kalyani Winter of Code** — [37](https://www.prepnplaced.com/apprenticeships/open-source-programmes) [38](https://github.com/deepanshu1422/List-Of-Open-Source-Internships-Programs)
- **Company hackathons:** Flipkart GRiD (₹6L pool + SDE interviews), Amazon HackOn (GenAI, ₹2.25L), TCS CodeVita, Microsoft Imagine Cup, ET AI Hackathon (PPIs + ₹10L) [39](https://velonx.in/blog/top-company-hackathons-for-students-in-india-2026) [40](https://www.reddit.com/r/developersIndia/comments/1qctgpc/top_hackathons_to_watch_in_2026_ai_ml_tech/)
- **Internshala** — 100+ full-stack internships live, ₹3,000–6,000/month, plus a fresher-job board [41](https://internshala.com/internships/full-stack-development-internship/) [42](https://internshala.com/fresher-jobs/software-development-jobs/)
- **SarthiQ** — remote, 3–6 months, tracks in AI/LLM training, RAG & Agentic Systems, Full-Stack, Cognitive Science; *no formal credential filter* — "curiosity, mettle for uncertainty, and willingness to build" [43](https://sarthiq.com/)

### Tier 3 — free credentials worth ₹0
| Credential | Cost | Note |
|---|---|---|
| **AWS Cloud Practitioner** (CLF-C02) | Free training on AWS Skill Builder; exam $100 — **AWS launched Student Rewards in Aug 2026** giving students free training + credits + a $100 exam voucher (verify current terms) | Most-recognised entry-level cloud cert; appears in 40%+ of junior cloud postings [44](https://dev.to/aws-builders/free-aws-certification-for-students-the-complete-step-by-step-guide-3m1m) [45](https://www.autoapplymax.com/blog/best-free-cloud-certifications-2026) |
| **Azure AI-900 (AI Practitioner)** | Free study path, $165 exam | No programming required; pairs well with your AI direction [46](https://edubracket.com/articles/best-free-ai-certifications-2026) |
| **Google ML Crash Course** | Fully free | 15 hours, hands-on TensorFlow — good for the AI layer [46](https://edubracket.com/articles/best-free-ai-certifications-2026) |
| **GitHub Foundations** | Free voucher via Student Pack (while supplies last) | Direct signal for dev roles [47](https://builder.aws.com/content/3JYOdVPrLqxmcCNGHrKSRraejHL/free-tech-certifications-and-credentials-for-students-in-2026) |
| **MongoDB certification** | Free via Student Pack + learning path | Pairs with your PostgreSQL/Prisma work |
| **Cisco NetAcad** | Free courses + badges | Networking, Python, Linux, IoT, Cybersecurity — aligns with your syllabus |
| **NPTEL / SWAYAM** | Free to learn; nominal fee for proctored exam | Government-recognized; WB placement cells accept it [48](https://www.taskveda.in/blog/free-certification-programs-2026.html) |

> **Certification reality check:** certs *supplement* experience, they don't replace it. The right way to present one is inline with a project: *"Utilised AWS S3 and Lambda for serverless image processing [Cloud Practitioner Certified]"* — not in a lonely "Certifications" section at the bottom [49](https://studenttechprojects.in/blog/student-opportunities/free-online-certifications-value-guide). **Never stack more than 2–3.** Portfolio first, then the badge.

---

## 8A. Part-time income — earning without burning the JELET spine

You want money while studying. Good. The rule that makes this work:

> **Income may come out of your *freelancing* time and your *weekend* hours. It may never come out of the JELET hours or the daily learning loop.**

Target: **₹8,000–15,000/month from 6–8 hours/week.** That's realistic, sustainable, funds your gear, and doesn't cost you the exam.

### 8A.1 Tier 1 — Tutoring (start this week, highest value by a wide margin)

**This is not a side hustle for you. It's your JELET prep with a salary attached.**

| What you teach | Online rate | Home tuition rate |
|---|---|---|
| Class 6–8 | ₹300–500/hr | ₹350–600/hr |
| **Class 9–10 (WB board)** | **₹400–700/hr** | **₹450–800/hr** |
| **Class 11–12 (WB board)** | **₹500–900/hr** | **₹600–1,000/hr** |
| JEE / NEET foundation | ₹800–1,800/hr | ₹1,000–2,000/hr |

Sources: [SmartTek tuition rates](https://smartteksolutions.in/part-time-online-home-tuition-teaching-opportunities-in-india-mysmartpros/) · [Jobipo student jobs](https://jobipo.com/blog/part-time-online-jobs-for-students/) · [PowerPro2](https://powerpro2.blogspot.com/2026/07/make-money-online-student-india-2026.html)

**Why tutoring is the correct choice for you, specifically:**
1. **It uses capital you already have.** 88.17% Madhyamik, 80% HS, 9.3 GPA, plus a JELET syllabus you must master anyway. You are already the tutor.
2. **The subject you teach IS the exam you sit.** Class 11–12 WB-board Maths and Physics overlap heavily with JELET Paper I. **Every hour you teach is an hour you revise — you are getting paid to study.**
3. **It needs no portfolio.** Start in week 1, unlike freelancing which needs ~6 months of skills.
4. **It deepens your own mastery.** Self-explanation is a **moderate-utility** learning technique (d = 0.54) [Dunlosky](https://www.whz.de/fileadmin/lehre/hochschuldidaktik/docs/dunloskiimprovingstudentlearning.pdf). Explaining calculus to a Class 12 student is the Feynman technique on a topic that appears in your exam — **you will find your own gaps faster than by re-reading.**
5. **Kolkata pays well for it.** Home tuition for Class 9–10 at ₹450–800/hr in a city where coaching institutes charge ₹5,000+/month per student. You are the cheap, personal, effective alternative.
6. **The hours are evening-weighted** and don't collide with your daytime study block.

**How to start (this week):**
- **Direct students = no commission = 3–5× the platform rate.** Platforms (Vedantu, Chegg, SuperProf, Filo, Cuemath) supply students but pay less. Use platforms for *reviews*; use direct WhatsApp/Google Meet referrals for *money*.
- **Start at ₹250–400/hr.** Two students at ₹300 × 2 hrs/week each = **₹5,000/month** in month one. Raise your rate after 3–5 good reviews.
- **Where to find students:** your juniors and their classmates (cheapest, most reliable), WhatsApp/Instagram in your locality, UrbanPro/JustDial tutoring listings, coaching-institute referral (many need part-time faculty for weak students), local schools' evening remedial classes.
- **Offer a free 30-minute demo class.** It converts better than any ad.
- **Build a one-page "teaching kit"** — a WB Class 12 Maths/Physics syllabus map plus your own notes. You're building a teaching asset *and* a revision asset simultaneously. Put it in this repo (`teaching/`) and it's a portfolio piece too.

**The guardrail:** max **2 offline + 2–3 online students.** More than that eats the JELET spine. Log tutoring hours in the same journal as study hours — it becomes evidence of teaching, and if you ever consider a teaching-track role, it's a portfolio piece.

### 8A.2 Tier 2 — AI data annotation & model-training tasks (flexible filler)

Remote AI companies pay workers to label images, rate chatbot outputs, and verify translations: **₹2,000–15,000/month, per-task, flexible timing** [Gromo](https://gromo.in/blog/online-part-time-jobs-for-students-in-2026/) [Gromo — zero-investment jobs](https://gromo.in/blog/zero-investment-income-ideas-top-14-part-time-jobs-in-india-2026-zero-investment/).

**Your specific edge:** Indian-language verification tasks pay a **premium**, and you're fluent in Bengali (and presumably Hindi). That's a real, sellable advantage. Intake opens in waves — apply to several.

**Use strictly as gap-filler** (a slow week, exam season). Low pay, builds no portfolio.

### 8A.3 Tier 3 — AI micro-services for local businesses (from Sem 4–5)

Set up AI workflows for small Kolkata businesses: a chatbot for a coaching institute's FAQ, an automated WhatsApp enquiry responder, a Notion dashboard for a local shop's inventory, AI-assisted content for a small agency's social media. Reported range: **₹8,000–40,000/month** for 3 clients [Teenbucks](https://teenbucks.in/side-hustle-for-students/) [Mymoneyway](https://www.mymoneyway.in/2026/06/earn-money-online-for-students-india-2026-zero-investment.html).

**This is the only income option that also builds your portfolio** — and it can *become* Repo 2 or Repo 3 if you build it properly (documented, deployed, with evals). Two birds. **Max 1–2 clients** — client work is sales-shaped and will expand to fill all your time if you let it.

### 8A.4 Tier 4 — English content writing (small, optional)

**₹5,000–35,000/month** for good writers [Jobipo](https://jobipo.com/blog/part-time-online-jobs-for-students/). You have HS 80% English. But this is the **weakest signal for a CS job**, so keep it small — it's for cash, not for the CV.

### 8A.5 What to avoid
- **Data entry (₹5,000–15,000/mo)** — zero skill compounding, and it competes with the same "sit and type" energy that lets you skip learning. A trap disguised as a job.
- **Microtask / survey sites** — same reason, lower pay.
- **Any hustle needing 4+ hours/day.** With 2–3 hours/day total for everything, a 4-hour hustle means learning stops.
- **Anything that asks you to pay upfront.** Legitimate programmes — GSoC, SIH, LFX, MLH, Outreachy — are **free** [PrepnPlaced](https://www.prepnplaced.com/apprenticeships/open-source-programmes).

### 8A.6 Tax & the money's job
- Freelance/tutoring income above **₹2.5 lakh/year** is taxable (₹3 lakh under the new regime); earnings above **₹40,000/month** from tutoring may carry TDS depending on the platform [themoneydecoded](https://themoneydecoded.com/blog/make-money-online-student).
- **Give every rupee a job.** Suggested split of ₹8,000–15,000/month:
  - **50% → gear & infrastructure.** A better laptop (RAM matters for Docker + local models), a domain, AWS free tier, one exam fee, one cert.
  - **30% → safety net**, so you never need a bad job.
  - **20% → life.** A student who hates their routine quits the routine.
- **The goal is not ₹40,000/month.** The goal is ₹1.5–2 lakh over your diploma — which buys a laptop, a domain, certs and exam fees, and critically **the freedom to say no to a bad internship when one shows up.**

### 8A.7 How income and the JELET plan reinforce each other
- Tutoring = paid revision of the exact exam syllabus.
- Money = the laptop and cloud credits that make the portfolio possible.
- Teaching = the communication skill every interview tests.
- And a line on your CV: *Freelance Tutor, Maths & Physics (Class 9–12), 300+ hours* — which a JU panel will read as someone who explains things clearly.

> **The trap to avoid:** earning ₹10,000/month feels great and will happily consume the 6 hours/week that should have been Maths. Set the cap now, in writing, in `roadmap.md`. If tutoring starts costing you JELET mock-test scores, **cut students before you cut revision.**

---

## 9. Free stack — the full ₹0 budget

| Need | Tool | Cost |
|---|---|---|
| Primary AI agent (this repo) | Arena.ai Agent Mode / Claude Code / Codex CLI | Free tiers available |
| Tutor over your own material | **Gemini Notebook** (was NotebookLM) — 100 notebooks, 50 sources each, 50 chats/day, 3 audio overviews/day | ₹0 |
| Socratic tutor | Gemini **Guided Learning** — asks instead of answering | ₹0 |
| General reasoning / long docs | Claude Free (daily limit) | ₹0 |
| Study mode / Q&A | ChatGPT Free | ₹0 |
| Cited web research | Perplexity Free | ₹0 |
| Local, offline, private | Ollama + open models — no key, no limits | ₹0 |
| Spaced repetition | Anki (desktop/Android/web) + **FSRS** (default since v23.10; 20–30% fewer reviews than SM-2 at equal retention) | ₹0 |
| AI coding assistant | GitHub Copilot via Student Pack (verify current terms) | ₹0 |
| Cloud to deploy on | AWS Free Tier / GCP $300 credit (90 days) / DigitalOcean via Student Pack | ₹0 |
| Domains | `.me` TLD free for 1 year via Student Pack | ₹0 |
| Video → cards | YouTube transcript → AI prompt → CSV → Anki import (no length limit; many hosted tools cap at 3–5 min free) | ₹0 |

**Total: ₹0.** The only thing this plan costs is **time** — roughly 2–3 hours/day, 6 days a week.

---

## 10. The interview reality for you

**What they'll test:**
1. **DSA** — your syllabus covers it. Use it. Practice on the exact topics in your COPC205 Data Structures course; that alone puts you ahead of most self-taught candidates.
2. **SQL** — your DBMS course covers it. Free advantage.
3. **Your projects — deep.** "Walk me through Repo 3's architecture." "Why did you choose RAG over fine-tuning?" "What broke, and how did you fix it?"
4. **AI fluency** — "How do you use AI in your work?" "How do you verify LLM output?" "What is an eval?" [50](https://arxiv.org/html/2610.31481)
5. **Communication in English.** This is where most diploma candidates lose. Practice: explain your project out loud in 5 minutes, record yourself, listen back. Write your README in English so you practice writing technical English daily.
6. **Basic system design** — not "design Twitter." "Design a URL shortener with 10k writes/sec."

**Certificates don't get you interviews. Projects do. Communication gets you hired.**

---

## 11. The "don't" list (pre-commit these now)

1. **Don't learn 5 languages.** One primary (TypeScript) + one AI layer (Python). Java for DSA.
2. **Don't chase certificates.** 2–3 max, each attached to a project.
3. **Don't build 10 toy projects.** 4 real ones beat 10 clones of a tutorial.
4. **Don't let AI write the code you claim to have written.** In the age of AI, the portfolio *is* the proof of your skill — and a portfolio you can't defend in an interview is a liability, not an asset. Write it, then let AI review it.
5. **Don't apply only through portals.** Direct email to founders at small studios; GitHub issues on projects you use; community forums. The "hidden market" (GitHub, hackathons, open source, community) is where intern hires actually come from [51](https://beincareer.com/how-to-get-internship-india-2026/).
6. **Don't wait until you feel ready.** Apply at month 3.
7. **Don't learn in public for applause.** Your journal should be honest, not impressive. The mess is the point.
8. **Don't neglect English.** Write everything in English. Speak daily. It is a hiring filter, not a formality.
9. **Don't ignore the syllabus's core CS.** DSA, DBMS, Networks, OS — those *are* the interview. You're just using the syllabus as a free textbook, not as a target.
10. **Don't let the AI take the wheel.** The chess RCT is the warning: students who could ask for help any time got 30% gains vs. 64% for system-initiated help [22](https://ssrn.com/abstract/5604932). In code: write the test first, then ask.

---

## 12. Metrics (review every Sunday, in your journal)

| Metric | Target | Why |
|---|---|---|
| **Closed-book, no-AI weekly score** | Rising over 12 weeks | The only honest learning metric [21](https://www.pnas.org/doi/10.1073/pnas.2422633122) |
| **JELET mock score (full Paper I, timed, no AI)** | **≥95/120 by the end of your prep year; 105+ for a CSE shot** | The number that decides everything (§3B.3) |
| **Running diploma aggregate** | **≥70%** (never below 60%) | The JU eligibility gate — and 4 semesters of marks decide it |
| Weekly Maths/Physics/Chem hours | 7–8 h/week | The JELET spine |
| Repos shipped & deployed | 3 by end of Sem 6 | Portfolio, not notes |
| Open-source PRs merged | 5 by end of B.Tech Yr 1 | Team-collaboration signal |
| Tutoring hours/week | 6–8 h, capped | Income without eating the spine |
| Part-time income | ₹8,000–15,000/month | Funds the gear; also paid revision |
| Targeted applications/week | 10, from Sem 5 | Volume is a skill |
| Interviews per 20 applications | ≥2 | Your funnel health check |
| `git log` commits | No gap >2 days | Consistency, not learning |
| Anki reviews/day | Done daily | Retention compounding |
| **"Can I defend this repo for 5 minutes?"** | Yes, for all of them | The real readiness test |
| **Profile READMEs written** | 1 live, by end of Week 1 | The only page a recruiter is guaranteed to open |
| **Repos with a live demo URL** | 3 by end of Sem 3 | A repo without a URL is a folder |
| **Repos with a CI workflow** | All, by end of Sem 3 | A phone cannot build — CI is the build machine |
| **Test files in portfolio repos** | ≥3 repos, by end of Sem 4 | The 0%-to-not-0% gap that reads as "engineer" |
| **Commits on the phone** | ≥1 per active day | Consistency is the only metric that never lies |

---

## 13. The honest summary

> **Rewritten 28 October 2026 after the GitHub audit.** The previous version of this summary was written for a beginner. It was wrong, and the correction is the most valuable thing in this document.

**What you got right — and did not know you got right.** You identified early that AI changes the game, and you connected a repository to it: the one artifact that captures *your* effort and cannot be faked. You also chose the JELET path, and your academic record (88.17% → 80% → 9.3 GPA) means you cleared the one hard eligibility gate on that path — **JU's 60%** — in year one.

**And then you actually built.** While planning a learning system, you produced: a **full-stack AI product** (`matriq` — Next.js 16 + FastAPI + Gemini over a million rows), a **phone-based IDE with 3 stars** (`CodeC`), **two complete Android apps** shipped from a phone (`Tilefold`, `Day Ledger`), a **15-module Termux textbook** that other people learn from, **two live websites**, a **seven-year JELET previous-year-question archive** transcribed in LaTeX, and an **operating doctrine** (`AppFlow`) that explains how to ship software without a computer.

**The self-report said "coding beginner". The repositories say: mid-level, phone-first, full-stack, with Android depth and real AI product experience.** That gap between self-report and evidence is itself the lesson of this document — and the same trap this whole repository is designed to avoid, applied to yourself.

**What the plan adds on top of your instinct:**
- **A spine.** "Learn for knowledge and opportunities" is a direction, not a route. The route is: **JELET spine (Maths + Physics + Chem) and Job spine (Android + Full-Stack + AI), running in parallel on the same hours → JU CSE (target GMR ≤40, ideally ≤20) → B.Tech → job.**
- **A number.** JU CSE lateral is **9 seats** and closes around rank **9–55**. So your real target is a score, not a feeling: **95–105 out of 120, stretch 105–112.** And `Jelet-prep` already holds the syllabus and seven years of papers — the missing half is instrumentation (§3A.7), and it is worth about 12 marks.
- **A re-sequenced first six months.** Not "learn one language properly" — that ship has sailed, in the best possible way. Instead: **legibility → CI → tests → three merged PRs → DSA with a weekly score.** Five items, in that order, over 30 days and then one semester.
- **A phone-first mechanic.** You have no computer, so `git push` is the build command and GitHub Actions is the build machine. You wrote that rule in `AppFlow` before this plan existed. Now it runs the whole portfolio.
- **An income line that pays you to revise.** Tutoring Class 11–12 Maths/Physics is the same syllabus as JELET Paper I. **You are getting paid to study.** ₹8,000–15,000/month from 6–8 hours/week, capped so it can never eat the JELET hours.

**What to watch for:**
- **Legibility before new projects.** The instinct to build the next thing is strong, and it is the thing that has already left 12 repos invisible. Fix the 12 before you make the 13th.
- **Don't serialise.** "Degree first, skills after" is the trap. The degree and the portfolio must be built in the same 3.5 years.
- **Don't lose the 60%.** You have a huge cushion now; polytechnic theory papers in Sem 5–6 (Microprocessor, Automata, AI/ML) are where it can slip. Track the running aggregate every semester.
- **Don't expect 6 months to a job.** End of Sem 5 you're employable at junior/IT level; end of Sem 6 at ₹4–7 LPA; B.Tech Yr 2 is where the good offers live.
- **Don't let the AI write the code you claim you wrote.** A portfolio you can't defend in an interview is a liability — and with 47 repositories, a recruiter *will* pick one and ask.

**One line to remember:** *The JELET rank gets you into Jadavpur. The portfolio gets you the offer — but only if a stranger can see it. The AI fluency gets you the raise. The tutoring gets you the laptop.*

---

## Sources

**Your context**
1. [WB State Council — Diploma CST/CSE/CSWT/IT curriculum structure (Revised 2022)](https://gsmp.co.in/wp-content/uploads/2023/02/CST_STRUCTURE.pdf) · 2. [WBTESD — Part-II & III curriculum, incl. SI301 Summer Internship-II](https://polytechnic.wbtetsd.gov.in/polytechnic/college/download_file/184260348236f9554fe9375772ff966e/1731949424.pdf) · 3. [APC Ray Polytechnic on Shiksha — 60 seats, no median salary reported](https://www.shiksha.com/college/acharya-prafulla-chandra-ray-polytechnic-jadavpur-kolkata-58865/course-diploma-in-computer-science-and-technology-640035)

**Market**
4. [Remote RocketShip — junior backend roles, "no degree required"](https://www.remoterocketship.com/country/india/jobs/junior-backend-developer/) · 5. [Glassdoor — "We do not care about pedigree"](https://www.glassdoor.co.in/Job/india-junior-frontend-developer-remote-working-jobs-SRCH_IL.0,5_IN115_KO6,46.htm) · 6. [Qarera — 360,336 job postings skill analysis](https://www.qarera.com/reports/most-in-demand-skills-2026) · 7. [Edstellar — AI skills shortage & the 2-yrs-AI-vs-5-yrs-non-AI finding](https://www.edstellar.com/blog/most-in-demand-skills-in-it) · 8. [RemoteAI — 419 real AI job posts](https://remoteai.io/articles/ai-skills-in-demand) · 9. [nucamp — the junior developer hiring crisis in 2026](https://www.nucamp.co/blog/the-junior-developer-hiring-crisis-in-2026-how-to-get-your-first-full-stack-job) · 10. [Indeed — diploma CS jobs in West Bengal](https://in.indeed.com/q-diploma-computer-science-l-west-bengal-jobs.html) · 11. [Vtricks — full-stack salary in Kolkata 2026](https://vtricks.in/salary/full-stack-developer-salary-kolkata.html) · 12. [Glassdoor — Youngun Junior Full Stack, remote ₹5–7 LPA](https://www.glassdoor.co.in/Job/remote-github-jobs-SRCH_IL.0,6_IS12563_KO7,13.htm) · 13. [Internshala — AI Engineering, WFH, ₹15,001–45,000/mo](https://internshala.com/jobs/github-jobs/) · 18. [InterviewStack — full-stack skill share in postings](https://interviewstack.io/blog/fullstack-developer-skills-companies-want-2026) · 19. [nucamp — in-demand full-stack skills 2026](https://www.nucamp.co/blog/most-in-demand-full-stack-skills-in-2026-react-node-typescript-and-beyond) · 20. [InterviewStack — GenAI skill demand in full-stack postings](https://interviewstack.io/blog/how-ai-is-changing-fullstack-developer-2026) · 23. [nucamp — tech jobs that don't require a degree in India](https://www.nucamp.co/blog/top-10-tech-jobs-that-don-t-require-a-degree-in-india-in-2026)

**Education & learning**
21. [Bastani et al. (2025), PNAS — Generative AI without guardrails can harm learning](https://www.pnas.org/doi/10.1073/pnas.2422633122) · 22. [Poulidis, Bastani & Bastani — Self-regulated AI use hinders long-term learning](https://ssrn.com/abstract/5604932) · 50. [arXiv — evaluating AI tutoring; explain AI-assisted solutions in your own words](https://arxiv.org/html/2610.31481)

**Degree pathway & JELET**
14. [KGEC — JELET lateral entry eligibility & counselling](https://www.kgec.edu.in/admissions) · 15. [Collegedunia — JELET eligibility, WB domicile, branch correspondence](https://collegedunia.com/exams/jelet) · 16. [MyEducationWire — JELET 2027 status](https://www.myeducationwire.com/latest/jelet-2027/) · 17. [FindUrCollege — branch-change rules for lateral entry](https://findurcollege.com/direct-second-year-btech) · 52. [**JELET 2026 official Information Bulletin** (WBJEEB PDF — pattern, marking scheme, tie-break, eligibility, provisional admission for final-sem appearing candidates)](https://cdnbbsr.s3waas.gov.in/s3d2a27e83d429f0dcae6b937cf480aeb1/uploads/2026/03/20260318287108702.pdf) · 53. [JELET 2026 exam pattern & subject-wise weightage](https://collegedunia.com/exams/jelet/exam-pattern) · 54. [JELET syllabus — Mathematics, Physics, Chemistry, FEEE](https://admission.aglasem.com/wbjee-jelet-syllabus/) · 55. [Careers360 — JELET topic-wise syllabus](https://engineering.careers360.com/articles/jelet-syllabus) · 56. [Shiksha — JELET syllabus & exam pattern](https://www.shiksha.com/engineering/wbjee-jelet-exam-syllabus) · 57. [WBJEEB — official JELET page & notices](https://wbjeeb.nic.in/jelet/) · 58. [JELET 2024 Information Bulletin (diploma in *any* branch eligible)](https://wbjeeb.in/wp-content/uploads/2024/02/2024020274-1-jelet-2024.pdf) · 59. [JELET 2027 eligibility criteria & age limit](https://www.myeducationwire.com/latest/jelet-2027-eligibility-criteria/) · 60. [Collegedunia — no minimum score needed for a merit rank](https://collegedunia.com/exams/jelet/results) · 61. [FindMyCollege — Jadavpur University lateral-entry requires 60%](https://findmycollege.com/exam/jelet/eligibility) · 62. [JELET seat acceptance & mandatory documents (WB domicile)](https://admittanceedutech.in/wb-jelet-round-3-counselling-2026/)

**Jadavpur University lateral entry**
63. [JU official Information Brochure for JELET admission (60% rule, relevant-branch rule, domicile)](https://admissionju.jadavpuruniversity.in/fengadmission/frontend/upload/brochure/jelet_admission.pdf) · 64. [JELET 2026 seat matrix — JU branch-wise seats, incl. "CSE / Computer Science & Technology: 9"](https://engineering.careers360.com/articles/jelet) · 65. [Collegedunia — JU cutoff trends, JELET B.Tech Lateral closing ranks](https://collegedunia.com/university/26008-jadavpur-university-ju-kolkata/cutoff) · 66. [FindMyCollege — JU JELET cutoff trends by category](https://findmycollege.com/exam/jelet/cutoff) · 67. [JELET 2026 expected cutoffs — JU CSE UR closing rank 30–55](https://collegedunia.com/articles/e-553-jelet-2026-cutoff-previous-year-rank-trends-and-2026-prediction) · 68. [Collegedunia — JU admission, 90% Home State / 10% All India](https://collegedunia.com/university/26008-jadavpur-university-ju-kolkata/admission) · 69. [Telegraph India — JU restores JELET lateral entry; 150 seats; bridging coursework](https://www.telegraphindia.com/west-bengal/kolkata/ju-reverses-decision-on-jelet-admissions-allowing-diploma-holders-with-online-classes-prnt/cid/2137208) · 70. [Times of India — JU faculty council sets the 60% lateral-entry rule](https://timesofindia.indiatimes.com/city/kolkata/60-in-diploma-for-jadavpur-university-engineering-lateral-entry/articleshow/67155271.cms) · 71. [Pagalguy — JU JELET round-1 branch closing ranks](https://www.pagalguy.com/colleges/jadavpur-university-kolkata) · 72. [Collegedunia — JU BE Lateral CSE eligibility & provisional admission](https://collegedunia.com/university/26008-jadavpur-university-ju-kolkata/bachelor-of-engineering-be-lateral-computer-science-and-engineering-13082)

**Part-time income**
73. [SmartTek — online & home tuition hourly rates by class](https://smartteksolutions.in/part-time-online-home-tuition-teaching-opportunities-in-india-mysmartpros/) · 74. [Jobipo — student part-time jobs, tutoring rates, direct vs. platform](https://jobipo.com/blog/part-time-online-jobs-for-students/) · 75. [PowerPro2 — tutoring rates and realistic student earnings](https://powerpro2.blogspot.com/2026/07/make-money-online-student-india-2026.html) · 76. [Gromo — AI data annotation & model-training tasks for students](https://gromo.in/blog/online-part-time-jobs-for-students-in-2026/) · 77. [Teenbucks — student side-hustle income milestones](https://teenbucks.in/side-hustle-for-students/) · 78. [Mymoneyway — AI services as a student income stream](https://www.mymoneyway.in/2026/06/earn-money-online-for-students-india-2026-zero-investment.html) · 79. [themoneydecoded — student income by year & income-tax/TDS thresholds](https://themoneydecoded.com/blog/make-money-online-student)

**Opportunities**
30. [LeapScholar — GSoC 2027 for Indian students, diploma eligibility](https://leapscholar.com/blog/google-summer-of-code/) · 31. [The Internship — GSoC 2026 stipend & eligibility](https://theinternship.in/gsoc-i/) · 32. [The New Views — SIH 2026 schedule & SPOC route](https://thenewviews.com/smart-india-hackathon/) · 33. [Velonx — company hackathons, prizes, eligibility](https://velonx.in/blog/top-company-hackathons-for-students-in-india-2026) · 34. [SimplyHired — Kolkata freelance web dev pay](https://www.simplyhired.co.in/search?q=diploma+in+computer+science&l=kolkata%2C+west+bengal) · 35. [Ossium — LFX, MLH, Outreachy](https://ossium.in/home/oss-programs) · 36. [PrepnPlaced — remote open-source programmes](https://www.prepnplaced.com/apprenticeships/remote) · 37. [PrepnPlaced — open-source internship programmes](https://www.prepnplaced.com/apprenticeships/open-source-programmes) · 38. [List of Open Source Internships](https://github.com/deepanshu1422/List-Of-Open-Source-Internships-Programs) · 39. [r/developersIndia — 2026 hackathon calendar](https://www.reddit.com/r/developersIndia/comments/1qctgpc/top_hackathons_to_watch_in_2026_ai_ml_tech/) · 40. [Velonx — company hackathon comparison](https://velonx.in/blog/top-company-hackathons-for-students-in-india-2026) · 41. [Internshala — full-stack internships](https://internshala.com/internships/full-stack-development-internship/) · 42. [Internshala — software development fresher jobs](https://internshala.com/fresher-jobs/software-development-jobs/) · 43. [SarthiQ — remote AI/RAG/agentic tracks](https://sarthiq.com/) · 51. [Beincareer — the hidden internship market](https://beincareer.com/how-to-get-internship-india-2026/)

**Free tooling**
24. [Student cloud credits — GitHub Pack, AWS, GCP, DigitalOcean](https://creditforstartups.com/students/cloud-credits-for-students) · 25. [GitHub Student Developer Pack](https://spca.education/free-tech-giant-services-for-students-certification-guide/) · 26. [AWS Builder Center — free premium tech for students](https://builder.aws.com/content/3IUXtk3cJbrpRXiG1Y3wenPstPI/free-premium-tech-every-student-should-claim-in-2026-a-verified-guide) · 27. [Free AI tools for students in India 2026](https://mylingasia.com/posts/best-ai-tools-students-india-2026) · 28. [Remote developer jobs directory](https://github.com/ugglr/Remote-Developer-jobs-directory) · 29. [Remote RocketShip — entry-level remote SWE, India](https://www.remoterocketship.com/country/india/jobs/entry-level-software-engineer/) · 44. [AWS Student Rewards for students](https://dev.to/aws-builders/free-aws-certification-for-students-the-complete-step-by-step-guide-3m1m) · 45. [Best free cloud certifications 2026](https://www.autoapplymax.com/blog/best-free-cloud-certifications-2026) · 46. [Best free AI certifications 2026](https://edubracket.com/articles/best-free-ai-certifications-2026) · 47. [Free tech certifications for students](https://builder.aws.com/content/3JYOdVPrLqxmcCNGHrKSRraejHL/free-tech-certifications-and-credentials-for-students-in-2026) · 48. [Free certification programmes 2026 (NPTEL/SWAYAM, Forage)](https://www.taskveda.in/blog/free-certification-programs-2026.html) · 49. [Free certifications that actually have value](https://studenttechprojects.in/blog/student-opportunities/free-online-certifications-value-guide)
