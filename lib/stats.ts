import { skills, type Skill } from "@/content/skills";
import { projects } from "@/content/projects";
import { getJournalEntries } from "@/lib/journal";
import { effectiveProgress } from "@/lib/progress";

export { effectiveProgress };

export interface SiteStats {
  /** 0-100 headline readiness number. */
  readiness: number;
  totalSkills: number;
  shipped: number;
  building: number;
  learning: number;
  planned: number;
  /** Skills with a proof link attached. */
  proven: number;
  shippedProjects: number;
  totalProjects: number;
  journalEntries: number;
  /** Skills I am actively working on, weakest first. */
  focus: Skill[];
}

/** Server-side only — reads the journal from disk. */
export function computeStats(): SiteStats {
  const total = skills.length;
  const readiness = total
    ? Math.round(skills.reduce((acc, s) => acc + effectiveProgress(s), 0) / total)
    : 0;

  const byStatus = (status: Skill["status"]) =>
    skills.filter((s) => s.status === status).length;

  const focus = skills
    .filter((s) => s.status === "building" || s.status === "learning")
    .sort((a, b) => effectiveProgress(a) - effectiveProgress(b))
    .slice(0, 4);

  return {
    readiness,
    totalSkills: total,
    shipped: byStatus("shipped"),
    building: byStatus("building"),
    learning: byStatus("learning"),
    planned: byStatus("planned"),
    proven: skills.filter((s) => Boolean(s.proof)).length,
    shippedProjects: projects.filter((p) => p.status === "shipped").length,
    totalProjects: projects.length,
    journalEntries: getJournalEntries().length,
    focus,
  };
}
