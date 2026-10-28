import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CircleCheck, Terminal } from "lucide-react";
import { Card, SectionHeading, Tag } from "@/components/ui";
import { getCurriculumIndex, getProgress } from "@/lib/curriculum";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "AI-written topics with curated video sources, machine-checked tasks, and a grader that runs your code. Read, attempt, commit — the compiler decides.",
};

export const dynamic = "force-static";

const STEPS = [
  {
    n: "01",
    title: "Read",
    body: "The topic is written out in full: the idea, the exact evaluation order, the four bugs that cost marks, and the video worth watching for each part.",
  },
  {
    n: "02",
    title: "Attempt",
    body: "You write the code and answer four short questions. You write as little prose as possible — three lines of notes and a commented program. The code carries the explanation.",
  },
  {
    n: "03",
    title: "Commit",
    body: "One commit from your phone. The grader compiles your C, runs it against hidden test cases, checks that your comments explain why, and scores your written answers.",
  },
  {
    n: "04",
    title: "See the number",
    body: "The score lands in the site and in your repo history. A topic is not finished because it felt good — it is finished because the tests pass and you can answer without the notes.",
  },
];

export default function LearnPage() {
  const index = getCurriculumIndex();
  const progress = getProgress();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
      <header className="mb-14 max-w-3xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-brand-soft">
          AI curriculum
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
          Learn it. Solve it. Let the compiler judge.
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted sm:text-base">
          Each topic is written out in full — the explanation, the best video for
          each part, and tasks with hidden test cases. You attempt it before you
          look. Then the grader compiles your code, runs it, and tells you the
          truth. Nothing here asks you to feel like you are learning.
        </p>
      </header>

      <section className="mb-16">
        <SectionHeading
          eyebrow="The loop"
          title="Four moves, repeated until the score is real"
          description="The same loop every day. It takes about ninety minutes for a full topic, and about twenty minutes for a single sitting."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <Card key={step.n} className="p-5">
              <p className="font-mono text-xs text-brand-soft">{step.n}</p>
              <h3 className="mt-2 text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading
          eyebrow="Topics"
          title="What is open right now"
          description="Every topic below has a full explanation, curated sources, graded tasks, and a written rubric."
        />
        <div className="grid gap-4">
          {index.topics.map((topic) => {
            const result = progress?.topics?.[topic.id];
            const score = result?.score ?? 0;
            const done = result
              ? Object.values(result.tasks).filter((task) => task.status === "passed").length
              : 0;
            const total = index.topics.length ? topic.points : 0;

            return (
              <Link
                key={topic.id}
                href={`/learn/${topic.id}`}
                className="group rounded-[14px] border border-line bg-panel p-5 transition-colors hover:border-brand/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-ink">{topic.title}</h3>
                      <Tag>{topic.language}</Tag>
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
                    <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
                      {topic.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {topic.tags.slice(0, 6).map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-4">
                    <div className="text-right">
                      <p className="font-mono text-2xl font-semibold text-ink">
                        {score}%
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-faint">
                        {done} tasks done
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand-soft" />
                  </div>
                </div>

                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                  <div
                    className="h-full rounded-full bg-accent transition-[width] duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] text-faint">
                  {topic.minutes} min · {total} points · {topic.tags.length} tags
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-6">
        <SectionHeading
          eyebrow="From your phone"
          title="The whole loop is four commands"
          description="No laptop, no local build, no API key. Termux has a C compiler; GitHub Pages does the rest."
        />
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
            <Terminal className="h-3.5 w-3.5 text-faint" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
              Termux
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed text-muted">
            <code>{`# 1. read the topic on the site
# 2. write your attempt
nano ~/Study-with-ai/learn/c-loops/solutions/t1.c

# 3. grade it — compiles your C, runs the tests, writes the score
node runner/grade.mjs

# 4. ship it — Pages rebuilds and your scoreboard updates
git add -A && git commit -m "c-loops: t1 done" && git push`}</code>
          </pre>
        </Card>
      </section>

      <section className="mb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <BookOpen className="h-4 w-4 text-brand-soft" />
            <h3 className="mt-3 text-sm font-semibold text-ink">Explanation first</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Every topic opens with the full written explanation, not a teaser
              and not a summary. Read it, then watch one video for the part that
              still does not click.
            </p>
          </Card>
          <Card className="p-5">
            <CircleCheck className="h-4 w-4 text-brand-soft" />
            <h3 className="mt-3 text-sm font-semibold text-ink">Hidden test cases</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              You see one example per task. The grader runs the edge cases too —
              zero, one, leading zeros, the boundary. A program that only works
              on the example does not pass.
            </p>
          </Card>
          <Card className="p-5">
            <Terminal className="h-4 w-4 text-brand-soft" />
            <h3 className="mt-3 text-sm font-semibold text-ink">The why-comment rule</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Comments that restate the code are flagged. Loop headers and
              accumulators without a reason are flagged. Your code has to argue
              for itself.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}
