import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readRepoDoc } from "@/lib/journal";
import { renderMarkdown } from "@/lib/markdown";
import { DocViewer } from "@/components/doc-viewer";

export const metadata: Metadata = {
  title: "GitHub audit",
  description:
    "A full audit of both GitHub accounts: what the 47 repositories actually prove, what is missing, and the 30-day fix list.",
};

export default async function AuditPage() {
  const doc = readRepoDoc("GITHUB-AUDIT.md");
  const html = await renderMarkdown(doc.body);

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"
        >
          ← Back to the dashboard
        </Link>
      </div>

      <DocViewer
        kicker="Audit · 28 October 2026"
        title="What your GitHub actually proves"
        intro="Both accounts, every repository, read straight off the GitHub API. The short version: you are not a beginner, and the reason nobody can tell is that both profile READMEs are empty and your best project has no live link."
        html={html}
        backHref="/"
        backLabel="Back to the dashboard"
      />

      <div className="mx-auto max-w-6xl px-5 pb-20">
        <div className="flex flex-wrap gap-4">
          <Link
            href="/phone"
            className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
          >
            Next: the phone-first operating manual <ArrowRight size={14} />
          </Link>
          <Link
            href="/playbook/roadmap"
            className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
          >
            The career roadmap <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
