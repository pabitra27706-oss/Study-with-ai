/**
 * The skill tree.
 *
 * This is the heart of the site: it is the live answer to "am I actually
 * skill-ready, or do I just feel like it?"
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
  // ---------------------------------------------------------------- Foundations
  {
    id: "git",
    name: "Git & GitHub",
    group: "Tooling",
    status: "building",
    progress: 45,
    why: "On every single job listing. Branching, PRs, clean commits, CI on push. Most students never get past `commit`.",
    proof: "https://github.com/pabitra27706-oss/Study-with-ai",
    proofLabel: "This repo",
    tags: ["version control", "collaboration"],
  },
  {
    id: "python",
    name: "Python",
    group: "Foundations",
    status: "learning",
    progress: 25,
    why: "#1 skill in AI-adjacent postings (60% of them). Also the scripting language in my own diploma syllabus.",
    tags: ["language", "AI", "automation"],
  },
  {
    id: "java",
    name: "Java",
    group: "Foundations",
    status: "learning",
    progress: 30,
    why: "My syllabus teaches it, and it's still 10.5% of all tech postings. Kept for DSA practice and enterprise fallback roles.",
    tags: ["language", "DSA"],
  },
  {
    id: "english",
    name: "English — technical reading & writing",
    group: "Career",
    status: "building",
    progress: 40,
    why: "JELET's question paper is in English. Every README, commit message and interview answer is English. It is a hiring filter, not a formality.",
    tags: ["communication", "interview"],
  },

  // ---------------------------------------------------------------- Web
  {
    id: "javascript",
    name: "JavaScript",
    group: "Web",
    status: "planned",
    progress: 10,
    why: "34.7% of full-stack postings. The base layer everything else in the web stack sits on.",
    tags: ["language", "web"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    group: "Web",
    status: "planned",
    progress: 10,
    why: "45.2% of full-stack postings and my primary stack. One language across frontend and backend means one language to learn deeply.",
    tags: ["language", "web", "types"],
  },
  {
    id: "node",
    name: "Node.js & Express",
    group: "Web",
    status: "planned",
    progress: 5,
    why: "31.1% of full-stack postings, and the shortest path from 'I can write code' to 'I shipped something with a URL'.",
    tags: ["backend", "api"],
  },
  {
    id: "react",
    name: "React & Next.js",
    group: "Web",
    status: "planned",
    progress: 5,
    why: "React appears in 54.1% of full-stack postings — the single most-requested skill on the board.",
    tags: ["frontend", "react"],
  },
  {
    id: "sql",
    name: "SQL & PostgreSQL",
    group: "Web",
    status: "learning",
    progress: 35,
    why: "SQL is 11.7% of all postings and 35% of full-stack ones. My DBMS course is the textbook — this is nearly free knowledge.",
    proof: "",
    tags: ["database", "backend"],
  },
  {
    id: "docker",
    name: "Docker",
    group: "Tooling",
    status: "planned",
    progress: 0,
    why: "Shows up in the requirements of remote junior roles I'm targeting. Turns 'I ran it on my machine' into 'anyone can run this'.",
    tags: ["devops", "containers"],
  },
  {
    id: "cicd",
    name: "CI/CD & Cloud deploy",
    group: "Tooling",
    status: "planned",
    progress: 0,
    why: "CI/CD is in 42% of full-stack postings. A live URL with green checks on every push is the single strongest signal on a portfolio.",
    tags: ["devops", "ci"],
  },
  {
    id: "rest",
    name: "REST APIs & Auth",
    group: "Web",
    status: "planned",
    progress: 0,
    why: "APIs in 34.3% of postings. Auth is what separates a tutorial project from a real one.",
    tags: ["backend", "api", "security"],
  },

  // ---------------------------------------------------------------- AI
  {
    id: "llm-api",
    name: "LLM API integration",
    group: "AI",
    status: "planned",
    progress: 0,
    why: "26.5% of full-stack postings now explicitly ask for new-wave GenAI skills. This is the layer that makes me 'AI-enabled' rather than 'uses AI'.",
    tags: ["ai", "api"],
  },
  {
    id: "rag",
    name: "RAG with citations",
    group: "AI",
    status: "planned",
    progress: 0,
    why: "Grounding is what separates a useful AI feature from a hallucination generator. Citations are the proof.",
    tags: ["ai", "rag", "search"],
  },
  {
    id: "agents",
    name: "Agents & MCP",
    group: "AI",
    status: "planned",
    progress: 0,
    why: "AI agents appear in 10.4% of full-stack postings and 21% of AI job posts. The fastest-growing category.",
    tags: ["ai", "agents", "mcp"],
  },
  {
    id: "evals",
    name: "Evals & guardrails",
    group: "AI",
    status: "planned",
    progress: 0,
    why: "The most underrated skill in the list: how do you know the AI feature is actually correct? This is what separates an engineer from someone who copied a prompt.",
    tags: ["ai", "quality", "testing"],
  },
  {
    id: "prompting",
    name: "Prompt design",
    group: "AI",
    status: "building",
    progress: 55,
    why: "Already in use: this site's entire content pipeline and my study agent contract. Listed as a top-11 employer-requested AI skill.",
    tags: ["ai", "prompting"],
  },

  // ---------------------------------------------------------------- CS Core
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    group: "CS Core",
    status: "learning",
    progress: 30,
    why: "The interview filter. My diploma covers it — so it's free marks if I actually do the problems instead of just reading the chapter.",
    tags: ["interview", "fundamentals"],
  },
  {
    id: "dbms",
    name: "DBMS & normalisation",
    group: "CS Core",
    status: "learning",
    progress: 35,
    why: "In my syllabus and on every backend interview. Also the theoretical half of the SQL skill.",
    tags: ["interview", "database"],
  },
  {
    id: "networks",
    name: "Computer Networks",
    group: "CS Core",
    status: "learning",
    progress: 25,
    why: "In my syllabus. Cheapest interview win available, and it's the mental model behind deploying anything to the internet.",
    tags: ["interview", "fundamentals"],
  },
  {
    id: "os",
    name: "Operating Systems",
    group: "CS Core",
    status: "planned",
    progress: 15,
    why: "In my syllabus. Linux + processes + concurrency show up in devops-adjacent interviews.",
    tags: ["interview", "fundamentals"],
  },

  // ---------------------------------------------------------------- Career
  {
    id: "portfolio",
    name: "Portfolio & open source",
    group: "Career",
    status: "building",
    progress: 20,
    why: "3 shipped repos + 5 merged PRs in other people's codebases. The thing that actually gets interviews in a market where 60% of entry-level roles disappeared.",
    proof: "https://github.com/pabitra27706-oss",
    proofLabel: "GitHub",
    tags: ["portfolio", "open source"],
  },
  {
    id: "system-design",
    name: "System design (lite)",
    group: "Career",
    status: "planned",
    progress: 0,
    why: "28% of postings. Comes after I've shipped and maintained something real — premature system design is just vocabulary.",
    tags: ["architecture", "interview"],
  },
  {
    id: "communication",
    name: "Technical communication",
    group: "Career",
    status: "building",
    progress: 35,
    why: "The #1 most-requested skill of all (23.1% of postings) — above AI. Teaching Maths and Physics to Class 11-12 students every week is deliberate practice for it.",
    tags: ["communication", "teaching"],
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
