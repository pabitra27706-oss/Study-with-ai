/**
 * Site-wide identity. Edit this to change your name, tagline and social links.
 * Everything else on the site reads from here.
 */

export const site = {
  name: "Pabitra",
  /** Shown in the hero. Keep it to one sentence. */
  tagline:
    "A diploma CS student in Kolkata building a career-grade skill set with AI — and documenting every step of it.",
  /** Longer description used in the hero paragraph and on /links. */
  intro:
    "I'm a Computer Science & Technology diploma student at APC Ray Polytechnic, Kolkata. I'm using AI as a study partner, Git as memory, and the web as proof. This site is the live output of that system: skills I'm building, projects I've shipped, and what I got wrong along the way.",
  location: "Kolkata, West Bengal, India",
  /** Your target role — keep it honest and current. */
  targetRole: "Junior Software Engineer / Full-Stack Developer",
  /** Year you're working toward. */
  targetYear: "Lateral entry B.Tech, CSE — Jadavpur University",
  email: "your-email@example.com",

  links: {
    github: "https://github.com/pabitra27706-oss",
    repo: "https://github.com/pabitra27706-oss/Study-with-ai",
    linkedin: "https://www.linkedin.com/in/your-handle",
    twitter: "",
    email: "your-email@example.com",
  },
} as const;

export type Site = typeof site;
