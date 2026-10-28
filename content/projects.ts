/**
 * The portfolio.
 *
 * Four repos, each with a URL, a README and a live demo. This page is the
 * public face of them — the thing a recruiter sees.
 *
 * HOW TO UPDATE:
 *   - Set `live` to the deployed URL (or leave empty until it exists).
 *   - Set `repo` to the GitHub URL.
 *   - Move `status` from "planned" -> "in-progress" -> "shipped".
 *   - Never mark something "shipped" without a working `live` link.
 */

export const PROJECT_STATUSES = ["planned", "in-progress", "shipped"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  status: ProjectStatus;
  /** Deployed URL. Empty until it exists. */
  live: string;
  /** Source repository. */
  repo: string;
  stack: string[];
  /** The one sentence that tells a hiring manager what this proves. */
  proves: string;
  highlights?: string[];
}

export const projects: Project[] = [
  {
    slug: "study-with-ai",
    name: "Study-with-ai",
    tagline: "An AI study partner that tests you instead of answering you.",
    status: "in-progress",
    live: "",
    repo: "https://github.com/pabitra27706-oss/Study-with-ai",
    stack: ["TypeScript", "Next.js", "Tailwind", "Markdown", "Git"],
    proves:
      "Agentic AI product design with a human-in-the-loop boundary: the agent compiles knowledge and quizzes, the learner owns the journal. This site is its public face.",
    highlights: [
      "This website — a live skill tracker, journal and project index generated from the repo itself.",
      "Learning-journal format with attempt-first notes, error classification and weekly closed-book tests.",
      "Git as the memory layer: every commit is a dated record of what I understood, and when.",
    ],
  },
  {
    slug: "project-two",
    name: "Project Two — a real app for real users",
    tagline: "A deployed full-stack app solving a problem I personally understand.",
    status: "planned",
    live: "",
    repo: "",
    stack: ["TypeScript", "Node", "Express", "PostgreSQL", "Docker", "CI/CD"],
    proves:
      "That I can ship end to end: real auth, a real database with migrations, a real API, tests, CI on every push, and a live URL.",
    highlights: [
      "Problem chosen from my own life (college / local community), not a tutorial clone.",
      "Non-negotiables: auth, migrations, tests, Docker, CI, deployed, README, LICENSE.",
      "One feature that does the job properly beats five that half-work.",
    ],
  },
  {
    slug: "project-three",
    name: "Project Three — the AI-native one",
    tagline: "An AI feature that is grounded, measured and safe.",
    status: "planned",
    live: "",
    repo: "",
    stack: ["Python", "FastAPI", "LLM APIs", "RAG", "Evals"],
    proves:
      "That I can build AI features that are trustworthy — grounded with clickable citations, with an evals harness showing I measured output quality.",
    highlights: [
      "RAG over real course material with citations back to the exact page.",
      "An `evals/` folder: a test set, a scoring method, and the numbers before and after.",
      "Guardrails and fallbacks, documented in the README.",
    ],
  },
  {
    slug: "open-source",
    name: "Open-source contributions",
    tagline: "Merged pull requests in other people's codebases.",
    status: "planned",
    live: "",
    repo: "https://github.com/pabitra27706-oss",
    stack: ["Git", "Code review", "Testing"],
    proves:
      "That I can work inside someone else's architecture, follow their conventions, and get code accepted. This is the signal that reads as 'works with a team'.",
    highlights: [
      "Target: 3–5 merged PRs by the end of my B.Tech first year.",
      "Start with docs, tests and small fixes; graduate to a real feature.",
      "Every PR is a public, permanent signal of collaboration.",
    ],
  },
];

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  planned: {
    label: "Planned",
    className: "text-faint border-line bg-panel",
  },
  "in-progress": {
    label: "In progress",
    className: "text-accent border-accent/25 bg-accent/10",
  },
  shipped: {
    label: "Shipped",
    className: "text-ok border-ok/25 bg-ok/10",
  },
};
