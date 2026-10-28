import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, PlayCircle, Terminal } from "lucide-react";
import { Card, Tag } from "@/components/ui";
import { renderMarkdown } from "@/lib/markdown";
import {
  getCurriculumIndex,
  getCurriculumTopic,
  getTopicProgress,
  type CurriculumTask,
  type TaskProgress,
} from "@/lib/curriculum";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getCurriculumIndex().topics.map((topic) => ({ id: topic.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pack = getCurriculumTopic(id);
  if (!pack) return { title: "Topic not found" };
  return {
    title: pack.topic.title,
    description: pack.topic.description,
  };
}

const STATUS_STYLE: Record<string, string> = {
  passed: "border-ok/40 text-ok",
  partial: "border-warn/40 text-warn",
  failed: "border-bad/40 text-bad",
  "compile-error": "border-bad/40 text-bad",
  "not-started": "border-line text-faint",
};

function TaskBlock({
  task,
  result,
}: {
  task: CurriculumTask;
  result?: TaskProgress;
}) {
  const status = result?.status ?? "not-started";
  const publicTests = task.tests.filter((test) => test.public !== false);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${STATUS_STYLE[status]}`}
          >
            {status}
          </span>
          <h3 className="text-[15px] font-semibold text-ink">{task.title}</h3>
          <span className="font-mono text-[11px] text-faint">{task.id}</span>
        </div>
        <span className="font-mono text-[11px] text-faint">
          {result ? `${result.points}/${result.maxPoints}` : `0/${task.points}`} pts
          {result && result.total > 0 ? ` · ${result.passed}/${result.total} tests` : ""}
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        <p className="text-[14px] leading-relaxed text-muted">{task.prompt}</p>

        {result?.compileError && (
          <div className="rounded-lg border border-bad/30 bg-bad/5 px-4 py-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-bad">
              compile error
            </p>
            <p className="mt-1.5 font-mono text-[12.5px] leading-relaxed text-ink">
              {result.compileError}
            </p>
          </div>
        )}

        {result?.failing && result.failing.length > 0 && (
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-wider text-warn">
              failing cases
            </p>
            {result.failing.map((failure, index) => (
              <div
                key={index}
                className="rounded-lg border border-line bg-panel-2 px-4 py-3 font-mono text-[12px] leading-relaxed"
              >
                <p className="text-bad">
                  expected: <span className="text-ink">{failure.expected || "(empty)"}</span>
                </p>
                <p className="text-warn">
                  got: <span className="text-ink">{failure.actual || "(nothing)"}</span>
                </p>
                {failure.error && <p className="mt-1 text-faint">{failure.error}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              example test
            </p>
            <pre className="overflow-x-auto rounded-lg border border-line bg-panel-2 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-muted">
              <code>{`input:  ${publicTests[0]?.stdin.trim() ?? "-"}\nexpect: ${publicTests[0]?.stdout ?? "-"}`}</code>
            </pre>
            <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
              {task.tests.length - publicTests.length} hidden edge case
              {task.tests.length - publicTests.length === 1 ? "" : "s"} run by the grader too.
            </p>
          </div>

          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              what your comment must say
            </p>
            <p className="text-[13px] leading-relaxed text-muted">{task.explainTarget}</p>
          </div>
        </div>

        <details className="group">
          <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-faint transition-colors hover:text-brand-soft">
            hints &amp; starter code
          </summary>
          <div className="mt-3 space-y-3">
            <ul className="space-y-1.5">
              {task.hints.map((hint, index) => (
                <li key={index} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                  <span className="font-mono text-faint">{index + 1}.</span>
                  <span>{hint}</span>
                </li>
              ))}
            </ul>
            <pre className="overflow-x-auto rounded-lg border border-line bg-panel-2 px-4 py-3 font-mono text-[12px] leading-relaxed text-muted">
              <code>{task.starter}</code>
            </pre>
          </div>
        </details>
      </div>
    </Card>
  );
}

export default async function LearnTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pack = getCurriculumTopic(id);
  if (!pack) notFound();

  const { topic, curriculum } = pack;
  const result = getTopicProgress(id);
  const sections = await Promise.all(
    curriculum.explanation.map(async (section) => ({
      ...section,
      html: await renderMarkdown(section.md),
    })),
  );

  const score = result?.score ?? 0;

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
      <Link
        href="/learn"
        className="mb-8 inline-flex items-center gap-1.5 font-mono text-[12px] text-faint transition-colors hover:text-brand-soft"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        all topics
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2">
          <Tag>{topic.language}</Tag>
          <Tag>{topic.category}</Tag>
          <Tag>{topic.difficulty}</Tag>
          {result && (
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
                result.status === "mastered"
                  ? "border-ok/40 text-ok"
                  : result.status === "done"
                    ? "border-accent/40 text-accent"
                    : result.status === "learning"
                      ? "border-warn/40 text-warn"
                      : "border-line text-faint"
              }`}
            >
              {result.status}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          {curriculum.summary}
        </p>

        <div className="mt-6 rounded-[14px] border border-line bg-panel px-5 py-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
                your score
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold text-ink">{score}%</p>
            </div>
            {result && (
              <div className="text-right font-mono text-[11px] leading-relaxed text-faint">
                <p>tasks {result.breakdown.tasks}%</p>
                <p>written {result.breakdown.written}%</p>
                <p>notes {result.breakdown.notes}%</p>
                <p>explain {result.breakdown.explain}%</p>
              </div>
            )}
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </header>

      <section className="mb-12">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <Terminal className="h-3.5 w-3.5 text-faint" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
              how to submit
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed text-muted">
            <code>{`mkdir -p learn/${topic.id}/solutions
nano learn/${topic.id}/solutions/t1.c     # your code

# three lines, no essays
nano learn/${topic.id}/notes.json
nano learn/${topic.id}/answers.json

node runner/grade.mjs                # compile, test, score
git add -A && git commit -m "${topic.id}: t1" && git push`}</code>
          </pre>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="mb-5 text-xl font-semibold text-ink">The explanation</h2>
        <div className="space-y-8">
          {sections.map((section) => (
            <article key={section.h}>
              <h3 className="mb-3 text-base font-semibold text-ink">{section.h}</h3>
              <div
                className="md max-w-none"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-ink">Watch these, in this order</h2>
        <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
          Each source says why it is on the list. The first one is enough to get
          started; the rest are there when a specific part will not stick.
        </p>
        <div className="space-y-3">
          {curriculum.videos.map((video, index) => (
            <a
              key={video.url}
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="group flex gap-4 rounded-[14px] border border-line bg-panel p-4 transition-colors hover:border-brand/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-panel-2 font-mono text-[11px] text-faint">
                {video.minutes ? `${video.minutes}m` : String(index + 1).padStart(2, "0")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[14px] font-medium text-ink">
                  <PlayCircle className="h-3.5 w-3.5 shrink-0 text-brand-soft" />
                  <span className="truncate">{video.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-faint" />
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{video.why}</p>
              </div>
            </a>
          ))}
        </div>

        {curriculum.references.length > 0 && (
          <div className="mt-4 space-y-2">
            {curriculum.references.map((reference) => (
              <a
                key={reference.url}
                href={reference.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-[14px] border border-line bg-panel px-4 py-3 transition-colors hover:border-brand/50"
              >
                <p className="text-[13.5px] font-medium text-ink">{reference.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{reference.why}</p>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-ink">Tasks</h2>
        <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
          Attempt before you look at the hints. The grader runs the hidden edge
          cases as well, and it will not accept a program that only works on the
          example.
        </p>
        <div className="space-y-4">
          {curriculum.tasks.map((task) => (
            <TaskBlock key={task.id} task={task} result={result?.tasks?.[task.id]} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-ink">Written rubric</h2>
        <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
          Four questions, four short answers. The scorer checks which key ideas
          your answer contains — it cannot be fooled by a confident paragraph
          that says nothing.
        </p>
        <div className="space-y-3">
          {curriculum.rubric.written.map((item) => {
            const scored = result?.written.perQuestion?.find((entry) => entry.id === item.id);
            return (
              <Card key={item.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[14px] leading-relaxed text-ink">{item.q}</p>
                  <span
                    className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] ${
                      !scored
                        ? "border-line text-faint"
                        : scored.score >= 1
                          ? "border-ok/40 text-ok"
                          : scored.score > 0
                            ? "border-warn/40 text-warn"
                            : "border-bad/40 text-bad"
                    }`}
                  >
                    {scored ? `${Math.round(scored.score * 100)}%` : "—"}
                  </span>
                </div>
                {scored?.feedback && (
                  <p className="mt-3 border-l-2 border-line pl-3 text-[13px] leading-relaxed text-muted">
                    {scored.feedback}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-ink">Your three lines</h2>
        <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
          {curriculum.rules?.notePolicy ??
            "One sentence each. If it needs more than a sentence, it is not understood yet."}
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(result?.notes.perField ?? []).map((field) => (
            <Card key={field.field} className="p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
                {field.label}
              </p>
              <p className="mt-2 min-h-[3rem] text-[13px] leading-relaxed text-ink">
                {field.text || <span className="text-faint">empty</span>}
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-faint">
                {field.filled ? `${field.chars} chars` : "not written yet"}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {result && result.explain.flags.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-semibold text-ink">Explainability</h2>
          <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
            {curriculum.rules?.commentPolicy ??
              "Every non-obvious line needs a why-comment, not a what-comment."}
          </p>
          <div className="space-y-2">
            {result.explain.flags.map((flag, index) => (
              <div
                key={index}
                className="rounded-lg border border-warn/25 bg-warn/5 px-4 py-3 font-mono text-[12px] leading-relaxed"
              >
                <p className="text-warn">
                  {flag.file ? `${flag.file}:${flag.line}` : `line ${flag.line}`}
                </p>
                <p className="mt-1 text-ink">{flag.message}</p>
                {flag.text && <p className="mt-1 text-faint">&ldquo;{flag.text}&rdquo;</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {result?.aiReview?.markdown && (
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-semibold text-ink">Review</h2>
          <div
            className="md max-w-none"
            dangerouslySetInnerHTML={{ __html: await renderMarkdown(result.aiReview.markdown) }}
          />
        </section>
      )}

      <section className="mb-6">
        <Card className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
            the rules of this topic
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted">
            <li>
              <span className="text-ink">Minimal writing.</span> Three lines of notes,
              each under {curriculum.rules?.writingMaxChars ?? 220} characters. The code
              carries the explanation.
            </li>
            <li>
              <span className="text-ink">Why-comments.</span> A comment that restates
              the code is deleted; a comment that states the reason is kept.
            </li>
            <li>
              <span className="text-ink">Attempt first.</span> Write your attempt before
              you ask the AI for anything. A pasted answer is an illusion of competence.
            </li>
          </ul>
        </Card>
      </section>
    </main>
  );
}
