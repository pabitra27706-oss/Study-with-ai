import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, NotebookPen } from "lucide-react";
import { getJournalEntries } from "@/lib/journal";
import { SectionHeading } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "The learning log: what I attempted, what I got wrong, and what I changed because of it.",
};

export default function JournalPage() {
  const entries = getJournalEntries();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <SectionHeading
        eyebrow="Journal"
        title="The learning log"
        description="This is the folder an AI agent is not allowed to write. Every entry is my attempt first, the mistake second, and the fix third. It is the most honest part of the repository."
      />

      {entries.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-line p-12 text-center">
          <NotebookPen className="mx-auto text-faint" size={22} />
          <p className="mt-4 text-sm text-muted">
            No entries yet. The first one is always the hardest — write it
            badly, then improve.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={`/journal/${entry.slug}`}
              className="group block rounded-[14px] border border-line bg-panel p-5 transition hover:border-brand/40"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-faint">
                <span>{formatDate(entry.date)}</span>
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-brand-soft">
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-2.5 text-[17px] font-medium text-ink group-hover:text-brand-soft">
                {entry.title}
              </h2>
              {entry.summary && (
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {entry.summary}
                </p>
              )}
              {entry.mistakes && (
                <p className="mt-3 border-l-2 border-warn/40 pl-3 text-[13px] leading-relaxed text-faint">
                  <span className="text-warn">Mistake · </span>
                  {entry.mistakes}
                </p>
              )}
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-accent">
                Read entry <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-[14px] border border-line bg-panel p-6">
        <h2 className="text-sm font-medium text-ink">How an entry is written</h2>
        <ol className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted">
          <li>
            <span className="font-mono text-brand-soft">01</span> — The
            question I was trying to answer, in my own words.
          </li>
          <li>
            <span className="font-mono text-brand-soft">02</span> — My attempt,
            written <em>before</em> I asked the AI anything.
          </li>
          <li>
            <span className="font-mono text-brand-soft">03</span> — Where it was
            wrong, and why I was wrong — not what the correct answer is.
          </li>
          <li>
            <span className="font-mono text-brand-soft">04</span> — The one
            thing I will do differently next time.
          </li>
        </ol>
      </div>
    </div>
  );
}
