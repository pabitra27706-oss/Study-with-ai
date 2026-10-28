import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Card, Tag } from "@/components/ui";
import { ArchiveCodeCard } from "@/components/archive-code";
import {
  getArchiveTopic,
  getArchiveTopicIds,
  getArchiveFileText,
  highlightArchiveFile,
} from "@/lib/archive";
import { archiveDate, archiveLanguageTone } from "@/lib/archive-shared";

export const dynamic = "force-static";


export function generateStaticParams() {
  return getArchiveTopicIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = getArchiveTopic(id);
  if (!entry) return { title: "Topic not found" };
  return {
    title: entry.topic.title,
    description: entry.topic.description,
  };
}

const VERDICT_STYLE: Record<string, string> = {
  correct: "border-ok/40 text-ok",
  "mostly-correct": "border-accent/40 text-accent",
  incomplete: "border-warn/40 text-warn",
  incorrect: "border-bad/40 text-bad",
};

export default async function ArchiveTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getArchiveTopic(id);
  if (!entry) notFound();

  const { topic, files, engine } = entry;
  const notes = topic.learningNotes ?? { whatILearned: "", challenges: "", nextSteps: "" };

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <Link
        href="/archive"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-[12px] text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        the archive
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${archiveLanguageTone(topic.language)}`}
          >
            {topic.language}
          </span>
          {topic.category && <Tag>{topic.category}</Tag>}
          {topic.difficulty && <Tag>{topic.difficulty}</Tag>}
          {topic.source === "engine" && (
            <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[11px] text-accent">
              graded
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {topic.title}
        </h1>
        {topic.description && (
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            {topic.description}
          </p>
        )}
        <p className="mt-3 font-mono text-[11px] text-faint">
          {archiveDate(topic.dateCreated)} · {files.length} file{files.length === 1 ? "" : "s"}
          {engine?.tasks
            ? ` · ${engine.tasks} task${engine.tasks === 1 ? "" : "s"}`
            : ""}
        </p>
        {topic.tags && topic.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {topic.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </header>

      {/* ---- code with no verdict: said plainly, not left to be guessed -- */}
      {!engine?.verdict && files.length > 0 && (
        <section className="mb-10">
          <Card className="border-warn/25 bg-warn/5 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-warn">
              Waiting to be judged
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">
              This code arrived in the archive, and nobody has judged it yet.
              There is no verdict, no score and no review — not because
              anything is wrong with it, but because it has not been looked
              at. Say <span className="font-mono text-ink">&quot;check {topic.id}&quot;</span>{" "}
              and it will be read, run and reviewed.
            </p>
          </Card>
        </section>
      )}

      {/* ---- the verdict, for topics the engine graded --------------------- */}
      {engine?.verdict && (
        <section className="mb-10">
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
                  The verdict
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[12px] ${
                      VERDICT_STYLE[engine.verdict.status] ?? "border-line text-faint"
                    }`}
                  >
                    {engine.verdict.status}
                  </span>
                  <span className="font-mono text-3xl font-semibold text-ink">
                    {typeof engine.verdict.score === "number" ? `${engine.verdict.score}%` : "—"}
                  </span>
                  {engine.machine && (
                    <span className="font-mono text-[12px] text-faint">
                      machine {engine.machine.score}% · {engine.machine.tasksPassed}/
                      {engine.machine.tasksTotal} tasks · comments {engine.machine.explain}/100
                    </span>
                  )}
                </div>
                <p className="mt-2 font-mono text-[11px] text-faint">
                  by {engine.verdict.by} · {archiveDate(engine.verdict.at)}
                </p>
              </div>
              {engine.topicId && (
                <Link
                  href={`/learn/${engine.topicId}`}
                  className="rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-[13px] text-brand-soft transition hover:border-brand/70"
                >
                  open the topic
                </Link>
              )}
            </div>

            {engine.machine && typeof engine.verdict.score === "number" && (
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${engine.verdict.score}%` }}
                />
              </div>
            )}
          </Card>
        </section>
      )}

      {/* ---- notes --------------------------------------------------------- */}
      {(notes.whatILearned || notes.challenges || notes.nextSteps) && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-ink">What I wrote down</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {notes.whatILearned && (
              <Card className="p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ok">
                  what I learned
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{notes.whatILearned}</p>
              </Card>
            )}
            {notes.challenges && (
              <Card className="p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-warn">
                  what got in the way
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{notes.challenges}</p>
              </Card>
            )}
            {notes.nextSteps && (
              <Card className="p-4">
                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                  next
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{notes.nextSteps}</p>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* ---- the review ---------------------------------------------------- */}
      {engine?.review && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-ink">The review</h2>
          <Card className="p-5">
            <div className="md space-y-3 text-[14px] leading-relaxed text-muted">
              {engine.review.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph.replace(/\*\*/g, "")}</p>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* ---- misconceptions ------------------------------------------------ */}
      {engine?.misconceptions && engine.misconceptions.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-ink">What I had wrong</h2>
          <ul className="space-y-2">
            {engine.misconceptions.map((item, index) => (
              <li
                key={index}
                className="rounded-[14px] border border-warn/25 bg-warn/5 px-4 py-3 text-[13.5px] leading-relaxed text-muted"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---- the code ------------------------------------------------------ */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">
          The code{files.length === 1 ? "" : " files"}
        </h2>
        {files.length === 0 ? (
          <Card className="px-5 py-10 text-center">
            <p className="text-[14px] text-muted">
              Nothing written yet for this topic. It is here, waiting.
            </p>
            <p className="mx-auto mt-3 max-w-md text-[13px] text-faint">
              Every file you submit for this topic arrives here on its own —
              the code, the score it earned, and the notes. There is nothing
              to upload and nothing to publish.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {files.map((file) => {
              const code = getArchiveFileText(file.filePath);
              const html = highlightArchiveFile(file.fileName, code);
              return <ArchiveCodeCard key={file.id} file={file} code={code} html={html} />;
            })}
          </div>
        )}
      </section>

      {engine?.topicId && (
        <p className="mt-10 font-mono text-[11px] text-faint">
          <Link
            href={`/learn/${engine.topicId}`}
            className="inline-flex items-center gap-1.5 transition hover:text-brand-soft"
          >
            see the full topic, the tasks and the rubric
            <ExternalLink className="h-3 w-3" />
          </Link>
        </p>
      )}
    </main>
  );
}
