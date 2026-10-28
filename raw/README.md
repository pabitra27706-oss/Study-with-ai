# `raw/` — immutable source material

Everything I collect lands here **exactly as collected**: article text, video
transcripts, book excerpts, documentation pages, exam bulletins.

## Rules

1. **Append-only.** Never edit a file that already exists. Never delete one.
   If a source was wrong, add a note beside it — the wrong version is evidence
   of how I was thinking at the time.
2. **One file per source**, named `<date>-<short-slug>.md`.
3. **Keep the frontmatter honest**:

   ```yaml
   ---
   title: "Original title of the source"
   source: https://the-url-it-came-from
   date: 2026-10-28
   type: article | video | book | docs | paper | bulletin
   ---
   ```

4. **Verbatim first.** Paste the useful text as-is, then add my own questions
   underneath in a `## My questions` section. Keeping the two apart is what
   stops me from mistaking my paraphrase for the source.

## Why this folder exists

If the source disappears from the internet — and academic links rot — the
argument is still here, dated, with its provenance. It is also what makes the
AI's answers auditable: my agent is told to prefer `raw/` and `notes/`, and to
mark anything that comes from outside them.
