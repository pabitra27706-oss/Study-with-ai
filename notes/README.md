# `notes/` — AI-compiled, human-owned

One file per topic, in my own words, with the source attached.

## Rules

1. **I must be able to explain every line.** If a note contains a sentence I
   cannot paraphrase in conversation, it is not my note yet — it is the AI's.
2. **Every factual claim carries its source.** If the note cannot be traced
   back to `raw/`, it says so out loud.
3. **Contradictions are kept.** If two notes disagree, both stay, and the
   disagreement is flagged at the top of the file for the agent to surface.
4. **One topic per file.** `notes/http-caching.md`, not `notes/networking.md`.

## Format

```markdown
---
title: "HTTP caching"
tags: [networking, http]
updated: 2026-10-24
---

## In one sentence
...

## The mechanism
...

## Where I get it wrong
...

## Source
- `raw/2026-10-20-http-caching.md`
```

## The `## Where I get it wrong` section is not optional

It is the most valuable part of the file. A note that only contains what I
already knew is a note I did not need.
