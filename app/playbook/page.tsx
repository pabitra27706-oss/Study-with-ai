import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readRepoDoc } from "@/lib/journal";
import { renderMarkdown } from "@/lib/markdown";
import { DocViewer } from "@/components/doc-viewer";

export const metadata: Metadata = {
  title: "Playbook",
  description:
    "The research-backed learning system behind this repo: how AI is used, what Git is for, and the rules that keep it honest.",
};

export default async function PlaybookPage() {
  const doc = readRepoDoc("LEARNING-JOURNEY.md");
  const html = await renderMarkdown(doc.body);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-16">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/playbook"
            className="rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm text-brand-soft"
          >
            The learning system
          </Link>
          <Link
            href="/playbook/roadmap"
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm text-muted transition hover:text-ink"
          >
            The career roadmap
          </Link>
        </div>
      </div>

      <DocViewer
        kicker="Playbook"
        title="The AI-Assisted Learning Journey"
        intro="The original design document for this repository — a research-backed account of how AI is used for learning, what Git is actually for, and the guardrails that keep the system honest. Research current as of 28 October 2026; every empirical claim in the document links to its source."
        html={html}
        backHref="/"
        backLabel="Back to the dashboard"
      />

      <div className="mx-auto max-w-6xl px-5 pb-20">
        <Link
          href="/playbook/roadmap"
          className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
        >
          Next: the career roadmap <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}
