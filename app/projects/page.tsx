import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The portfolio: four repositories, each proving one specific capability a hiring manager can check.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading
        eyebrow="Portfolio"
        title="Four repos. Four proofs."
        description="A diploma student competes with degree holders who have internships. These four repositories are how I compete back — each one exists to prove one specific, checkable thing."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="mt-16 grid gap-5 rounded-[14px] border border-line bg-panel p-6 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-medium text-ink">The rule</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            A repository is not done because the code runs. It is done when a
            stranger can clone it, read the README, and see the thing working in
            under five minutes.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">Every repo needs</h3>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-muted">
            <li>· A README that says what it does and why it exists</li>
            <li>· A licence, and a setup section that actually works</li>
            <li>· A live link, or an honest &ldquo;not deployed yet&rdquo;</li>
            <li>· A screenshot or a 30-second clip</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium text-ink">What I avoid</h3>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-muted">
            <li>· Tutorial clones with the tutorial&rsquo;s name on them</li>
            <li>· Five half-finished repos instead of one good one</li>
            <li>· Committing to a framework I have not understood</li>
            <li>· Writing the README last</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
