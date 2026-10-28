/**
 * The link hub — every live URL in one place, one click to copy.
 * This is the page you paste into an application or share in a message.
 *
 * Updated 28 October 2026 from the live GitHub API. Every URL below was
 * verified to exist.
 */

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  kind: "code" | "site" | "social" | "doc" | "resource";
  note?: string;
}

export const links: LinkItem[] = [
  {
    id: "l-site",
    label: "This site",
    url: "https://pabitra27706-oss.github.io/Study-with-ai/",
    kind: "site",
    note: "Live skill tracker, journal and portfolio",
  },
  {
    id: "l-repo",
    label: "Source of this site",
    url: "https://github.com/pabitra27706-oss/Study-with-ai",
    kind: "code",
    note: "The learning repo — every commit is the record",
  },
  {
    id: "l-github",
    label: "GitHub — main account",
    url: "https://github.com/pabitra27706-oss",
    kind: "code",
    note: "Original work: InsightAI, Jelet-prep, Termux-Mastery, study hubs",
  },
  {
    id: "l-github-alt",
    label: "GitHub — second account",
    url: "https://github.com/pabiwilliams",
    kind: "code",
    note: "Phone-first work: CodeC, AppFlow, Tilefold, Day Ledger",
  },
  {
    id: "l-insightai",
    label: "InsightAI (InsightAI / matriq)",
    url: "https://github.com/pabitra27706-oss/matriq",
    kind: "code",
    note: "AI-powered BI dashboard — Next.js 16 + FastAPI + Gemini",
  },
  {
    id: "l-codec",
    label: "CodeC IDE",
    url: "https://github.com/pabiwilliams/CodeC",
    kind: "code",
    note: "A phone-based coding workspace · 3★",
  },
  {
    id: "l-appflow",
    label: "AppFlow — Phone-First Indie Playbook",
    url: "https://github.com/pabiwilliams/AppFlow",
    kind: "doc",
    note: "The doctrine: build on a phone, let CI be the build machine",
  },
  {
    id: "l-jelet",
    label: "Jelet-prep",
    url: "https://github.com/pabitra27706-oss/Jelet-prep",
    kind: "doc",
    note: "Full JELET syllabus + 7 years of previous-year papers",
  },
  {
    id: "l-termux",
    label: "Termux-Mastery",
    url: "https://github.com/pabitra27706-oss/Termux-Mastery",
    kind: "doc",
    note: "15-module Termux textbook, beginner to advanced",
  },
  {
    id: "l-live-coderanimeme",
    label: "Live — CoderAnimeMe",
    url: "https://pabitra27706-oss.github.io/coderanimeme/",
    kind: "site",
    note: "Programming portfolio and creator platform",
  },
  {
    id: "l-live-portfolio",
    label: "Live — Learning Archive",
    url: "https://pabitra27706-oss.github.io/portfolio/",
    kind: "site",
    note: "Every topic learned, with code and notes",
  },
  {
    id: "l-jadavpur",
    label: "Jadavpur University",
    url: "https://admissionju.jadavpuruniversity.in/",
    kind: "doc",
    note: "Target seat: B.E./B.Tech Lateral, CSE — 9 seats",
  },
  {
    id: "l-jelet-board",
    label: "JELET — official board",
    url: "https://wbjeeb.nic.in/jelet/",
    kind: "doc",
    note: "Exam, bulletins, seat matrix and counselling notices",
  },
  {
    id: "l-linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/your-handle",
    kind: "social",
    note: "Update the Projects section before the Education section",
  },
  {
    id: "l-notebook",
    label: "Gemini Notebook",
    url: "https://notebooklm.google.com/",
    kind: "resource",
    note: "Free tutor grounded only in my own uploaded sources",
  },
  {
    id: "l-anki",
    label: "Anki",
    url: "https://apps.ankiweb.net/",
    kind: "resource",
    note: "Free, open source, FSRS scheduler — the memory engine",
  },
  {
    id: "l-stack",
    label: "GitHub Student Pack",
    url: "https://education.github.com/pack",
    kind: "resource",
    note: "Free Copilot, Codespaces, cloud credits and certifications",
  },
];
