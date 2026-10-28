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
| 9 | Write the first real topic pack | `c-loops` is the only one. The engine is proven; it needs a second topic to prove it again. | Claude, on request |
| 10 | Send the CodeC repository URL | Already resolved to `pabi277/CodeC` — but the owner should confirm it is the repo they use. | Owner |
| 11 | Check the open issues on CodeC | Three open issues on a starred repository is three chances to make it better. | Owner |
| 12 | The learner's `t2.c` is recursion, not a loop | The arithmetic is right and it now passes all four tests, but in a loops topic the required comment (accumulator, boundary) cannot exist in a recursive program. Worth one more round. | Owner |
| 13 | The four written answers are still the shipped examples | `learn/c-loops/answers.json` has never been replaced, so the "answers" score is not yet the learner's. | Owner |

## Not to be done without being asked

- Merging anything.
- Writing to `journal/`.
- Adding a second AI to the loop.
- Introducing a paid service or an API key.