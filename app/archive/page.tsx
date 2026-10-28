import type { Metadata } from "next";
import { ArchiveBrowser } from "@/components/archive-browser";
import { Stat } from "@/components/ui";
import { getArchiveIndex } from "@/lib/archive";
import { archiveDaysLearning } from "@/lib/archive-shared";

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

      <section className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Topics" value={index.metadata.totalTopics} hint="Every one has real code in it." />
        <Stat label="Code files" value={index.metadata.totalFiles} hint="Downloadable, one click." />
        <Stat label="Languages" value={languages} hint={index.metadata.languages.join(", ")} />
        <Stat
          label="Days learning"
          value={days}
          hint={graded ? `${graded} topic${graded === 1 ? "" : "s"} graded by the engine.` : undefined}
        />
      </section>

      <ArchiveBrowser index={index} />
    </main>
  );
}
