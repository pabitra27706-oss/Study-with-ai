# Decision log

**Append-only.** Newest at the bottom. Never rewrite an old entry — if a
decision changes, add a new one that supersedes it and say so.

This file exists so that a fresh session does not re-propose a design that was
already tried and rejected. Read it before changing the architecture.

---

## 2026-10-28 — The audit, the roadmap and the site

**Decided.** Audit both GitHub accounts, write a research-backed learning
design and a career roadmap, and ship a web interface with live links.

**Done.** `GITHUB-AUDIT.md` (both accounts, 47 repositories), `LEARNING-JOURNEY.md`
(11 sections, 40 sources), `ROADMAP.md` (JELET priority, Jadavpur CSE, part-time
income), and the Next.js site. PRs #1-#4 merged; the site is live on GitHub
Pages.

**Why it mattered.** The audit produced the fact the whole project now rests on:
**47 repositories, zero automated tests.** A repository that cannot tell you
whether you understood something is a notebook, not a learning system.

---

## 2026-10-28 — The learning engine, and the first wrong turn

**Decided.** Build the engine: curriculum packs (explanation, curated videos,
tasks with hidden tests, rubric), a deterministic sensor, the `learn/<topic>/`
artefacts, the site pages, and the portfolio exporter.

**First attempt (REJECTED).** A CI agent that judged every push with a Gemini
API key, and an issue bot that wrote the review back as a GitHub issue comment.

**Why it was rejected.** The owner said it plainly: *"I will not use agent like
that. I will use CodeC my own app for code and upload to github. Than i will
use you to evaluate, not any other ok. Your process good but i can not
interaction with ai that way do you understand."*

**The lesson.** An autonomous agent acting on a repository is not a learning
loop for this person. A conversation is. Do not re-propose a CI agent, a
model API, an issue bot, or any second AI in the loop.

---

## 2026-10-28 — The compiler is a sensor, not a judge

**Decided.** The deterministic grader may only supply hard facts — does it
compile, which hidden cases pass, does every comment explain a why, which
keyword ideas the answers hit. It never decides what those facts mean.

**Why.** A test runner can tell you a program failed on `n = 0`. It cannot tell
you whether you understand why, and those two cases look identical to `gcc` and
completely different to a teacher. One is a typo; the other is a broken mental
model.

**Earlier rejection of the opposite design.** The owner had already said: *"No
the compiler never judge it the ai will judge and give feedback and keep the
github good see and everything."*

---

## 2026-10-28 — The current architecture

**Decided.**

```
CodeC (write code)  ->  push  ->  GitHub  ->  "check <topic>"
                                            |
                                  runner/brief.mjs -> Claude judges
                                            |
                                  verdict.json -> runner/apply-verdict.mjs
                                            |
                                  notes · review · history · progress
```

No CI agent. No issue bot. No model provider. No API key. **Claude, in the
conversation, is the only judge.**

**Built.** `runner/brief.mjs` (the instrument Claude reads),
`runner/apply-verdict.mjs` (writes a verdict into the repository in one shape
every time, idempotently), `scripts/collect.sh` (the fallback bridge),
`scripts/check.sh`.

**Deleted.** `runner/agent.mjs`, `runner/lib/judge.mjs`, both providers,
`scripts/learn-workflow.yml`, `scripts/review-and-commit.sh`.

**Also decided.** The verdict and the machine facts are shown **separately** on
the site. They are different things and conflating them was hiding the point.

---

## 2026-10-28 — The learning archive slug

**Decided.** The archive is `pabitra27706-oss/portfolio`. The exporter points there.

**History.** An earlier slug 404'd. A later "fix" was itself a transcription
error — see the next entry.

---

## 2026-10-28 — The account names must never be typed

**Decided.** Both account names are read from the GitHub API, never typed by
hand, in every script, doc and command.

**Why.** The names are easy to mistype, and a mistyped account is
indistinguishable from a missing one — `gh api users/<wrong>` returns 404,
exactly as it would for an account that does not exist. This cost a real hour
of hunting a "missing" account that was there the whole time.

**How to get them.**

```bash
A1=$(gh api user --jq .login)
A2=$(gh api "repos/$A1/CodeFlow/contributors" --jq ".[] | select(.login != \"$A1\") | .login" | head -1)
```

`CodeFlow` is the repository both accounts pushed to, so its contributor list
is where the second account shows up.

---

## 2026-10-28 — CodeC pushes to GitHub itself

**Decided.** The primary submission path is CodeC committing straight to
`learn/<topic>/solutions/<task>.c` in this repository. `scripts/collect.sh` is
the documented fallback for when CodeC cannot reach GitHub from the phone.

**Why.** The owner confirmed CodeC already talks to GitHub. No copy step, no
file moving around on the phone.

**Verified from the CodeC source.** It clones into
`/data/data/com.codeci.ide/files/CodeC/projects/<repo>`, stores a PAT in
`GitCredentialsStore` and feeds it to git through an askpass script (never into
a remote URL), pushes the branch name explicitly, and has a **Publish to
GitHub** flow that creates a repo through `POST /user/repos`.

---

## 2026-10-28 — PR #6 merged, PR #5 closed

**Decided.** The owner's instruction was *"Please merge the pull request."*

**Done.** PR #6 squashed into `main` as `a8add89` — matching the repository's
existing convention, since `main` carries no merge commits, only squash
merges. The Pages deployment for it returned `success`. PR #5 was closed as a
duplicate: its only remaining diff was the `docs/` build output, which #6
deliberately removed from version control, so merging it would have undone
that.

**Also done.** The runbook was updated to match reality. A runbook that still
says "PR #6 is open" after it has merged is exactly the failure this folder
exists to prevent.

> *This entry was lost when the branch history was reset after the merge, and
> restored by hand. The log is append-only — if a reset ever drops it again,
> put it back.*

---

## 2026-10-28 — The first judgement of the learner's own work

**What happened.** The learner wrote `learn/c-loops/solutions/t2.c` — a
recursive factorial — and pushed it. That is the first submission in this
project that was not written by me.

**The verdict.** `incomplete`, 20% (machine 19%).

**What the sensor found.** It compiles. Every value it computes is right:
5! = 120, 0! = 1, 10! = 3628800, 20! = 2432902008176640000. It fails all four
test cases because it prints `Enter an integer: Factorial of 5 = 120` where the
test expects `120`. All three comments state what, not why.

**What the judgement added.** The maths is right and the exercise is not done:
this is a loops topic, and the task's comment requirement asks why an
accumulator starts at 1 and why the boundary includes N — neither of which can
exist in a recursive program. The correction is the *shape* of the solution and
the *output contract*, not the arithmetic. The full solution was not handed
over.

**A measurement bug, found and fixed.** The scoreboard was crediting the
learner with a passing task they never wrote: `learn/c-loops/solutions/t1.c`
was byte-identical to `curriculum/reference/c-loops/t1.c`, the example the
topic ships with. It was removed from the graded folder — the reference copy
stays where it belongs — so the number now measures the learner's own work.
That is why the score went *down* from 28% to 20% while the work went up.

**Also.** `learn/c-loops/.fingerprint` was removed: it belonged to the deleted
agent design and nothing read it.

---

## 2026-10-28 — The sensor was too strict, and the verdict was wrong

**The correction.** The owner, on the first judged submission: *"You say it
wrong because of a space? `Factorial of 5 = 120` is not `120`. Don't be so
strict all outputs are ok so it should be passed."*

**What was actually wrong.** The sensor compared stdout byte for byte. A
program that prints `Factorial of 5 = 120` computed 5! perfectly and was
failed for formatting. That is a noisy sensor: it makes the judge argue with
the sensor instead of judging the work.

**The change.** The sensor now asks one question — **is the right value there?**
The expected answer must appear as a whole token, or a whole line for
multi-line expectations. `120` matches `Factorial of 5 = 120`; it does not
match `1200`. Output with extra text still passes, but is recorded as
**noisy** and shown to the judge, who decides whether the extra text is
acceptable. The site shows it too, under *output carries extra text*.

**Verified it did not weaken the sensor.** Deliberately broken programs still
fail: off-by-one, wrong value, trailing digits, and exiting non-zero on an
edge case. Only cosmetics are forgiven.

**The verdict changed.** `incomplete` 20% → **`mostly-correct` 45%** (machine
30%). The programme was never wrong about the mathematics. What is missing is
the thing the task asked for: it is recursion in a loops topic, so the comment
the task requires — why the accumulator starts at 1, why the boundary includes
N — cannot exist in it, and none of its three comments explain a why.

**Also.** `runbook/START-HERE.md` is new: a permanent, copy-paste prompt for
starting a new chat, with a table for reading a push before guessing, and the
instruction to ask when it is ambiguous.

---

## 2026-10-28 — PR #8 merged

**Done.** PR #8 squashed into `main` as `e6973cd`. The Pages deployment for it
returned `success`. It carried the sensor's leniency fix, the corrected
verdict on the learner's `t2.c`, the *output carries extra text* display on the
site, and `runbook/START-HERE.md`.

**Also decided here.** The PR ledger in `STATE.md` now points at
`gh pr list --state all` as the source of truth, and the table records only
the decisions that matter. A merge on its own is no longer worth a runbook
edit — which stops this file needing a new commit after every single merge.

**The PR ledger, for the record.**

| PR | State | What it was |
|---|---|---|
| #1–#4 | merged | the site, the Termux tooling, the audit, the roadmap |
| #5 | closed | duplicate of #6 — do not merge |
| #6 | merged | the learning engine: CodeC → push → Claude judges |
| #7 | closed | superseded by #8 |
| #8 | merged | the first real judgement, and the sensor fix |
| #9 | closed | the PR #8 bookkeeping — folded into the topic-swap PR |
| #10 | merged | the `data-structures-c` topic and the authoring system, `6b155ca` |

---

## 2026-10-29 — The demo pack is retired; the first real topic ships

**The complaint.** *"remove the c loops and add a real topic as we planned as
a beginner friendly"* and, separately, *"your youtube suggestions are bad see
the views, like etc to find the best video"*.

**What the second complaint was actually about.** The `c-loops` pack shipped
**"For Loop in C Programming (With Examples for Beginners)" — 327 views, 12
likes**, from a channel with no audience for the topic. Nothing in the
repository had checked. A video recommendation is a claim about other people's
time, and it was being made on vibes.

**What was done.**

- `c-loops` is retired: the pack and its reference solutions are removed, and
  the learner's work moved to `learn/archive/c-loops/` with a note saying what
  the topic was, what they finished and what the verdict was. **Archived, not
  deleted** — the git history and the folder are the record.
- A new topic, `data-structures-c`: linked lists, stacks and queues in C, with
  pointer and `malloc` groundwork so it is genuinely beginner-friendly. 14
  explanation sections, 16 videos, 8 tasks over 100 points, 6 rubric questions,
  8 reference solutions.
- Every video in the pack carries **measured** views, likes, length, channel,
  upload date and the date the numbers were read. The lowest reach of any
  video is **535,687 views**; the highest is 5,880,358.

**Where the videos came from.** Two English-language channels that implement
these structures in C: **MyCodeSchool** (the 42-video "Data structures"
course, 15,278,890 views — the spine of the topic) and **freeCodeCamp.org**
(the pointers course, 5,880,358 views — the stated prerequisite; and the
10-hour compilation of the same MyCodeSchool course, 4,034,678 views).

**Rejected after checking, not after guessing.** A 886,367-view "Learn Linked
Lists in 13 minutes" video (Bro Code) — it is **Java**. CodeWithHarry's
linked-list playlist (1,191,488 views) — it is **in Hindi**, and the learner is
English-only. A freeCodeCamp video id lower-cased from a blog link —
**"This video isn't available anymore"**. A 1.7M-view Jenny's Lectures C
playlist — it stops at functions and never reaches data structures.

---

## 2026-10-29 — Videos are chosen on measured numbers, and the numbers are recorded

**Decided.** Every video in a topic pack carries its real `views`, `likes`,
`length`, `published` date and a `measuredOn` date, read off the watch page on
the day it was checked. The `why` for a video must say why *this* one, for
*this* learner, at *this* point in the topic — "a good video" is not a reason.

**The floor.** `scripts/check-topic.mjs` refuses any video below **100,000
views**. That is roughly 300x the video that was rejected, and about 1% of a
good channel's back catalogue. Below the floor, a video belongs in
`references` as a text link, or nowhere.

**How to measure.** `fetch_page` on `https://www.youtube.com/watch?v=<id>`
returns `Views`, `Likes`, `Length`, `Uploaded by`, `Uploaded at` and the
transcript. A playlist page returns per-video titles, ids, durations and the
playlist total, but **not** per-video likes — fetch the watch page for those.
Reading the transcript is also how you catch the two traps: a high-traffic
video in the wrong language, and a high-traffic video in the wrong programming
language.

---

## 2026-10-29 — The authoring system

**Decided.** Writing a topic is a documented, repeatable procedure with two
tools, not something re-invented each time.

- **`runbook/NEW-TOPIC.md`** — the sequence, in order: decide, scaffold,
  explain, measure the videos, write the tasks, write the reference solutions,
  write the rubric, validate, preview, commit, retire.
- **`scripts/new-topic.mjs`** — the scaffolder. One command creates the pack
  skeleton, the reference folder, the learner's folder and the index entry.
  It refuses to overwrite anything.
- **`scripts/check-topic.mjs`** — the validator, and the gate. It enforces
  the view floor, a `why` on every video, a hidden test on every task, points
  summing to exactly 100, a reference solution per task, and — with `--deep` —
  that every reference solution compiles, passes its own tests and scores 100
  on "the code explains itself".

**Verified it bites.** The validator was run against a deliberately broken copy
of the new pack with the old 327-view video put back and a hidden test
removed. It failed it with exactly those two problems and exited 1.

**The other rule, from the same failure.** A topic the learner has not touched
is **0%**, and it says 0%. The previous pack shipped a finished example inside
the graded folder, which inflated it to 29% before the learner had written a
line. The new learner's folder ships with `answers.json` empty and only a
`.gitkeep` in `solutions/`.

---

## 2026-10-29 — The Learning Archive comes home

**The request.** *"Upload a code to my archives is very much of a war — I have
to update many files from different folders, remember them. If you make that
automatic it will be good and rich in quality."*

**What it was.** The archive was a **second repository** with a **second
site**. Publishing into it meant: clone it, run a copier, remember that the
copier wanted `data/topics/<lang>/`, remember that the index had to be
edited by hand, commit, push. Four folders and a memory task, on a phone,
after every finished task. And it showed: the exporter had *"only ever been
run against the demo pack"*, so a live-looking archive sat next to a
repository that changed daily, and the two read as two different projects.

**What it is now.** The archive is a **view of the engine**, in this
repository, and it is regenerated on every build.

```
you finish a task -> I judge it -> verdict.json
   -> apply-verdict writes notes, review, history, progress
   -> build-archive regenerates archive/data + archive/content
   -> the site build renders /archive from it
```

**The rule that makes it safe.** The generator never deletes or overwrites a
hand-written entry. The 68 topics catalogued by hand between January and
August 2026 are history, and they stay exactly as they were. Only entries
marked `source: "engine"` are rewritten.

**The import.** `git subtree add --prefix=archive` — the archive's **16
commits are in this repository's history**, not flattened away. The old
static site (`website/`, `tools/`) is retired; every feature it had —
search, language and tag filters, three view modes, shareable filtered URLs,
code preview, multi-topic ZIP download — is ported into `/archive` and works
better there, because the catalogue is baked in at build time instead of
fetched by the browser, and the code is highlighted on the server instead of
on the visitor's phone.

**What a generated entry carries that the old archive could not:** the code
the learner actually wrote, the verdict and its score, the machine facts, the
three notes lines, the misconceptions, and the written review. That is the
difference between a catalogue of files and a record of a person improving.

**The old repository** becomes a pointer — its README and a "moved" landing
page — so the old URLs resolve and its history stays readable.

---

## 2026-10-29 — `/progress`: the history map

**Decided.** A new route, `/progress`, that reads the arc straight out of the
repository: the dated judgement lines in each topic's `history.md`, the
verdicts in `data/progress.json`, the notes, the archived topics, and the
journal.

**Why it is not written by hand.** Because it is assembled from files the
engine already produces, it cannot drift away from the truth. If a judgement
is not in the repository, it is not on the page. That is the whole argument
of this project — Git as the memory — applied to the public face of it.

**What a catalogue of finished files cannot do.** 68 topics with no verdicts,
no failed attempts and no corrections show a person who always got it right.
A timeline that shows 28% → 20% → 45% shows a person who learned something.
The second one is worth more.

---

## 2026-10-29 — The sandbox token is scoped, and that is worth knowing

**What happened.** The archive came home, and the old repository was supposed
to become a pointer — a "moved" landing page and a README that says where
everything went. The commit was prepared and the push was refused:

```
remote: Permission to pabitra27706-oss/portfolio.git denied to pabitra27706-oss.
```

**Why.** The token this session runs on is a **GitHub App installation token**,
not a personal access token, and it is scoped to this repository. The
contents API says the same thing in a different way: *"Resource not accessible
by integration"*. The token's own scope header is empty.

**What it means.** Writing to **this** repository works. Writing to any other
repository does not — not by git, not by the API. That is a property of the
sandbox, not a mistake, and it is not worth fighting.

**What was done instead.** The landing page and the pointer README are
**prepared and committed** at `archive/legacy/moved-page/`, and
`scripts/publish-moved-notice.sh` applies them from a phone with a
credential that can write there. The old repository keeps serving the
original site in the meantime, which is a perfectly good snapshot — nothing
breaks while this waits.

**The rule.** Never design a task that needs two repositories to be writable
at once. If a step genuinely needs a second repository, prepare the files
here and hand the owner one command.

## 2026-10-29 — "Repository not found" is not a typo

The owner ran `scripts/publish-moved-notice.sh` from Termux and got:

```
remote: Repository not found.
fatal: repository 'https://github.com/pabitra27706-oss/portfolio.git/' not found
```

followed by "Wrong github username". The URL was **right**. It was in the
script, and it was the canonical one.

GitHub answers `Repository not found` for a repository you are not allowed to
see, exactly as it answers it for one that does not exist. The clone had gone
out **anonymous**, because the credential helper `gh auth setup-git` installs
reads the token from `GH_TOKEN`, and `GH_TOKEN` was not exported in that
shell. `SETUP.md` tells the owner to clear the token from shell history when
they are done — which is right, and which is also exactly how a new Termux
session ends up with no credential at all.

**The lesson worth keeping.** A 404 from GitHub is not a statement about the
URL. It is a statement about *the requester*. Before changing a URL that
appears wrong, check who is asking:

```bash
gh api repos/pabitra27706-oss/portfolio --jq .full_name
```

If that prints the name, the URL is fine and the credential is not.

**A second trap, in the same session.** `gh auth status` was used as a
pre-flight check. It makes a **live network call** to validate the token, so
on a flaky connection it reports *"The github.com token in GH_TOKEN is no
longer valid"* for a token that is perfectly fine. It was doing exactly the
thing it was meant to detect, and it was wrong. The script now asks the only
question that matters — *can GitHub see this repository with the credential I
have right now?* — and answers it with the API call itself.

**The rule.** Never pre-flight a push with a check that depends on the
network. Try the thing. If it fails, read the real error.

## 2026-10-29 — The archive was an output, and it should have been an input

The owner asked for two things: *make the archive its own part, not any
static page*, and *even if I write any file in archive, you can evaluate
from the last commit and add the appropriate other things*.

The second half is the one that mattered, and going after it turned up
something nobody had noticed.

**Six files were sitting in the archive and none of them were in the
catalogue.** The generator only ever read `learn/<topic>/solutions/*.c`, so
every other file in `archive/content/` was a file the site could not show,
could not download, and could not count. They were real work:

- `functions.py` — Functions in Python, 83 lines, eight ideas
- `lists.py` — Python Lists, a deep dive, 68 lines
- `arrays.js` — JavaScript Arrays in Depth, 66 lines
- `dom-manipulation.js` — JavaScript DOM Manipulation, 94 lines
- `ticket-price-calculator.c` — a full pricing ladder in C

The archive said **82 files**. There were 88.

**And one C file was claimed by two topics at once**, so the catalogue
showed the same code twice and the "If-Else Statement in C" topic showed
code that was not its own. The fix is deliberately minimal: only a file that
two topics both claim is moved, to the topic whose name matches it. A file
with an unusual name is left exactly where it is — "Day7 practice" belongs
to "Hangman Step 1", and `factorial-calculator.c` *is* the for-loop program
the "For Loop in C" topic is about. A cleverer rule would have moved 49 of
87 correct assignments.

**So the generator now adopts.** A file dropped into
`archive/content/<lang>/` is found, matched to a topic by the header the
file itself carries (`Topic`, `Created`, `Purpose`), given a date, and put
in the catalogue. An adopted topic is written **once** — after that it is a
hand-written entry, so the notes and the verdict written into it survive
every build. The archive is an input, not only an output.

**And then I judged them.** A file with no task sheet has no task rubric, so
the archive has its own: does it run (40), is it right (30), does it
explain itself (30). The 40 points are a fact, not an opinion — I ran all
five. The Python and the JavaScript ran under `python3` and `node`; the DOM
file needed a real DOM, so it got one under `jsdom`; the C file compiled
under `-Wall -Wextra` and was run three ways with different inputs.

That last one found a real bug. The pricing logic is correct — 25 / not
weekend / student / 3 tickets is ₹600, a child of 10 is ₹200, a group of 4
on a weekend is ₹1080 — but **no `scanf` is ever checked**. Feed it an age
and nothing else and it prints *Number of tickets: 0*, because the later
reads found nothing to read and left the variables as they were in memory.
It printed zero only by luck.

Scores: `dom-manipulation` 96, `arrays` 95, `lists` 92, `functions` 85,
`ticket-price-calculator` 60. The archive is 74 topics and 86 files now,
and every one of them is reachable.

**The other half of the request: the archive's shape.** It is one page of
cards that open in place — the notes, the verdict, the misconceptions and
the code — with `/archive/<topic>` still a real page for sharing. And the
code is **open by default**. Hiding it is optional, and the control is a
box you can see and tap, not a line of small words you have to find.

**The rule.** A generator that only reads one directory will quietly lose
everything in the others. Look at what is on disk, and ask what the
numbers claim.

---

## 2026-10-29 — The bugs that were hiding in the flow

**Decided.** Hunt for what breaks the flow before it breaks in front of the
owner, and fix it now rather than when it is noticed.

**Found, and fixed.**

- **The ZIP download was empty for 69 of the 74 topics.** The browser asked
  for a topic's JSON under the *file's* name and the mirror wrote it under
  the topic's *id*. The two names differ for every topic that came from the
  old archive. A fetch that 404s returns nothing, so the ZIP came out with
  silent holes in it. Both paths are tried now, the right one first.
- **A topic in a language whose name is not a plain word could never
  open.** The browser guessed the folder from the language — "HTML/CSS"
  became "htmlcss" — while the folder is "html-css". The catalogue now
  carries the folder name (`langSlug`), so the browser is told instead of
  guessing. Any file dropped into `archive/content/html-css/` would have
  shown an empty card for ever.
- **The catalogue forgot every hand-written edit.** When the generator
  rebuilt a catalogue entry for an adopted topic, it rebuilt it from what
  the file's *header* said — not from the file. A description rewritten by
  hand was quietly undone on the next build. The file on disk is the truth
  now.
- **A deleted file left a ghost card.** Delete a file from
  `archive/content/` and the topic still claimed it, so the card opened to
  an empty box and the download 404'd. The list is read from the disk now.
- **Two GitHub accounts that do not exist were written across the
  repository** — one of them on the live `/projects` page and in the
  pointer README already published to the old `portfolio` repository. Every
  account name in the repository is now checked against the API, and all
  twelve of them resolve.
- **A clock in the generator.** One date still fell back to "now", which
  would rewrite the archive on every run and make `--check` useless.
  Removed.
- **The archive's page description said 69 topics.** It is written from the
  catalogue now, so it cannot go stale again.
- **The card showed its spinner and its content at the same time**, and
  `undefined%` could appear where a score should be.

**And the gap that started this.** A file written straight into the archive
had no way to be judged: `runner/brief.mjs` only knew topic packs, and
nothing anywhere listed the work that was waiting. Now it does.

- `runner/brief.mjs --pending` — the queue.
- `runner/brief.mjs --archive <file>` — the brief for a file with no task
  sheet, under the archive rubric.
- `runner/brief.mjs <archive-topic-id>` — the same, found by name.
- `archive/data/archive-pending.json` — the queue itself, newest work first,
  written by the generator on every build.
- The archive's own pages say **waiting to be judged** instead of showing
  nothing, and `scripts/check.sh` prints the queue before the brief.

**The rule.** A feature that is invisible is a feature that does not
exist. If work can arrive somewhere, that somewhere has to be able to say
what is waiting in it.

---

## 2026-10-29 — The backlog is judged. The queue is empty.

**Decided.** Work through `archive/data/archive-pending.json` in order, oldest
last, judging every topic the way the archive rubric says: 40 for *it runs*, 30
for *is it right*, 30 for *does it explain itself*. Run the code where it can be
run; where it cannot, say so and judge it by reading.

**Done.** 74 topics judged — 13 C, 43 Python, 5 adopted files, the rest of the
catalogue. The pending queue is **empty**. `build-archive.mjs --check` reports
*the archive is in step with the engine*.

**Why it mattered.** The archive had 67 topics with real code and no verdict,
which made it a gallery rather than a record. Now every topic on the site
answers the three questions a reader actually has: does it run, is it right, and
does the code explain itself.

**What running the code found that reading it did not.** A file that subtracts
weeks from days and prints 31810 where the answer is 25550. A love
calculator that lowercases one name and not the other, so *Tim* scores 12 and
*tim* scores 22. A pizza order that charges a lowercase `s` as a large pizza.
A treasure map that tries to turn a letter into a number, so `B2` and `2B` both
crash. A debugger exercise file with an unindented `print` that stops the whole
file from starting. These are not things a reader would catch and a runner
catches every time.

**The environment decision that mattered most.** Eleven files need `tkinter`.
There is no `tkinter` here, and **there is none on Termux either** — so those
files can never run on the phone this whole system is built around. They were
judged by reading, they lose the 40 points for running, and the review says so
in the first line rather than pretending otherwise. Two of them (`Bassic_knowledge.py`
and `3_turtle_challange.py`) also close their window instantly, because they
never call `exitonclick()` — a bug that only shows up on a machine with a screen.

**Kept.** The rubric never fails a correct program over cosmetic output, the
verdict is always mine and never the compiler's, and no second AI ever enters
the loop.

---

## 2026-10-29 — The ghost card, and a duplicate that was not a bug

**Decided.** When the duplicate-ownership repair found one file claimed by
two topics, it took the file away from one of them. That is right when the
loser still has other code, and wrong when it does not: a topic left with no
files is a card with a title and nothing to open. **The repair now refuses
to empty a topic.** A file shared by two topics stays with both, and the
generator says which file and which topics.

**Also fixed.** The catalogue pointed *If-Else Statement in C* at
`if-else-statement.json`, a clone of a different topic that carried that
other topic's id and no code at all. The pointer now names the file that
actually holds the topic, and the clone is deleted. The learner keeps their
own note - *How to create a long logic and add new one as well* - and the
topic has a verdict of its own: **60%, mostly-correct**, on the same program
the archive also shows under *Ticket Price Calculator*.

**Why it mattered.** One card in seventy-four opened to an empty box, and
the file count on the site was wrong because of it. The repair that was
meant to stop the same code appearing twice was the thing that created the
empty card. A rule that fixes one fault and creates a worse one is not a
rule yet.

