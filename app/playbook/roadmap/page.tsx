import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readRepoDoc } from "@/lib/journal";
import { renderMarkdown } from "@/lib/markdown";
import { DocViewer } from "@/components/doc-viewer";

export const metadata: Metadata = {
  title: "Career roadmap",
  description:
    "The tailored career roadmap: JELET + Jadavpur University CSE, the skill tree, the portfolio, the free stack, and the part-time income plan.",
};

export default async function RoadmapPage() {
  const doc = readRepoDoc("ROADMAP.md");
  const html = await renderMarkdown(doc.body);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-16">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/playbook"
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm text-muted transition hover:text-ink"
          >
            The learning system
          </Link>
          <Link
            href="/playbook/roadmap"
            className="rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm text-brand-soft"
          >
            The career roadmap
          </Link>
        </div>
      </div>

      <DocViewer
        kicker="Playbook · Roadmap"
        title="CS Career Roadmap"
        intro="Two spines sharing the same hours: JELET + Jadavpur University CSE on one side, TypeScript + Python/AI + a shipped portfolio on the other. Research current as of 28 October 2026."
        html={html}
        backHref="/playbook"
        backLabel="Back to the playbook"
      />

      <div className="mx-auto max-w-6xl px-5 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
        >
          Back to the dashboard <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}
