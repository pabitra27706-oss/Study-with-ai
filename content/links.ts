/**
 * The link hub — every live URL in one place, one click to copy.
 * This is the page you paste into an application or share in a message.
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
    label: "GitHub profile",
    url: "https://github.com/pabitra27706-oss",
    kind: "code",
    note: "Projects, PRs and pinned work",
  },
  {
    id: "l-linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/your-handle",
    kind: "social",
    note: "Update the Projects section before the Education section",
  },
  {
    id: "l-jelet",
    label: "JELET — official board",
    url: "https://wbjeeb.nic.in/jelet/",
    kind: "doc",
    note: "Exam, bulletins, seat matrix and counselling notices",
  },
  {
    id: "l-jadavpur",
    label: "Jadavpur University",
    url: "https://admissionju.jadavpuruniversity.in/",
    kind: "doc",
    note: "Target seat: B.E./B.Tech Lateral, CSE — 9 seats",
  },
  {
    id: "l-wbscte",
    label: "WBTESD — WB polytechnic syllabus",
    url: "https://webscte.co.in/",
    kind: "doc",
    note: "My own curriculum, in public",
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
