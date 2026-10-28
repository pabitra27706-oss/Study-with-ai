import type { Metadata } from "next";
import { skills } from "@/content/skills";
import { computeStats } from "@/lib/stats";
import { SkillsExplorer } from "@/components/skills-explorer";
import { SectionHeading, Stat } from "@/components/ui";

export const metadata: Metadata = {
  title: "Skill tree",
  description:
    "Every skill I am building, with honest progress, why it earns its place, and the proof that backs it.",
};

export default function SkillsPage() {
  const stats = computeStats();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading
        eyebrow="Skill tree"
        title="What I can actually do — and what I cannot yet"
        description="Twenty-four skills across six groups. Progress is self-reported and capped at 85% until there is a proof link, because a number without evidence is just optimism with a decimal point."
      />

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Readiness" value={`${stats.readiness}%`} />
        <Stat label="Shipped" value={stats.shipped} hint="Built, documented, linked." />
        <Stat label="In motion" value={stats.building + stats.learning} hint="Learning or building right now." />
        <Stat label="With proof" value={stats.proven} hint="Skills that have a real artifact behind them." />
      </div>

      <SkillsExplorer skills={skills} />
    </div>
  );
}
