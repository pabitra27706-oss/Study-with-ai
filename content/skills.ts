/**
 * The skill tree.
 *
 * This is the live answer to "am I actually skill-ready, or do I just feel
 * like it?"
 *
 * REWRITTEN 28 OCT 2026 after a full audit of both GitHub accounts
 * (see GITHUB-AUDIT.md). The previous version of this file was written from
 * a self-report of "coding beginner". The repositories say otherwise. Every
 * `proof` link below points at a real repository, and the progress numbers
 * are derived from what that repository actually contains — not from how it
 * feels to have written it.
 *
 * HOW TO UPDATE (takes 30 seconds):
 *   1. Find the skill.
 *   2. Change `status` and `progress`.
 *   3. Commit. The site rebuilds and the dashboard moves.
 *
 * `progress` is deliberately coarse (0-100) and deliberately self-reported.
 * A skill is not "shipped" until there is a `proof` link — a repo, a deployed
 * URL, a merged PR. Self-graded progress without proof is exactly the
 * "illusion of competence" this whole project is designed to avoid.
 */

export const SKILL_STATUSES = ["planned", "learning", "building", "shipped"] as const;
export type SkillStatus = (typeof SKILL_STATUSES)[number];

export const SKILL_GROUPS = [
  "Foundations",
  "Android",
  "Web",
  "AI",
  "CS Core",
  "Tooling",
  "Career",
] as const;
export type SkillGroup = (typeof SKILL_GROUPS)[number];

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
  status: SkillStatus;
  /** 0-100, self-reported. */
  progress: number;
  /** Why this skill earns a place — tie it to a real job or exam. */
  why: string;
  /** Link to the artifact that proves it. Required for `shipped`. */
  proof?: string;
  /** Short label for the proof link. */
  proofLabel?: string;
  tags?: string[];
}

export const skills: Skill[] = [
  // ------------------------------------------------------------- Foundations
  {
    id: "kotlin",
    name: "Kotlin",
    group: "Foundations",
    status: "shipped",
    progress: 80,
    why: "My primary language right now — four Android repositories, two of them complete shipped apps. Also the official language of Android, where the demand is real and the diploma does not compete.",
    proof: "https://github.com/pabi277/2048-game",
    proofLabel: "Tilefold",
    tags: ["language", "android", "shipped"],
  },
  {
    id: "python",
    name: "Python",
    group: "Foundations",
    status: "shipped",
    progress: 75,
    why: "The backend of InsightAI: FastAPI, SQL generation, SQLite at a million rows. It is also #1 in AI-adjacent postings and the language in my own diploma syllabus.",
    proof: "https://github.com/pabitra27706-oss/matriq",
    proofLabel: "InsightAI backend",
    tags: ["language", "AI", "backend", "shipped"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    group: "Foundations",
    status: "shipped",
    progress: 80,
    why: "The base layer of the web work: PWAs for diploma students, the learning-archive site, CodeType Studio, the expense tracker. ES6+ in practice, not just in theory.",
    proof: "https://github.com/pabitra27706-oss/web-inspector-pro",
    proofLabel: "Web Inspector Pro",
    tags: ["language", "web", "shipped"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    group: "Foundations",
    status: "shipped",
    progress: 75,
    why: "Next.js 16 + React 19 + strict mode in both InsightAI and this site. It is 45.2% of full-stack postings and one language across the whole stack.",
    proof: "https://github.com/pabitra27706-oss/Study-with-ai",
    proofLabel: "This site",
    tags: ["language", "web", "types", "shipped"],
  },
  {
    id: "java",
    name: "Java",
    group: "Foundations",
    status: "planned",
    progress: 15,
    why: "My syllabus teaches it and it is still 10.5% of all tech postings. Deliberately deprioritised: three languages at once is how people get stuck at zero. It comes back for DSA practice, not for building.",
    tags: ["language", "DSA"],
  },
  {
    id: "english",
    name: "English — technical reading & writing",
    group: "Career",
    status: "building",
    progress: 55,
    why: "The JELET paper is in English, and every README, commit message and interview answer is English. It is a hiring filter, not a formality — and my READMEs are currently uneven.",
    proof: "https://github.com/pabitra27706-oss/matriq",
    proofLabel: "InsightAI README",
    tags: ["communication", "interview"],
  },

  // ----------------------------------------------------------------- Android
  {
    id: "android",
    name: "Android development (Jetpack / Compose)",
    group: "Android",
    status: "building",
    progress: 60,
    why: "Four active Android repositories and two apps shipped from a phone. The Indian Android market is real and the diploma syllabus never mentions it — a genuine differentiator.",
    proof: "https://github.com/pabi277/CodeC",
    proofLabel: "CodeC",
    tags: ["android", "mobile", "offline-first"],
  },
  {
    id: "mobile-ide",
    name: "Developer tooling for mobile",
    group: "Android",
    status: "shipped",
    progress: 70,
    why: "CodeC — a phone-based coding workspace with 3 stars from people who found it themselves. Building tools, not just apps.",
    proof: "https://github.com/pabi277/CodeC",
    proofLabel: "CodeC",
    tags: ["tooling", "ide", "shipped"],
  },
  {
    id: "offline-first",
    name: "Offline-first & PWA architecture",
    group: "Android",
    status: "shipped",
    progress: 65,
    why: "Diploma study hubs, the ANM/GNM prep platform and the learning archive are all offline-ready PWAs. My users are students on patchy connections — offline is the feature, not a fallback.",
    proof: "https://github.com/pabitra27706-oss/Diploma-3rd-sem",
    proofLabel: "Diploma-3rd-sem",
    tags: ["pwa", "offline", "service worker", "shipped"],
  },

  // --------------------------------------------------------------------- Web
  {
    id: "react",
    name: "React & Next.js",
    group: "Web",
    status: "shipped",
    progress: 75,
    why: "Next.js 16 with the App Router, React 19, Tailwind v4, static export, a design-token system and self-hosted fonts. Shipped twice already: InsightAI and this site.",
    proof: "https://github.com/pabitra27706-oss/Study-with-ai",
    proofLabel: "This site",
    tags: ["frontend", "react", "nextjs", "shipped"],
  },
  {
    id: "node",
    name: "Node.js & APIs",
    group: "Web",
    status: "building",
    progress: 50,
    why: "FastAPI on the InsightAI backend, Express nowhere yet. Node is the natural second server language and it is 31.1% of full-stack postings.",
    proof: "https://github.com/pabitra27706-oss/matriq",
    proofLabel: "InsightAI",
    tags: ["backend", "api"],
  },
  {
    id: "css",
    name: "CSS & design systems",
    group: "Web",
    status: "shipped",
    progress: 70,
    why: "Tailwind v4 with a custom @theme token set, a hand-written markdown prose system, dark-mode-first palettes. Design sense is what separates a portfolio from a template.",
    proof: "https://github.com/pabitra27706-oss/Study-with-ai",
    proofLabel: "This site",
    tags: ["css", "tailwind", "design", "shipped"],
  },
  {
    id: "firebase",
    name: "Firebase & realtime data",
    group: "Web",
    status: "building",
    progress: 45,
    why: "CoupleSpend runs on Firebase + Chart.js. Useful for small apps, and it is a genuine line on a CV for anyone who has only used a local database.",
    proof: "https://github.com/pabitra27706-oss/coupleSpend",
    proofLabel: "CoupleSpend",
    tags: ["backend", "firebase", "pwa"],
  },
  {
    id: "html-css",
    name: "Plain HTML / CSS / JS",
    group: "Web",
    status: "shipped",
    progress: 80,
    why: "The learning archive, the study hubs and the ANM/GNM platform are framework-free on purpose. No build step means a site that still works in five years — and works on a phone with no toolchain.",
    proof: "https://github.com/pabitra27706-oss/portfolio",
    proofLabel: "Learning archive",
    tags: ["html", "css", "javascript", "shipped"],
  },

  // ----------------------------------------------------------------------- AI
  {
    id: "llm-apps",
    name: "LLM applications (real ones, not demos)",
    group: "AI",
    status: "shipped",
    progress: 70,
    why: "InsightAI does natural-language-to-SQL over a million rows with injection guards, dynamic chart configuration, KPI cards and conversational follow-ups. That is a product surface, not a prompt demo.",
    proof: "https://github.com/pabitra27706-oss/matriq",
    proofLabel: "InsightAI",
    tags: ["LLM", "SQL", "Gemini", "shipped"],
  },
  {
    id: "ai-agent",
    name: "AI agents & harnesses",
    group: "AI",
    status: "building",
    progress: 45,
    why: "This whole repository is an AI-managed learning system with a hard boundary (the agent may never write the journal). My forked reading — everything-claude-code, awesome-llm-apps, the agent-harness material — needs to become something I wrote.",
    proof: "https://github.com/pabitra27706-oss/Study-with-ai",
    proofLabel: "This repo",
    tags: ["agents", "MCP", "automation"],
  },
  {
    id: "rag-evals",
    name: "RAG & evaluation harnesses",
    group: "AI",
    status: "planned",
    progress: 10,
    why: "The single biggest gap in my AI work: everything I have shipped is unmeasured. An `evals/` folder with a test set, a scoring method and before/after numbers is what turns 'uses AI' into 'engineers AI'.",
    tags: ["RAG", "evals", "quality"],
  },

  // ----------------------------------------------------------------- CS Core
  {
    id: "dsa",
    name: "Data structures & algorithms",
    group: "CS Core",
    status: "planned",
    progress: 15,
    why: "Every technical interview filters on this, and my repository has no algorithm in it. It is also the cheapest way to convert a strong portfolio into an offer. I have been avoiding it, which is exactly why it is still at 15%.",
    tags: ["DSA", "interview", "leetcode"],
  },
  {
    id: "dbms",
    name: "Databases & SQL",
    group: "CS Core",
    status: "building",
    progress: 50,
    why: "A million-row SQLite dataset and a generated-SQL layer in InsightAI; Firebase in CoupleSpend. But no PostgreSQL, no migrations, no normalisation, no indexing work — and every backend interview asks all four.",
    proof: "https://github.com/pabitra27706-oss/matriq",
    proofLabel: "InsightAI data layer",
    tags: ["SQL", "DBMS", "data"],
  },
  {
    id: "networks",
    name: "Computer networks",
    group: "CS Core",
    status: "building",
    progress: 55,
    why: "In my diploma syllabus and directly relevant: I deploy servers, use SSH, work with GitHub Actions runners and DNS. The mental model behind anything you put on the internet.",
    proof: "https://github.com/pabitra27706-oss/Termux-Mastery",
    proofLabel: "Networking module",
    tags: ["networking", "HTTP", "DNS"],
  },
  {
    id: "os",
    name: "Operating systems & Linux",
    group: "CS Core",
    status: "building",
    progress: 50,
    why: "I live in a Linux terminal every day — Termux is a full Linux userland. The theory half (scheduling, memory, paging) is what the syllabus covers and the interviews ask.",
    proof: "https://github.com/pabitra27706-oss/Termux-Mastery",
    proofLabel: "Termux-Mastery",
    tags: ["linux", "os", "terminal"],
  },
  {
    id: "se",
    name: "Software engineering & system design",
    group: "CS Core",
    status: "learning",
    progress: 35,
    why: "My AppFlow playbook is already a piece of real design thinking. The missing part is being able to explain a system out loud — the notes are forked, not yet mine.",
    proof: "https://github.com/pabi277/AppFlow",
    proofLabel: "AppFlow",
    tags: ["architecture", "design", "interview"],
  },

  // ----------------------------------------------------------------- Tooling
  {
    id: "git",
    name: "Git & GitHub",
    group: "Tooling",
    status: "shipped",
    progress: 80,
    why: "47 repositories across two accounts, a real branch-per-change history, PRs merged into main, GitHub Pages deployments and CI release pipelines. The mechanics are done — what is missing is collaboration inside other people's code.",
    proof: "https://github.com/pabitra27706-oss/Study-with-ai",
    proofLabel: "This repo",
    tags: ["version control", "collaboration", "shipped"],
  },
  {
    id: "termux",
    name: "Termux & phone-first tooling",
    group: "Tooling",
    status: "shipped",
    progress: 85,
    why: "I have no computer. Termux is my build environment, my classroom, my editor and my deployment console — and I wrote the 15-module textbook other people learn from.",
    proof: "https://github.com/pabitra27706-oss/Termux-Mastery",
    proofLabel: "Termux-Mastery",
    tags: ["termux", "android", "shell", "shipped"],
  },
  {
    id: "ci-cd",
    name: "CI/CD",
    group: "Tooling",
    status: "planned",
    progress: 20,
    why: "The doctrine is written — AppFlow says 'use GitHub Actions as the build machine' — but there is not one workflow file in either account. On a phone this is not optional; it is the only way to compile. This is my top tooling priority.",
    proof: "https://github.com/pabi277/AppFlow",
    proofLabel: "AppFlow doctrine",
    tags: ["CI", "actions", "deployment", "gap"],
  },
  {
    id: "testing",
    name: "Automated testing",
    group: "Tooling",
    status: "planned",
    progress: 5,
    why: "Zero tests across all 47 repositories. This is the gap that separates 'hobbyist who ships' from 'engineer'. Three repos with real tests would change how a senior engineer reads my work.",
    tags: ["unit tests", "quality", "gap"],
  },
  {
    id: "cloud",
    name: "Cloud, containers & deployment",
    group: "Tooling",
    status: "learning",
    progress: 30,
    why: "render.yaml on InsightAI and GitHub Pages on four sites. Docker, Terraform and any real cloud SDK are still untouched — and every devops-adjacent posting lists them.",
    proof: "https://github.com/pabitra27706-oss/matriq",
    proofLabel: "render.yaml",
    tags: ["docker", "cloud", "deployment"],
  },
  {
    id: "linux-cli",
    name: "Shell & the command line",
    group: "Tooling",
    status: "shipped",
    progress: 75,
    why: "Shell scripting is a whole module of Termux-Mastery, and I run git, node, python, gh and a static server from a phone every single day.",
    proof: "https://github.com/pabitra27706-oss/Termux-Mastery",
    proofLabel: "Shell scripting module",
    tags: ["shell", "bash", "automation", "shipped"],
  },

  // ------------------------------------------------------------------ Career
  {
    id: "portfolio",
    name: "Portfolio & shipping",
    group: "Career",
    status: "shipped",
    progress: 75,
    why: "Twelve original repositories, three live sites, one AI product, two Android apps, a textbook, two study hubs. What is missing is not volume — it is that a stranger cannot tell any of it from the profile page.",
    proof: "https://github.com/pabitra27706-oss/portfolio",
    proofLabel: "Live portfolio",
    tags: ["portfolio", "shipped", "visibility"],
  },
  {
    id: "teaching",
    name: "Teaching & technical content",
    group: "Career",
    status: "shipped",
    progress: 70,
    why: "A 15-module Termux textbook, two diploma study hubs, a JELET PYQ archive and a learning-archive site. I already have an audience of students in my own stream. That is a channel most candidates never build.",
    proof: "https://github.com/pabitra27706-oss/Diploma-3rd-sem",
    proofLabel: "Study hub",
    tags: ["teaching", "content", "audience", "shipped"],
  },
  {
    id: "open-source",
    name: "Open-source collaboration",
    group: "Career",
    status: "planned",
    progress: 5,
    why: "Zero merged PRs in other people's codebases. The one signal that reads as 'works with a team', and the one I have completely avoided.",
    tags: ["collaboration", "code review", "gap"],
  },
  {
    id: "job-search",
    name: "Job applications & interview",
    group: "Career",
    status: "planned",
    progress: 5,
    why: "Nothing applied, nothing attempted. The portfolio is ready; the funnel is not. Target remote-first junior roles and use the Summer Internship slot for a real offer letter.",
    tags: ["applications", "interview", "gap"],
  },
  {
    id: "jelet",
    name: "JELET syllabus & exam readiness",
    group: "Career",
    status: "building",
    progress: 45,
    why: "Jelet-prep already holds the complete 2026 syllabus and seven years of previous-year papers. The remaining 55% is instrumentation: a scoring engine, an error log and a mock-test runner.",
    proof: "https://github.com/pabitra27706-oss/Jelet-prep",
    proofLabel: "Jelet-prep",
    tags: ["JELET", "JU", "exam"],
  },
];

export const STATUS_META: Record<
  SkillStatus,
  { label: string; className: string; dot: string }
> = {
  planned: {
    label: "Planned",
    className: "text-faint border-line bg-panel",
    dot: "bg-faint",
  },
  learning: {
    label: "Learning",
    className: "text-warn border-warn/25 bg-warn/10",
    dot: "bg-warn",
  },
  building: {
    label: "Building",
    className: "text-accent border-accent/25 bg-accent/10",
    dot: "bg-accent",
  },
  shipped: {
    label: "Shipped",
    className: "text-ok border-ok/25 bg-ok/10",
    dot: "bg-ok",
  },
};

export function groupByGroup(items: Skill[]): { group: SkillGroup; skills: Skill[] }[] {
  return SKILL_GROUPS.map((group) => ({
    group,
    skills: items.filter((s) => s.group === group),
  })).filter((g) => g.skills.length > 0);
}
