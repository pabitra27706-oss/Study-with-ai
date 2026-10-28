/**
 * The timeline. Where the work actually is, in order.
 * Rewritten 28 October 2026 after the GitHub audit — the old version was
 * planned around a "coding beginner" who did not exist.
 */

export type MilestoneState = "done" | "active" | "upcoming";

export interface Milestone {
  id: string;
  when: string;
  title: string;
  detail: string;
  state: MilestoneState;
  /** Optional link to the artifact. */
  href?: string;
  hrefLabel?: string;
}

export const milestones: Milestone[] = [
  {
    id: "m0",
    when: "2026 · done",
    title: "Ship things from a phone",
    detail:
      "CodeC (3★), Tilefold, Day Ledger, AppFlow. Android apps, a developer tool and a written doctrine, all built in a Termux terminal with GitHub Actions as the build machine.",
    state: "done",
    href: "https://github.com/pabiwilliams/CodeC",
    hrefLabel: "CodeC",
  },
  {
    id: "m1",
    when: "2026 · done",
    title: "Ship a full-stack AI product",
    detail:
      "InsightAI: Next.js 16 + FastAPI + Gemini 2.5 Flash over a million-row dataset, with NL→SQL, dynamic charts, KPI cards and injection guards. Built for a hackathon.",
    state: "done",
    href: "https://github.com/pabitra27706-oss/matriq",
    hrefLabel: "InsightAI",
  },
  {
    id: "m2",
    when: "2026 · done",
    title: "Build an audience",
    detail:
      "A 15-module Termux textbook, two diploma study hubs, a seven-year JELET PYQ archive and a live learning-archive site — all for students in my own stream.",
    state: "done",
    href: "https://github.com/pabitra27706-oss/Termux-Mastery",
    hrefLabel: "Termux-Mastery",
  },
  {
    id: "m3",
    when: "Now — Oct 2026",
    title: "Make it legible",
    detail:
      "One GitHub identity instead of two. A real profile README. A live demo link on every project. Descriptions, licences and READMEs. Right now the work exists and nobody can see it.",
    state: "active",
    href: "/audit",
    hrefLabel: "Read the audit",
  },
  {
    id: "m4",
    when: "Next 30 days",
    title: "Close the four gaps that decide interviews",
    detail:
      "Automated tests. A CI workflow in every repo. Three merged PRs in other people's codebases. A DSA practice log with a weekly score. These are the whole gap list.",
    state: "active",
  },
  {
    id: "m5",
    when: "Sem 4 — 2027",
    title: "JELET becomes an instrument",
    detail:
      "Jelet-prep already holds the syllabus and seven years of papers. Add the scoring engine, the forced error log and a topic heat map — then run one full mock every Sunday.",
    state: "upcoming",
    href: "https://github.com/pabitra27706-oss/Jelet-prep",
    hrefLabel: "Jelet-prep",
  },
  {
    id: "m6",
    when: "2029 / 2030",
    title: "JELET → Jadavpur University CSE",
    detail:
      "Nine lateral seats. Target score 95–105 out of 120, which is a top-40 rank, because JU CSE closes around GMR 9–55. The seat is reachable; the syllabus is half the battle and the mocks are the other half.",
    state: "upcoming",
  },
  {
    id: "m7",
    when: "B.Tech Yr 1–2",
    title: "Convert to a job",
    detail:
      "System design from memory, deeper DevOps, five merged PRs, English polish. Then applications, interviews, offers. Target: Android / Full-Stack Developer or AI Engineer.",
    state: "upcoming",
  },
  {
    id: "m8",
    when: "Every Sunday",
    title: "Closed-book, no-AI test",
    detail:
      "45 minutes, no AI, no notes, no browser. The only score that separates learning from performing. Never skip it.",
    state: "active",
    href: "/journal",
    hrefLabel: "See the journal",
  },
];
