import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui";
import { getArchivePending } from "@/lib/archive";
import { archiveDate } from "@/lib/archive-shared";

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const pending = getArchivePending();
  return {
    title: "Waiting to be judged",
    description: `${pending.count} topics in the Learning Archive have real code and no verdict yet. The newest first.`,
  };
}

/**
 * The queue, in public.
 *
 * Work can arrive in the archive without being a graded task — a file
 * written straight into `archive/content/`, or an older piece of work that
 * predates the engine. None of it has a verdict yet, and a verdict is the
 * whole point of the archive: code without a review is just a file.
 *
 * So the queue is a page. It says what is waiting, when it was written, and
 * where it is.
 */
export default function ArchivePendingPage() {
  const pending = getArchivePending();

  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
      <Link
        href="/archive"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-[12px] text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        the archive
      </Link>

      <header className="mb-10 max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-soft">
          The queue
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Waiting to be judged.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          Every topic in the archive has real code in it. These are the ones
          that have not been read yet — no verdict, no score, no review. Not
          because anything is wrong with them, but because nobody has looked
          at them. The newest work is at the top.
        </p>
        <p className="mt-4 font-mono text-[11px] text-faint">
          {pending.count} topic{pending.count === 1 ? "" : "s"} waiting
        </p>
      </header>

      {pending.count === 0 ? (
        <Card className="px-6 py-12 text-center">
          <p className="text-[15px] text-ink">Nothing is waiting.</p>
          <p className="mt-1.5 text-[13px] text-muted">
            Every file in the archive has been judged.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {pending.topics.map((topic) => (
            <li key={topic.id}>
              <Card className="p-4 transition hover:border-brand/35">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-faint">
                        {topic.language}
                      </span>
                      <Link
                        href={`/archive/${topic.id}`}
                        className="text-[14px] font-medium text-ink transition hover:text-brand-soft"
                      >
                        {topic.title}
                      </Link>
                    </div>
                    <p className="mt-1.5 font-mono text-[11px] text-faint">
                      {archiveDate(topic.dateCreated)} · {topic.reason}
                    </p>
                    {topic.files.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {topic.files.map((file) => (
                          <li key={file} className="font-mono text-[11px] text-muted">
                            {file}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Link
                    href={`/archive/${topic.id}`}
                    className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-faint transition hover:text-brand-soft"
                  >
                    open
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
