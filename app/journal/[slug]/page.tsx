import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getJournalEntries, getJournalEntry } from "@/lib/journal";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getJournalEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);
  if (!entry) return { title: "Journal entry" };
  return {
    title: entry.title,
    description: entry.summary || "A learning-log entry.",
  };
}

export default async function JournalEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) notFound();

  const html = await renderMarkdown(entry.body);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Link
        href="/journal"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"
      >
        <ArrowLeft size={14} />
        All entries
      </Link>

      <article className="mt-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-faint">
          <span>{formatDate(entry.date)}</span>
          {entry.tags.map((tag) => (
            <span key={tag} className="text-brand-soft">
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {entry.title}
        </h1>

        {entry.summary && (
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            {entry.summary}
          </p>
        )}

        {entry.mistakes && (
          <div className="mt-6 rounded-xl border border-warn/25 bg-warn/5 p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-warn">
              The mistake
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              {entry.mistakes}
            </p>
          </div>
        )}

        <div
          className="md mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      <div className="mt-16 border-t border-line pt-6">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
        >
          <ArrowLeft size={14} />
          Back to the journal
        </Link>
      </div>
    </div>
  );
}
