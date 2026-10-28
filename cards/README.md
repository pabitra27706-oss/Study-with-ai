# `cards/` — spaced repetition

Atomic facts, one question per card, kept for the long term.

## Rules

1. **One fact per card.** If the answer needs a paragraph, it is a note, not a
   card.
2. **Only from errors.** A card for something I already know is noise. Cards
   come from mistakes in the journal and from failed closed-book tests.
3. **One sentence answers.** If I cannot answer in one sentence, I do not
   understand it well enough to schedule it.
4. **The human curates.** The AI may draft a batch; I keep roughly a third
   and rewrite the rest. Wrong facts live *longer* in a spaced-repetition
   schedule than anywhere else.
5. **Schedule with FSRS**, not SM-2. The research behind this repo cites a
   20–30% reduction in reviews from FSRS over the default scheduler.

## Format

One markdown file per deck, one `##` block per card:

```markdown
---
deck: cs-core
created: 2026-10-27
---

## What does a `304 Not Modified` response mean?
The client's cached copy is still valid; no body is sent.

## What is the difference between `no-store` and `no-cache`?
`no-store` forbids writing the response to any cache. `no-cache` allows
storing it but requires revalidation before reuse.
```

## Decks planned

- `cs-core.md` — DBMS, DSA, Networks, OS
- `javascript.md` — the language I actually use
- `tools.md` — Git, Linux, Docker, CI
- `ai.md` — LLM mechanics, evals, RAG, MCP
