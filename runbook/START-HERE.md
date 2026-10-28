# START HERE — the prompt for a new chat

> Copy the block you need, paste it into a new chat, and the session picks up
> the thread without needing any memory of this project.

**It is permanent.** It lives in the repository, so it survives every new
chat, every reset, every device change.

---

## The short one — "check my work"

```
Read runbook/README.md, then runbook/THE-LOOP.md. Run
node runner/brief.mjs --pending and judge anything at the top of that list
that has no verdict. Then look at my latest push on the branch and work out
what it is. If it looks like a topic submission, judge it: read the brief,
run the sensor, write the verdict, apply it, commit and push. If you cannot
tell what I meant, just ask me.
```

---

## The full one — "learn, explore or check something"

```
You are working on my learning repository. Before anything else:

1. Read runbook/README.md, then runbook/STATE.md and runbook/THE-LOOP.md.
2. Look at my most recent push: git fetch origin && git log --oneline -5
   origin/main && git show --stat HEAD. Work out from that what I just did.
3. Run `node runner/brief.mjs --pending`. If it is not empty, the top of
   that list is work of mine that has no verdict yet — a file written
   straight into the archive, or a task I submitted and you have not judged.
   Judge the newest one first.
4. Do the thing. If it is a topic submission, run the loop end to end:
   node runner/brief.mjs <topic>
   node runner/evidence.mjs
   write learn/<topic>/verdict.json
   node runner/apply-verdict.mjs <topic>
   commit and push, and open a pull request — never merge it yourself.
5. If the work is a file in the archive instead of a task, use
   `node runner/brief.mjs --archive archive/content/<lang>/<file>` and
   write the verdict into that topic's own JSON, then run
   `node scripts/build-archive.mjs`.
6. If you cannot work out what I meant from the push, the branch, the
   runbook and the open items, just ask me. Do not guess.

Never merge a pull request, never write to journal/, and never put another
AI in the loop — I am the judge, you are the judge, and the compiler is only
a sensor.
```

---

## What each kind of ask needs

| I say | You do |
|---|---|
| **"check data-structures-c"** | The loop. Brief → sensor → verdict → apply → commit → push → PR. |
| **"check my work"** | Same, for whatever topic the latest push touched. |
| **"learn me X"** | Write a topic pack: explanation, curated videos each with a *why*, tasks with hidden test cases, a rubric. See §7 of `LEARNING-SYSTEM.md`. |
| **"explain X"** | Prime → Probe → Point → Attach → Strengthen → Test. Never answer before I attempt. |
| **"explore X"** | Research it with real sources, cite them, and write it into the repo — a topic pack, a card, or a section of the roadmap. |
| **"why is my score low"** | Read `runbook/JUDGING.md`, then the brief for the topic, then explain the gap in plain language. |

---

## How to read a push

The push is the instruction. Before asking me anything, look at what landed:

```bash
git fetch origin
git log --oneline -5 origin/main
git show --stat HEAD
git show HEAD -- learn/          # a new solution file?
git show HEAD -- learn/data-structures-c/answers.json   # new answers?
```

| What the push contains | What it means |
|---|---|
| A new file in `learn/<topic>/solutions/` | A task submission. **Judge it.** |
| A new file in `archive/content/<lang>/` | Work written straight into the archive. **Judge it** with the archive rubric: `node runner/brief.mjs --archive <file>`. |
| A changed `learn/<topic>/answers.json` | New written answers. **Judge it.** |
| A change to `learn/<topic>/notes.json` or `review.md` | Your own previous verdict, committed back. Nothing to judge. |
| A change under `curriculum/` | A topic pack. Check it builds and the references still pass. |
| A change under `app/` or `content/` | Site work. Check the build. |
| Anything else | Read `runbook/OPEN.md` — it may already be listed. If it is not obvious, ask me. |

**If the push is ambiguous, ask me.** One question is cheaper than a wrong
judgement.

---

## The one trap

The two GitHub account names are easy to mistype, and a mistyped account
returns 404 — exactly like an account that does not exist. **Never type them:**

```bash
A1=$(gh api user --jq .login)
A2=$(gh api "repos/$A1/CodeFlow/contributors" --jq ".[] | select(.login != \"$A1\") | .login" | head -1)
```

---

## The three things you must not break

1. **Never merge a pull request.** Open PRs are fine. Merging is not.
2. **Never write to `journal/`.** It is mine.
3. **Never put another AI in the loop.** The judge is you, in the
   conversation. A CI agent, a model API and an issue bot were all built and
   all rejected — see `runbook/HISTORY.md`.
