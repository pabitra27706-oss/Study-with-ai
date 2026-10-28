# The Learning Archive

This folder is the **Learning Archive**: every topic worked through, the code
that came out of it, and the notes taken along the way.

It used to be a separate repository with its own site. It is not any more.
Both halves now live in this one repository, and the archive is regenerated
from the learning engine every time the site is built — so it cannot fall
behind the work.

## What is in here

| Path | What it is |
|---|---|
| `data/index.json` | the catalogue: every topic, with its tags, date and file count |
| `data/topics/<lang>/<id>.json` | one topic: its description, its notes, its files |
| `data/projects.json` | the older project catalogue, kept as it was |
| `content/<lang>/*` | the code. 82 files at the moment |
| `legacy/` | the archive's original documentation, kept verbatim as history |

## Where the entries come from

Two kinds of entry live in the same catalogue, and they are told apart by the
`source` field:

- **`source` is absent — hand-written.** The 68 topics that were catalogued
  by hand between January and August 2026. They are history. Nothing
  overwrites them.
- **`source` is `"engine"` — generated.** The topics the learning engine
  owns. `scripts/build-archive.mjs` rewrites these from `curriculum/`,
  `learn/` and `data/progress.json` on every build.

The generator never deletes a hand-written entry. It only adds to the
catalogue and refreshes its own entries.

## What a generated entry carries

Everything the engine knows about a topic, in the archive's own schema:

- the topic's title, description, tags and difficulty
- **the code you actually wrote** — copied out of `learn/<topic>/solutions/`,
  never a reference example
- **the verdict** — status, score, who judged it and when
- **the machine facts** — how many hidden test cases passed, and the comment
  score
- **the notes** — your three lines, in your voice
- **the misconceptions** — the things that were wrong, and why
- **the review** — the written judgement

That last list is the reason the archive came home. A catalogue of finished
files cannot show a person improving; a catalogue of judgements can.

## The one command

```bash
node scripts/build-archive.mjs
```

It writes the generated topic files, merges the catalogue, and mirrors the
code into `public/` so the site can serve it for download and for the ZIP
export. The mirror is generated and is not in git.

Check it without writing anything:

```bash
node scripts/build-archive.mjs --check
```

## The old site

The archive had its own static website — `website/`, with a runtime JSON
fetch, a search box, three view modes and multi-topic ZIP downloads. It is
retired. All of that is ported into this site's `/archive` route, and it is
better there: the catalogue is baked into the pages at build time instead of
fetched by the browser, and the code is highlighted on the server instead of
on your phone.

The original site still exists in the archive's old repository, and its
documentation is in `legacy/`.

## The schema

Unchanged from the original, so the archive's history stays readable:

```jsonc
{
  "topic": {
    "id": "c-multiplication-table",
    "title": "Multiplication Table",
    "language": "C",
    "category": "Control Flow",
    "difficulty": "beginner",
    "dateCreated": "2026-08-10T15:53:39Z",
    "lastUpdated": "2026-08-10T15:53:39Z",
    "tags": ["for-loop", "loops", "iteration"],
    "description": "Iteration using for loops…",
    "learningNotes": { "whatILearned": "", "challenges": "", "nextSteps": "" }
  },
  "files": [
    {
      "id": "file-001",
      "fileName": "multiplication-table.c",
      "filePath": "content/c/multiplication-table.c",
      "description": "Create a Multiplication table for user.",
      "dateAdded": "2026-08-10T15:53:39Z"
    }
  ]
}
```

Generated entries add `source`, `curriculumId` and an `engine` block. Files
from the engine also carry `taskId`, `points`, `passed` and `total`.
