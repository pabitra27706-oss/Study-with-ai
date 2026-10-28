import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Card, Tag } from "@/components/ui";
import {
  getArchiveTopic,
  getArchiveTopicIds,
  getArchiveFileText,
  highlightArchiveFile,
} from "@/lib/archive";
import { archiveDate, archiveLanguageTone } from "@/lib/archive-shared";

export const dynamic = "force-static";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
          {engine?.tasks ? ` · ${engine.tasks} tasks` : ""}
        </p>
        {topic.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {topic.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </header>

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
                    {engine.verdict.score}%
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

            {engine.machine && (
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
          </Card>
        ) : (
          <div className="space-y-4">
            {files.map((file) => {
              const code = getArchiveFileText(file.filePath);
              const html = highlightArchiveFile(file.fileName, code);
              const passed = (file.passed ?? 0) > 0;
              const allPassed = file.total ? file.passed === file.total : false;

              return (
                <Card key={file.id} className="overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[13px] text-ink">{file.fileName}</p>
                      {file.description && (
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                          {file.description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {file.total ? (
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
                            allPassed
                              ? "border-ok/40 text-ok"
                              : passed
                                ? "border-warn/40 text-warn"
                                : "border-line text-faint"
                          }`}
                        >
                          {file.passed}/{file.total} tests
                        </span>
                      ) : null}
                      {file.maxPoints ? (
                        <span className="font-mono text-[11px] text-faint">
                          {file.maxPoints} pts
                        </span>
                      ) : null}
                      <a
                        href={`${BASE_PATH}/archive-content/${file.filePath.replace(/^content\//, "")}`}
                        download
                        className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[12px] text-muted transition hover:border-brand/40 hover:text-brand-soft"
                      >
                        <Download className="h-3.5 w-3.5" />
                        download
                      </a>
                    </div>
                  </div>
                  {file.compileError && (
                    <p className="border-b border-line bg-bad/10 px-4 py-2 font-mono text-[11.5px] text-bad">
                      {file.compileError}
                    </p>
                  )}
                  <details className="group">
                    <summary className="cursor-pointer list-none px-4 py-2.5 font-mono text-[11.5px] text-faint transition hover:text-muted">
                      <span className="group-open:hidden">show the code</span>
                      <span className="hidden group-open:inline">hide the code</span>
                    </summary>
                    <pre className="overflow-x-auto border-t border-line-soft bg-panel-2 px-4 py-3 font-mono text-[12px] leading-relaxed text-muted">
                      <code
                        className="hljs"
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </pre>
                  </details>
                </Card>
              );
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
