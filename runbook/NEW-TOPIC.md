# Writing a new topic

> The whole sequence, in order, with the commands. If you are authoring a
> topic and you are not sure what comes next, this is the file to open.
>
> It was written the hard way: the first topic shipped a video with **327
> views and 12 likes**, and nothing in the repository noticed. That is why
> step 4 and `scripts/check-topic.mjs` exist.

---

## What a topic actually is

A topic is four things, and nothing else:

| Path | What it is | Who writes it |
|---|---|---|
| `curriculum/topics/<id>.json` | the pack: explanation, videos, tasks, rubric | the author (me) |
| `curriculum/reference/<id>/*.c` | the reference solutions, one per task | the author |
| `learn/<id>/` | the learner's folder: `solutions/`, `answers.json`, `notes.json` | the learner |
| `curriculum/index.json` | one line per topic, so the site can list them | the author |

The pack is the **teaching**. The learner's folder is the **work**. The
judge reads both. Nothing else is a topic.

---

## The sequence

```
0. decide          →  is this worth a learner's afternoon?
1. scaffold        →  node scripts/new-topic.mjs <id> "<title>"
2. explain         →  curriculum/topics/<id>.json  (explanation sections)
3. measure         →  pick the videos, and MEASURE every one of them
4. tasks           →  the work, with hidden tests
5. solutions       →  curriculum/reference/<id>/t1.c …
6. rubric          →  the written questions
7. validate        →  node scripts/check-topic.mjs <id> --deep
8. preview         →  node scripts/serve-static.mjs 3000 out
9. commit          →  branch, commit, push, open a PR
10. retire         →  when it is finished, archive it; do not delete it
```

---

## 0. Decide

Before writing a word, answer three questions in one line each:

- **What one idea does the whole topic hang on?** If you cannot finish the
  sentence, the topic is too big. Split it.
- **What will the learner be able to do at the end that they could not do at
  the start?** "Understand linked lists" is not an answer. "Write a program
  that inserts a node at a position and frees the memory" is.
- **Is the previous topic's prerequisite actually done?** If the learner has
  not used pointers, do not teach them a linked list. Teach pointers.

A topic is **90 to 240 minutes** of work for the learner. If your task list
needs more than that, it is two topics.

---

## 1. Scaffold

```bash
node scripts/new-topic.mjs data-structures-c "Data Structures in C" \
  --language C --category "Data Structures" --difficulty beginner \
  --minutes 240 --tags linked-list,stack,queue,pointer,malloc
```

This creates the pack (full of `TODO` markers), an empty
`curriculum/reference/<id>/`, the learner's folder, and registers the topic
in `curriculum/index.json`.

It refuses to overwrite anything. That is deliberate — a half-written pack is
still yours to finish, not to lose.

---

## 2. Explain

Write the explanation sections in `curriculum/topics/<id>.json` →
`curriculum.explanation`. Each one is `{ "h": "the heading", "md": "the body" }`.

Rules that make a section work:

- **Lead with why the thing exists**, not with its definition. "Arrays waste
  memory when you do not know the size" is a reason to read on. "A linked
  list is a collection of nodes" is not.
- **Show the shape in code** before you explain the code.
- **Name the bug.** Every topic has one mistake that most people make. Name
  it, show it, and say how to avoid it. That paragraph is the most valuable
  thing in the pack.
- **End with something checkable.** "Now you can predict what the program
  prints" beats "now you understand pointers".

Six to fourteen sections. If a section is under about 120 characters it is a
placeholder, and the validator will say so.

---

## 3. Measure the videos

**This is the step that was skipped last time, and it is the reason a topic
shipped with a 327-view video.** A video is not a suggestion because it
sounds right. It is a suggestion because a lot of people have already watched
it and found it worth their time.

Every video in a pack carries these numbers, read off the watch page on the
day you checked:

```json
{
  "title": "Introduction to linked list",
  "url": "https://www.youtube.com/watch?v=NobHlGUjV3g",
  "channel": "mycodeschool",
  "length": "17:13",
  "minutes": 18,
  "views": 1738697,
  "likes": 19798,
  "published": "2013-03-28",
  "measuredOn": "2026-10-29",
  "why": "The 'why' of linked lists, told as a story about Albert and the memory manager…",
  "order": 3
}
```

**How to get the numbers.** Fetch the watch page and read the header. It
gives you `Views`, `Likes`, `Length`, `Uploaded by`, `Uploaded at` and the
transcript:

```
https://www.youtube.com/watch?v=<video-id>
```

A YouTube **playlist** page gives you the per-video titles, the video ids and
the playlist's total views, but not the per-video likes — fetch the watch
page for those.

**The floor.** `scripts/check-topic.mjs` refuses any video under
**100,000 views**. The lowest video in the `data-structures-c` pack is
535,687 views; the one that was rejected had 327. If you cannot clear the
floor, the video goes in `references` as a text link, or nowhere.

**Also check before you pick:**

- **Is it in the right language?** A 886,000-view video on linked lists is
  worthless if it is in Java. Read the transcript, not just the title.
- **Is it in the right language of instruction?** The learner is
  English-only. A Hindi-language course with 5 million views is not a
  recommendation, however good it is.
- **Is it still alive?** Fetch it. A video id that has been lower-cased, or a
  deleted upload, returns "video unavailable" — and it fails silently
  everywhere else.
- **Does the `why` say why *this* one?** "Great video" is not a reason.
  "It is the only one that shows the stack as an array with a top index" is.

---

## 4. Write the tasks

Each task in `curriculum.tasks` is:

```json
{
  "id": "t4",
  "title": "Delete at a position",
  "points": 13,
  "prompt": "Read an integer N (1 to 100), then N integers, then a position P…",
  "starter": "#include <stdio.h>\n…",
  "solutionFile": "curriculum/reference/data-structures-c/t4.c",
  "explainTarget": "Your comment must state WHY deleting a node is two jobs…",
  "hints": ["…", "…"],
  "tests": [
    { "stdin": "4\n10 20 30 40\n2\n", "stdout": "10\n30\n40", "public": true },
    { "stdin": "3\n1 2 3\n1\n", "stdout": "2\n3", "public": true },
    { "stdin": "5\n5 6 7 8 9\n3\n", "stdout": "5\n6\n8\n9", "public": false }
  ]
}
```

**The rules that are not negotiable:**

- **The points add up to exactly 100.** The validator enforces it.
- **Every task has at least one hidden test** (`"public": false`). A task
  whose tests are all public proves nothing — the learner can hard-code the
  answers.
- **Print one value per line.** The sensor compares whole tokens and whole
  lines, so a single line holding several values only passes on an exact
  match. One value per line removes the trailing-space trap that beginners
  fall into constantly, and it makes every test unambiguous.
- **The prompt is complete.** The input format, the output format, the range
  of the input. If the learner has to guess, the task is broken.
- **`explainTarget` names the one thing to explain.** Not "add comments" —
  the specific decision you want them to be able to justify.
- **Two hints, not ten.** The first nudges, the second nudges harder. If the
  hints contain the answer, the task is a reading exercise.

A good task is one a beginner can finish in 20 to 40 minutes and a
competent C programmer could not finish in 30 seconds.

---

## 5. Write the reference solutions

One file per task: `curriculum/reference/<id>/<taskId>.c`. These are the
worked examples, and they are graded by the same sensor as the learner's
work — so they have to be right **and** they have to score 100 on "the code
explains itself".

```bash
node scripts/check-topic.mjs <id> --deep
```

compiles every reference solution, runs it against the task's own tests, and
scores its comments. Fix what it reports.

**The comment rule, in practice.** The checker flags:

- a comment with no reason in it (`no-why`) — every comment needs a marker
  like *because*, *so that*, *must*, *instead of*, *since*, *only*;
- a comment that just restates the line under it (`restates-code`);
- a loop header or a value that changes each iteration with **no comment on
  it or on the line directly above** (`missing-comment`).

The last one is the one that catches people. In a loop, *every* assignment
needs its own comment on its own line or the line above:

```c
while (walk->next != NULL) {
    /* Move one node forward, because the last node is the one we attach to. */
    walk = walk->next;
}
```

---

## 6. Write the rubric

The rubric is the **written** part of the topic — the questions the learner
answers in their own words in `learn/<id>/answers.json`.

```json
{
  "id": "q3",
  "q": "In `temp->next = head; head = temp;`, what breaks if you swap the two lines?",
  "a": "The list is destroyed…",
  "keywords": ["destroyed", "itself", "orphaned", "leaked", "before"],
  "partial": "Says the order matters and that the new link must be built first."
}
```

- `keywords` are the ideas the answer must contain. The scorer is keyword
  coverage — deliberately dumb, because a dumb scorer cannot be fooled by a
  confident paragraph that says nothing.
- Three to six questions. More than that and the learner stops doing them.
- `partial` says what a half-right answer looks like. It is shown to the
  learner, so make it encouraging.

---

## 7. Validate

```bash
node scripts/check-topic.mjs <id> --deep
```

This checks the pack against every rule above and exits non-zero if anything
is wrong. **Do not skip it.** It is the thing that would have caught the
327-view video, the task with no hidden test, and the reference solution that
does not compile.

---

## 8. Preview

```bash
NEXT_OUTPUT=export npm run build
node scripts/serve-static.mjs 3000 out
```

Open `/learn` and `/learn/<id>`. Read the pages as if you were the learner.
Anything that confuses you will confuse them.

---

## 9. Commit

Work on a branch. Open a PR. **Do not merge it** — the user says when.

```bash
git checkout -b topic/<id>
git add -A
git commit -m "Add the <id> topic pack"
git push -u origin topic/<id>
gh pr create --title "Add the <id> topic pack" --body "…"
```

---

## 10. Retire a topic

When a topic is finished, **archive it — do not delete it.** The learner's
work is the record of what they did.

```bash
git mv learn/<id> learn/archive/<id>
git rm curriculum/topics/<id>.json
git rm -r curriculum/reference/<id>
# then remove the entry from curriculum/index.json
```

Leave a `learn/archive/<id>/README.md` saying what the topic was, when it
was finished, and what the learner got out of it. The archive is the
portfolio; the git history is the memory.

---

## The rules that never change

1. **A video is chosen on measured numbers, not on vibes.** Views, likes,
   length, channel, upload date — recorded in the pack, on the day you
   checked.
2. **Every task has a hidden test.** Otherwise the task proves nothing.
3. **The points add up to 100.**
4. **Every task has a reference solution that compiles, passes and scores
   100 on the comment check.**
5. **The learner's folder starts empty.** No shipped example, no seeded
   answers, no reference copy in the graded directory. A topic the learner
   has not touched is 0%, and it should say 0%.
6. **Never merge a PR without the user saying so.**
7. **Never write to `journal/`.** It is the learner's.
