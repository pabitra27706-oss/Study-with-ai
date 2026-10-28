# The runbook

> **If you are a new chat with no memory of this project: read this file, then
> `STATE.md`, then `THE-LOOP.md`. That is enough to work.**

This folder exists because the work is too big to carry in one conversation.
Everything a fresh session needs to pick up the thread — what is true right
now, how to run the loop, how to judge, what happened and why, what is still
open — is written down here, in the repository, next to the code.

`LEARNING-SYSTEM.md` is the **design** (why the machine is built this way).
This folder is the **operating procedure** (how to actually run it). Read both
when you have time; read this folder when you need to act.

| File | What it is for |
|---|---|
| [`STATE.md`](STATE.md) | Where everything stands right now: accounts, URLs, branches, PR, live site, what is verified. |
| [`THE-LOOP.md`](THE-LOOP.md) | The learning loop, step by step, with the exact commands. Start here when the user says *check*. |
| [`JUDGING.md`](JUDGING.md) | How to judge a submission: the rules, the verdict format, the review shape, a worked example. |
| [`SETUP.md`](SETUP.md) | One-time setup on the phone — Termux, git, CodeC, dependencies. |
| [`HISTORY.md`](HISTORY.md) | Append-only decision log. What was decided, when, and **what was rejected and why**. Read this before changing the design. |
| [`OPEN.md`](OPEN.md) | What is still outstanding, why it matters, and who does it. |

## The 60-second version

- The learner writes code in **CodeC** and **pushes it to GitHub themselves**.
- The learner then says **"check <topic>"** in the chat.
- **Claude reads the brief, judges the submission, and writes the verdict back
  into the repository.** No other AI, no API key, no CI agent, no issue bot.
- The compiler is a **sensor**, not a judge: it reports what happened; the
  verdict is the meaning.

## The three things you must not break

1. **Never merge a pull request without the user saying so.** Open PRs are
   fine. Merging is not.
2. **Never write to `journal/`.** It is the learner's.
3. **Never introduce another AI into the loop.** The judge is Claude, in the
   conversation. A CI agent, a model API and an issue bot were all proposed and
   all rejected — see [`HISTORY.md`](HISTORY.md).

## A trap that will cost you an hour

The two GitHub account names are easy to mistype, and a mistyped account looks
exactly like an account that does not exist. **Never type them.** Read them from
the API:

```bash
A1=$(gh api user --jq .login)
A2=$(gh api "repos/$A1/CodeFlow/contributors" --jq ".[] | select(.login != \"$A1\") | .login" | head -1)
echo "$A1  $A2"
```

Every URL, every doc and every script in this repository uses those two values.
If a `gh api users/<something>` call returns 404, it is nearly always a
transcription error, not a missing account.
