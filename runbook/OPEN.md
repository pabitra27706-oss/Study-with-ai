# Open

What is still outstanding, why it matters, and who does it.

**Owner** means who has to do it. "Claude" means an agent in this repository
can do it now. "Owner" means only the user can.

| # | What | Why it matters | Owner |
|---|---|---|---|
| 1 | ~~Merge PR #6~~ | **Done** — merged as `a8add89`, deployed green. | — |
| 2 | ~~Close PR #5~~ | **Done** — closed as a duplicate of #6. | — |
| 3 | `cp scripts/deploy-workflow.yml .github/workflows/deploy.yml` and push | The hardened Pages workflow. The sandbox token cannot push workflow files. | Owner |
| 4 | Replace the placeholder LinkedIn and email | `content/site.ts` and `content/links.ts` still carry placeholders. | Owner |
| 5 | Write the `pabi277` profile README | It is still the untouched GitHub profile template. This is the first thing a recruiter sees. | Owner or Claude |
| 6 | Remove committed `node_modules` from `matriq` | It is the most visible sign of an unfinished repo, and it is 46 MB. | Claude |
| 7 | Consolidate the two GitHub accounts | 47 repositories across two identities. The recommendation is `pabitra27706-oss` as the single public identity, moving the Android work across. | Owner |
| 8 | Clear the PAT from Termux shell history | A classic PAT with `repo` and `workflow` sitting in history is a live credential. | Owner |
| 9 | ~~Write the first real topic pack~~ | **Done** — `data-structures-c`: 14 sections, 16 measured videos, 8 tasks over 100 points, 8 reference solutions, all validated by `scripts/check-topic.mjs --deep`. | — |
| 10 | Send the CodeC repository URL | Already resolved to `pabi277/CodeC` — but the owner should confirm it is the repo they use. | Owner |
| 11 | Check the open issues on CodeC | Three open issues on a starred repository is three chances to make it better. | Owner |
| 12 | ~~The learner's `t2.c` is recursion, not a loop~~ | **Superseded** — `c-loops` is retired and the work is archived at `learn/archive/c-loops/`. The lesson (recursion in a loops topic) is written into the review that is still there. | — |
| 13 | ~~The four written answers are still the shipped examples~~ | **Superseded** — archived with the topic. The new topic ships with `answers.json` empty, so the "answers" score is the learner's from the first submission. | — |
| 14 | **The learner starts `data-structures-c`** | Write `t1.c` in CodeC, push it, and say "check data-structures-c". Until then the topic honestly reads 0%. | Owner |
| 15 | Merge PR #9, and the PR that carries the new topic | Both are open and clean. **Merging is forbidden until the owner says the word.** | Owner |
| 16 | Re-measure the video numbers before the topic is taught | The numbers were read on 2026-10-29 and they only go up. A stale number is still a true number, but say when it was read. | Claude |
| 17 | The next topic: trees and BSTs in C | It is the natural follow-on — MyCodeSchool's same course covers it next, and it reuses the node struct the learner will have just built. | Claude, on request |
| 18 | The next topic after that: sorting and searching | `O(n log n)` is where the complexity talk in `data-structures-c` starts to pay off. | Claude, on request |
| 19 | ~~Export the learner's work into the Learning Archive~~ | **Done** — the archive came home. `scripts/build-archive.mjs` regenerates it from the engine on every build, so it can never fall behind the work. | — |
| 20 | ~~Apply the "moved" notice to the old `portfolio` repository~~ | **Done** — the branch `move/archive-into-the-learning-engine` is pushed to `portfolio`, carrying the landing page and the pointer README. Only the pull request is left to open, on the phone: **https://github.com/pabitra27706-oss/portfolio/pull/new/move/archive-into-the-learning-engine** | Owner |
| 21 | ~~Judge the archive's own files~~ | **Done** — the five adopted files were judged and carry a verdict, a score and notes. The queue that keeps it going is `archive/data/archive-pending.json`; `node runner/brief.mjs --pending` prints it. | — |
| 22 | ~~Re-push the pointer README to `portfolio`~~ | **Needed** — the published copy carried a mistyped account name, so its links pointed at an account that does not exist. The corrected file is `archive/legacy/moved-page/README.md`; it has to be pushed to the old repository again. A third typo in the pointer **page** (`index.html`) is fixed here too. | Owner |
| 23 | ~~Judge the 67 topics in the backlog~~ | **Done** — every topic in the archive now carries a verdict, a score and a review. 74 topics judged: 13 C, 43 Python, 5 adopted, plus the rest. `archive/data/archive-pending.json` is empty. | — |
| 24 | The eleven turtle files can never run on the phone | `tkinter` does not exist on Termux, and the eleven turtle files need it. They are judged by reading and they say so. Decide what happens to them: keep them as a "needs a desktop" shelf, or replace the turtle work with a drawing library that runs on the phone. | Owner |

## Not to be done without being asked

- Merging anything.
- Writing to `journal/`.
- Adding a second AI to the loop.
- Introducing a paid service or an API key.
- Shipping a video recommendation that has not been measured.
