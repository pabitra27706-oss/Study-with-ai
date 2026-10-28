# `skills/` — deep-dive notes per skill

The live skill tree lives in [`content/skills.ts`](../content/skills.ts) and
renders on `/skills`. This folder holds the **evidence** behind each skill:
notes, small exercises, links to finished work.

```
skills/
  git/
    README.md      # what "good Git" means for me
    exercises.md   # the tiny drills I actually ran
  typescript/
    README.md
```

## Rules

1. **A skill with no `proof` link in `content/skills.ts` is capped at 85%.**
   The cap is enforced in `lib/stats.ts` — it is not a matter of discipline.
2. **Proof means a real artifact**: a repo, a deployed URL, a merged PR, a
   published note. Not a course completion badge, not a certificate.
3. **`progress` is self-reported and coarse.** Whole multiples of five. The
   number is a prompt for honesty, not a measurement.
4. **The closing condition is written down.** For each skill, what would have
   to be true for it to be `shipped`? Put it in this folder's README.
