# `projects/` — deep-dive notes per project

The public-facing project data lives in [`content/projects.ts`](../content/projects.ts)
and renders on `/projects`. This folder holds the **working notes** for each
project: architecture decisions, failed approaches, benchmarks, error logs.

One folder per project, named after its slug.

```
projects/
  study-with-ai/
    README.md          # what it is, what it proves, how to run it
    decisions.md       # architecture decisions and why
    errors.md          # the bugs that taught me something
    benchmarks.md      # numbers, with the method stated
```

## The rule that keeps this honest

A project is **shipped** only when a stranger can clone the repo, read the
README, and see it working in under five minutes. Everything in `content/projects.ts`
that says "shipped" must correspond to a real, working, deployed artifact —
and the site refuses to let a skill claim 100% without a proof link.
