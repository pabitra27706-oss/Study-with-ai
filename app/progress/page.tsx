import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GitCommitVertical, NotebookPen, TrendingUp } from "lucide-react";
import { Card, SectionHeading, Stat } from "@/components/ui";
import { getJournalEntries } from "@/lib/journal";
import {
  getArchiveMonths,
  getProgressSummary,
  getTimeline,
  getTopicArcs,
} from "@/lib/timeline";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Progress",
  description:
    "The real history: every judgement, every correction, every score — read straight out of the repository, so it cannot drift away from what actually happened.",
};

export const dynamic = "force-static";

const VERDICT_STYLE: Record<string, string> = {
  correct: "border-ok/40 text-ok",
  "mostly-correct": "border-accent/40 text-accent",
  incomplete: "border-warn/40 text-warn",
  incorrect: "border-bad/40 text-bad",
};

export default function ProgressPage() {
  const summary = getProgressSummary();
  const arcs = getTopicArcs();
  const timeline = getTimeline();
  const months = getArchiveMonths();
  const journal = getJournalEntries();

  const maxMonthTopics = months.reduce((max, month) => Math.max(max, month.topics), 0);

  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-soft">
          The history map
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          Every judgement, in the order it happened.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">
          Nothing on this page is written for the page. It is read back out of
          the repository — the dated lines in each topic&rsquo;s history, the
          verdicts in the progress file, the notes I wrote after each attempt.
          If it is not in the repository, it is not here.
        </p>
      </header>

      <section className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Judgements" value={summary.attempts} hint="Every time a submission was read." />
        <Stat label="Topics judged" value={summary.topicsJudged} hint="Open and finished." />
        <Stat label="Best score" value={`${summary.best}%`} hint="The highest verdict reached." />
        <Stat
          label="Tasks passing"
          value={summary.tasksTotal ? `${summary.tasksPassed}/${summary.tasksTotal}` : "—"}
          hint="Hidden test cases included."
        />
      </section>

      {timeline.length === 0 ? (
        <Card className="mb-14 px-6 py-14 text-center">
          <GitCommitVertical className="mx-auto text-faint" size={22} />
          <p className="mt-4 text-[15px] text-ink">No judgements yet.</p>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted">
            Write the first task in CodeC, push it, and say{" "}
            <span className="font-mono text-brand-soft">check data-structures-c</span>. The
            line you get back is the first entry on this page.
          </p>
        </Card>
      ) : (
        <section className="mb-16">
          <SectionHeading
            eyebrow="The arc"
            title="What happened, topic by topic"
            description="Each line is one judgement. The score moving is the whole point — a rising number here is worth more than any certificate."
          />

          <div className="space-y-5">
            {arcs
              .filter((arc) => arc.entries.length > 0)
              .map((arc) => (
                <Card key={arc.topicId} className="overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-ink">{arc.title}</h3>
                        {arc.state === "archived" && (
                          <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-faint">
                            archived
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-faint">
                        {arc.entries.length} judgement{arc.entries.length === 1 ? "" : "s"}
                        {arc.best ? ` · best ${arc.best}%` : ""}
                      </p>
                    </div>
                    {arc.state === "current" ? (
                      <Link
                        href={`/learn/${arc.topicId}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[12px] text-muted transition hover:border-brand/40 hover:text-brand-soft"
                      >
                        open the topic
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : null}
                  </div>

                  <ol className="divide-y divide-line-soft">
                    {arc.entries.map((entry, index) => (
                      <li key={`${entry.date}-${index}`} className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-[11px] text-faint">
                            {formatDate(entry.date)}
                          </span>
                          <span
                            className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
                              VERDICT_STYLE[entry.status] ?? "border-line text-faint"
                            }`}
                          >
                            {entry.status}
                          </span>
                          <span className="font-mono text-[13px] font-semibold text-ink">
                            {entry.score}%
                          </span>
                          {entry.tasks && (
                            <span className="font-mono text-[11px] text-faint">{entry.tasks}</span>
                          )}
                        </div>
                        {entry.note && (
                          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
                            {entry.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </Card>
              ))}
          </div>
        </section>
      )}

      {months.length > 0 && (
        <section className="mb-16">
          <SectionHeading
            eyebrow="The long tail"
            title="Before the engine existed"
            description="The hand-written catalogue — every topic archived before the grading loop was built. It is the back catalogue, and the graph below is the honest shape of it."
          />
          <Card className="p-5">
            <div className="space-y-2.5">
              {months.map((month) => (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="w-20 shrink-0 font-mono text-[11px] text-faint">
                    {month.month}
                  </span>
                  <div className="h-4 flex-1 overflow-hidden rounded bg-line-soft">
                    <div
                      className="h-full rounded bg-brand/50"
                      style={{ width: `${(month.topics / maxMonthTopics) * 100}%` }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right font-mono text-[11px] text-muted">
                    {month.topics} topic{month.topics === 1 ? "" : "s"} · {month.files}f
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] text-faint">
              <Link href="/archive" className="transition hover:text-brand-soft">
                browse all {months.reduce((sum, month) => sum + month.topics, 0)} of them →
              </Link>
            </p>
          </Card>
        </section>
      )}

      {journal.length > 0 && (
        <section className="mb-6">
          <SectionHeading
            eyebrow="In my own words"
            title="The journal"
            description="The one folder an AI is not allowed to write. These are my own attempts, my own mistakes and my own fixes."
          />
          <div className="space-y-3">
            {journal.map((entry) => (
              <Link
                key={entry.slug}
                href={`/journal/${entry.slug}`}
                className="group flex items-start gap-3 rounded-[14px] border border-line bg-panel p-4 transition hover:border-brand/40"
              >
                <NotebookPen className="mt-0.5 h-4 w-4 shrink-0 text-brand-soft" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-ink transition group-hover:text-brand-soft">
                    {entry.title}
                  </p>
                  {entry.summary && (
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">
                      {entry.summary}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[11px] text-faint">
                  {formatDate(entry.date)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-12 flex items-center gap-2 font-mono text-[11px] text-faint">
        <TrendingUp className="h-3.5 w-3.5" />
        The score moves when the work moves. Nothing on this page is edited by hand.
      </p>
    </main>
  );
}
