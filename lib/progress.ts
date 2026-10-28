import type { Skill } from "@/content/skills";

/**
 * A skill can never be fully "claimed" without a proof link.
 * Anything above 85% without proof is capped — the same discipline the
 * whole project is built on: don't report a feeling as a fact.
 *
 * This module is intentionally free of Node-only imports so it can be used
 * from client components as well as server components.
 */
export function effectiveProgress(skill: Skill): number {
  return skill.proof ? skill.progress : Math.min(skill.progress, 85);
}
