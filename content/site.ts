/**
 * Site-wide identity. Edit this to change your name, tagline and social links.
 * Everything else on the site reads from here.
 */

export const site = {
  name: "Pabitra",
  /** Shown in the hero. Keep it to one sentence. */
  tagline:
    "A phone-first full-stack builder from Kolkata — shipping AI products, Android apps and PWAs from a Termux terminal, and documenting every step.",
  /** Longer description used in the hero paragraph and on /links. */
  intro:
    "I'm a Computer Science & Technology diploma student at APC Ray Polytechnic, Kolkata. I build with AI as my grader, Git as my memory, and the web as my proof. My phone is the only computer I have, so everything here was built from a terminal. This site is the live output of that system: what I can do, what I shipped, and what I got wrong along the way.",
  location: "Kolkata, West Bengal, India",
  /** Your target role — keep it honest and current. */
  targetRole: "Android / Full-Stack Developer · AI Engineer",
  /** Year you're working toward. */
  targetYear: "Lateral entry B.Tech, CSE — Jadavpur University",
  email: "your-email@example.com",

  links: {
    /** The account that holds the original work and the live sites. */
    github: "https://github.com/pabitra27706-oss",
    /** The second account — Android tools and phone-first work. */
    githubAlt: "https://github.com/pabiwilliams",
    repo: "https://github.com/pabitra27706-oss/Study-with-ai",
    linkedin: "https://www.linkedin.com/in/your-handle",
    twitter: "",
    email: "your-email@example.com",
  },
} as const;

export type Site = typeof site;
