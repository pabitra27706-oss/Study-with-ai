/**
 * The timeline. Semesters on one axis, deliverables on the other.
 * This is the honest view of how far along the journey actually is.
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
    when: "Oct 2026",
    title: "Sem 3 — foundations",
    detail:
      "One language done properly. Git genuinely mastered. Maths + Physics depth in English. The learning system in this repo running end to end.",
    state: "active",
  },
  {
    id: "m1",
    when: "Sem 4",
    title: "Core CS becomes the job",
    detail:
      "Data Structures, DBMS, Networks, OS — done properly, not just passed. JavaScript → Node → PostgreSQL. First deployed app with a real database.",
    state: "upcoming",
  },
  {
    id: "m2",
    when: "Sem 5",
    title: "The portfolio year",
    detail:
      "Summer Internship used for a development role. TypeScript + React + CI/CD + cloud. Project Two shipped. First open-source PRs merged.",
    state: "upcoming",
  },
  {
    id: "m3",
    when: "Sem 6",
    title: "JELET + the AI project",
    detail:
      "JELET attempt. Project Three (AI-native, with evals) shipped. Portfolio complete: three live repos and merged PRs.",
    state: "upcoming",
  },
  {
    id: "m4",
    when: "2029 / 2030",
    title: "JELET → B.Tech lateral entry",
    detail:
      "Target seat: Jadavpur University, Computer Science & Technology. Nine seats. Target rank inside the top 40 — target score 95–105 / 120.",
    state: "upcoming",
  },
  {
    id: "m5",
    when: "B.Tech Yr 1–2",
    title: "Convert to a job",
    detail:
      "System design, deeper DevOps, five merged PRs, English polish. Then: applications, interviews, offers. Target Junior Software Engineer / Full-Stack / Associate AI Engineer.",
    state: "upcoming",
  },
  {
    id: "m6",
    when: "Always",
    title: "Weekly closed-book test",
    detail:
      "No AI, no notes, 45 minutes, every Sunday. The only metric that separates learning from performing. Never skip it.",
    state: "active",
    href: "/journal/",
    hrefLabel: "See the journal",
  },
];
