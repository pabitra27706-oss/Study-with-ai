import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, PlayCircle, Terminal } from "lucide-react";
import { Card, Tag } from "@/components/ui";
import { renderMarkdown } from "@/lib/markdown";
import {
  getCurriculumIndex,
  getCurriculumTopic,
  getEvidence,
  getTopicHistory,
  getTopicProgress,
  type CurriculumTask,
  type TaskEvidence,
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

const VERDICT_STYLE: Record<string, string> = {
  correct: "border-ok/40 text-ok",
  "mostly-correct": "border-accent/40 text-accent",
  incomplete: "border-warn/40 text-warn",
  incorrect: "border-bad/40 text-bad",
  "judge-error": "border-bad/40 text-bad",
};

const TASK_STYLE: Record<string, string> = {
  passed: "border-ok/40 text-ok",
  partial: "border-warn/40 text-warn",
  failed: "border-bad/40 text-bad",
  "compile-error": "border-bad/40 text-bad",
  "not-submitted": "border-line text-faint",
  "not-started": "border-line text-faint",
};

function TaskBlock({ task, result }: { task: CurriculumTask; result?: TaskEvidence }) {
  const status = result?.status ?? "not-submitted";
  const publicTests = task.tests.filter((test) => test.public !== false);
  const hidden = task.tests.length - publicTests.length;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${TASK_STYLE[status]}`}>
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
            <p className="font-mono text-[11px] uppercase tracking-wider text-bad">compile error</p>
            <p className="mt-1.5 font-mono text-[12.5px] leading-relaxed text-ink">
              {result.compileError}
            </p>
          </div>
        )}

        {result?.failing && result.failing.length > 0 && (
          <div className="space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-wider text-warn">failing cases</p>
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
              {hidden} hidden edge case{hidden === 1 ? "" : "s"} run by the agent too.
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
  const verdict = getTopicProgress(id);
  const evidence = getEvidence();
  const topicEvidence = evidence?.topics?.[id];
  const history = getTopicHistory(id);

  const sections = await Promise.all(
    curriculum.explanation.map(async (section) => ({
      ...section,
      html: await renderMarkdown(section.md),
    })),
  );

  const score = verdict?.score ?? 0;
  const notes = verdict?.notes;
  const reviewHtml = verdict?.review ? await renderMarkdown(verdict.review) : null;

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
          {verdict && (
            <span className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${VERDICT_STYLE[verdict.status] ?? "border-line text-faint"}`}>
              {verdict.status}
            </span>
          )}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {topic.title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{curriculum.summary}</p>
      </header>

      {verdict && (
        <section className="mb-12">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
                  the agent&apos;s verdict
                </p>
                <p className="mt-1.5 flex items-center gap-2.5">
                  <span className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${VERDICT_STYLE[verdict.status] ?? "border-line text-faint"}`}>
                    {verdict.status}
                  </span>
                  <span className="font-mono text-2xl font-semibold text-ink">{score}%</span>
                </p>
              </div>
              <p className="font-mono text-[11px] leading-relaxed text-faint">
                judged {verdict.lastRun?.slice(0, 16).replace("T", " ")}
                {verdict.provider ? ` by ${verdict.provider}` : ""}
                {verdict.tasksTotal ? ` · ${verdict.tasksPassed}/${verdict.tasksTotal} tasks` : ""}
              </p>
            </div>

            {notes && (
              <div className="grid gap-px bg-line sm:grid-cols-3">
                {[
                  { label: "What I learned", value: notes.whatILearned },
                  { label: "What broke", value: notes.challenges },
                  { label: "What is next", value: notes.nextSteps },
                ].map((line) => (
                  <div key={line.label} className="bg-panel px-5 py-4">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
                      {line.label}
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink">
                      {line.value || <span className="text-faint">—</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {reviewHtml && (
              <div className="border-t border-line px-5 py-5">
                <div className="md max-w-none" dangerouslySetInnerHTML={{ __html: reviewHtml }} />
              </div>
            )}

            {verdict.misconceptions && verdict.misconceptions.length > 0 && (
              <div className="border-t border-line px-5 py-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-warn">
                  misconceptions to unlearn
                </p>
                <ul className="mt-3 space-y-1.5">
                  {verdict.misconceptions.map((item, index) => (
                    <li key={index} className="flex gap-2 text-[13px] leading-relaxed text-muted">
                      <span className="font-mono text-faint">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </section>
      )}

      <section className="mb-12">
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <Terminal className="h-3.5 w-3.5 text-faint" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
              submit from anywhere
            </span>
          </div>
          <div className="space-y-4 px-4 py-4">
            <p className="text-[13px] leading-relaxed text-muted">
              You do not have to be in this repository, or on this machine. Write the
              code wherever you like and push it here — or open an issue on GitHub and
              paste it in. The agent picks it up either way and writes its notes back
              into the repository.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-line bg-panel-2 px-4 py-3 font-mono text-[12.5px] leading-relaxed text-muted">
              <code>{`# A. push it
nano learn/${topic.id}/solutions/t1.c
nano learn/${topic.id}/answers.json
git add -A && git commit -m "${topic.id}: t1" && git push

# B. or open an issue — paste the code and the answers
gh issue create --title "[${topic.id}] t1" --label "topic:${topic.id}" --body "$(cat <<'EOF'
# Topic: ${topic.id}
# Task: t1

\`\`\`c
// your code
\`\`\`

# Answers
q1: your answer
EOF
)"`}</code>
            </pre>
          </div>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="mb-5 text-xl font-semibold text-ink">The explanation</h2>
        <div className="space-y-8">
          {sections.map((section) => (
            <article key={section.h}>
              <h3 className="mb-3 text-base font-semibold text-ink">{section.h}</h3>
              <div className="md max-w-none" dangerouslySetInnerHTML={{ __html: section.html }} />
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
          Attempt before you look at the hints. The agent runs the hidden edge cases
          as well, and it will not accept a program that only works on the example.
        </p>
        <div className="space-y-4">
          {curriculum.tasks.map((task) => (
            <TaskBlock key={task.id} task={task} result={topicEvidence?.tasks?.[task.id]} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-2 text-xl font-semibold text-ink">Written rubric</h2>
        <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
          Four questions, four short answers. The keyword coverage below is a hint
          for you; the agent judges the meaning itself.
        </p>
        <div className="space-y-3">
          {curriculum.rubric.written.map((item) => {
            const scored = topicEvidence?.written.perQuestion?.find((entry) => entry.id === item.id);
            const answer = topicEvidence?.answers?.[item.id];
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
                {answer && (
                  <p className="mt-3 border-l-2 border-brand/40 pl-3 text-[13px] leading-relaxed text-muted">
                    {answer}
                  </p>
                )}
                {scored?.feedback && scored.score < 1 && (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-faint">{scored.feedback}</p>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {topicEvidence?.explain.flags && topicEvidence.explain.flags.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-semibold text-ink">Comment problems</h2>
          <p className="mb-5 text-[13.5px] leading-relaxed text-muted">
            {curriculum.rules?.commentPolicy ??
              "Every non-obvious line needs a why-comment, not a what-comment."}
          </p>
          <div className="space-y-2">
            {topicEvidence.explain.flags.map((flag, index) => (
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

      {history.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-2 text-xl font-semibold text-ink">Review history</h2>
          <p className="mb-4 text-[13.5px] leading-relaxed text-muted">
            Every judgement the agent has made on this topic, newest last.
          </p>
          <ul className="space-y-1.5">
            {history.map((line, index) => (
              <li key={index} className="font-mono text-[12px] leading-relaxed text-muted">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-6">
        <Card className="p-5">
          <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
            the rules of this topic
          </p>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted">
            <li>
              <span className="text-ink">Minimal writing.</span> Four short answers — and
              the agent writes the three notes lines, from what your code and answers
              actually show.
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
