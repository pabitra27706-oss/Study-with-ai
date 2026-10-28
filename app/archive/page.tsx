import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ArchiveBrowser } from "@/components/archive-browser";
import { Card, Stat } from "@/components/ui";
import { getArchiveIndex, getArchivePending } from "@/lib/archive";
import { archiveDate, archiveDaysLearning } from "@/lib/archive-shared";

export const dynamic = "force-static";

/* Written from the catalogue, never typed by hand. A number in a
   description that says "69 topics" when the archive holds 74 is a small
   lie on the front page of the whole archive. */
export function generateMetadata(): Metadata {
  const index = getArchiveIndex();
  const languages = index.metadata.languages.join(", ") || "C, Python and JavaScript";
  return {
    title: "Archive",
    description: `Every topic learned, with the real code, the notes and the verdict. ${index.metadata.totalTopics} topics across ${languages} — browsable, searchable and downloadable.`,
  };
}

export default function ArchivePage() {
  const index = getArchiveIndex();
  const days = archiveDaysLearning(index.metadata.firstEntryDate);
  const languages = index.metadata.languages.length;
  const graded = index.topics.filter((topic) => topic.source === "engine").length;
  const judged = index.topics.filter((topic) => topic.verdict).length;
  const pending = getArchivePending();

  /* The newest thing in the archive. Not the first in the catalogue — the
     catalogue is in the order things were added, which is not the order
     they were written. */
  const newest = [...index.topics]
    .filter((topic) => topic.dateCreated)
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated))[0];

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-soft">
          Learning archive
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          Everything I have worked through, in one place.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">
          Not a list of finished products — a record of the work. Every topic
          here has the code I wrote, the notes I took, and the verdict I was
          given. The graded ones are generated straight from the learning
          engine, so they are never out of date.
        </p>
      </header>

      {/* ---- what is new, and what is waiting ----------------------------- */}
      <section className="mb-12 grid gap-4 sm:grid-cols-2">
        {newest && (
          <Card className="p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
              The newest
            </p>
            <Link
              href={`/archive/${newest.id}`}
              className="mt-2 block text-[16px] font-medium text-ink transition hover:text-brand-soft"
            >
              {newest.title}
            </Link>
            <p className="mt-1.5 font-mono text-[11px] text-faint">
              {archiveDate(newest.dateCreated)} · {newest.language} ·{" "}
              {newest.fileCount ?? 0} file{newest.fileCount === 1 ? "" : "s"}
              {newest.score != null && ` · ${newest.score}%`}
            </p>
          </Card>
        )}
        <Card className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            {pending.count > 0 ? "Waiting to be judged" : "Nothing waiting"}
          </p>
          <p className="mt-2 text-[16px] font-medium text-ink">
            {pending.count > 0
              ? `${pending.count} topic${pending.count === 1 ? "" : "s"}`
              : "Every topic has been read"}
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
            {pending.count > 0
              ? "Real code with no review yet. Not broken — just not read."
              : "Real code, read, run and reviewed. The queue is empty — and it refills the moment new work lands."}
          </p>
          {pending.count > 0 && (
            <Link
              href="/archive/pending"
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-brand-soft transition hover:text-ink"
            >
              see the queue
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </Card>
      </section>

      <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Topics" value={index.metadata.totalTopics} hint="Every one has real code in it." />
        <Stat label="Code files" value={index.metadata.totalFiles} hint="Downloadable, one click." />
        <Stat label="Languages" value={languages} hint={index.metadata.languages.join(", ")} />
        <Stat
          label="Days learning"
          value={days}
          hint={
            judged
              ? `${judged} topic${judged === 1 ? "" : "s"} judged${
                  graded ? `, ${graded} straight from the engine` : ""
                }.`
              : undefined
          }
        />
      </section>

      <ArchiveBrowser index={index} />
    </main>
  );
}
