import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  NotebookPen,
  Rss,
  Sparkles,
} from "lucide-react";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { computeStats } from "@/lib/stats";
import { getJournalEntries } from "@/lib/journal";
import { SkillRow } from "@/components/skill-card";
import { ProjectCard } from "@/components/project-card";
import { Timeline } from "@/components/timeline";
import { SectionHeading, Stat } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const stats = computeStats();
  const entries = getJournalEntries();
  const latest = entries.slice(0, 2);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-line/70">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
        />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand-soft">
            {site.location}
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            I build from a phone, and I{" "}
            <span className="text-gradient">prove it</span>.
          </h1>

          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted sm:text-base">
            {site.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand/85"
            >
              See what I shipped
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-5 py-2.5 text-sm text-ink transition hover:border-brand/40"
            >
              Read the GitHub audit
            </Link>
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-5 py-2.5 text-sm text-muted transition hover:border-ink"
            >
              <GitBranch size={15} />
              GitHub
            </a>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              label="Skill readiness"
              value={`${stats.readiness}%`}
              hint="Graded from what the repositories actually contain, and capped where no proof exists."
            />
            <Stat
              label="Skills shipped"
              value={`${stats.shipped} / ${stats.totalSkills}`}
              hint="Shipped means built, documented and linked — not merely studied."
            />
            <Stat
              label="Projects shipped"
              value={`${stats.shippedProjects} / ${stats.totalProjects}`}
              hint="An AI BI dashboard, a phone IDE, two Android apps, a textbook, a JELET archive."
            />
            <Stat
              label="Journal entries"
              value={stats.journalEntries}
              hint="Attempt-first notes. The one folder an AI agent may never write."
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Focus */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="Now"
          title="What I am working on this month"
          description="Four skills in active motion, weakest first. Progress is self-reported and capped at 85% until a proof link exists — the same discipline this whole site runs on."
        />

        <div className="rounded-[14px] border border-line bg-panel px-5">
          {stats.focus.length > 0 ? (
            stats.focus.map((skill) => (
              <SkillRow key={skill.id} skill={skill} />
            ))
          ) : (
            <p className="py-8 text-sm text-muted">
              Nothing marked active yet — pick something and mark it building.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/skills"
            className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
          >
            Open the full skill tree <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------- Principles */}
      <section className="border-y border-line/70 bg-panel/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="Method"
            title="Two rules this whole system runs on"
            description="They look strict. They are the difference between learning something and feeling like you did."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="glow-brand rounded-[14px] border border-line bg-panel p-6">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-brand/30 bg-brand/10">
                  <Sparkles size={15} className="text-brand-soft" />
                </span>
                <h3 className="text-base font-medium text-ink">
                  Attempt before you ask
                </h3>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">
                Research shows unguarded AI tutoring produces better practice
                scores but <span className="text-ink">worse unaided exam
                performance</span> — a study of GPT-4 in a real course found a
                17% drop once the tutor was removed. So the AI never hands me
                the answer. It gives one hint, then asks a harder question.
                I write my attempt first; the AI reacts to what I wrote.
              </p>
            </div>

            <div className="glow-brand rounded-[14px] border border-line bg-panel p-6">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/30 bg-accent/10">
                  <BookOpen size={15} className="text-accent" />
                </span>
                <h3 className="text-base font-medium text-ink">
                  A weekly closed-book, no-AI test
                </h3>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">
                Every Sunday: 45 minutes, no AI, no notes, no browser. Whatever
                I can reproduce is what I actually know. Retrieval practice
                beats re-reading by a large margin, and the score goes on this
                site — including the bad weeks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Timeline */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="Roadmap"
          title="The plan, in order"
          description="Semester 3 to a junior developer role. Each step has a finish line I can prove, not a vibe."
        />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Timeline />
          <aside className="h-fit rounded-[14px] border border-line bg-panel p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-brand-soft">
              Destination
            </p>
            <p className="mt-3 text-[15px] font-medium text-ink">
              {site.targetRole}
            </p>
            <p className="mt-1 text-[13px] text-muted">{site.targetYear}</p>
            <div className="mt-5 space-y-3 border-t border-line-soft pt-5 text-[13px] leading-relaxed text-muted">
              <p>
                <span className="text-ink">2–3 hours a day</span> outside
                college, spent on skill readiness — not on syllabus.
              </p>
              <p>
                <span className="text-ink">TypeScript end to end</span>, with
                Python and LLM tooling as the AI layer.
              </p>
              <p>
                <span className="text-ink">Portfolio over certificates.</span>{" "}
                Shipped code beats a course badge.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* ----------------------------------------------------------- Projects */}
      <section className="border-t border-line/70 bg-panel/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="Portfolio"
            title="What I have actually shipped"
            description="Recruiters read projects before education. Every repo here has one job: prove one specific capability — an AI product, a phone IDE, two Android apps, a JELET archive, a textbook."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
          >
            All projects and what each proves <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* -------------------------------------------------------------- Phone */}
      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <SectionHeading
                eyebrow="Constraints"
                title="I have no computer. The phone is the machine."
                description="Everything on this site was typed in a Termux terminal on Android. That is not a limitation I apologise for — it forced a system: the phone does the thinking, and GitHub Actions does the building."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[14px] border border-line bg-panel p-5">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-brand-soft">
                    The phone does
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    Reading, writing, committing. Git, gh, Python, Node, a shell
                    and an editor. The whole learning loop, attempt-first, in
                    twenty-minute sessions.
                  </p>
                </div>
                <div className="rounded-[14px] border border-line bg-panel p-5">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-accent">
                    The CI runner does
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    TypeScript, ESLint, the static export, Gradle, Docker,
                    deployments. Because Android is bionic and Next.js needs
                    glibc, the build cannot happen on the phone anyway — so it
                    does not.
                  </p>
                </div>
              </div>
              <Link
                href="/phone"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
              >
                The full phone-first operating manual <ArrowRight size={14} />
              </Link>
            </div>

            <aside className="h-fit rounded-[14px] border border-line bg-panel p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-brand-soft">
                GitHub audit · 28 Oct 2026
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-muted">
                Both accounts, 47 repositories, read off the live API. The
                short version: you are not a beginner, and nobody can tell,
                because both profile READMEs are empty and the best project
                has no live link.
              </p>
              <Link
                href="/audit"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
              >
                Read the audit <ArrowRight size={14} />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Journal */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <SectionHeading
          eyebrow="Journal"
          title="What I got wrong, in writing"
          description="The learning log. Attempt first, then the mistake, then the fix. This is the folder an AI agent is not allowed to write."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {latest.length > 0 ? (
            latest.map((entry) => (
              <Link
                key={entry.slug}
                href={`/journal/${entry.slug}`}
                className="group rounded-[14px] border border-line bg-panel p-5 transition hover:border-brand/40"
              >
                <div className="flex items-center gap-2 font-mono text-[11px] text-faint">
                  <NotebookPen size={12} />
                  {formatDate(entry.date)}
                  {entry.tags.length > 0 && (
                    <span className="text-brand-soft">· {entry.tags.join(" · ")}</span>
                  )}
                </div>
                <h3 className="mt-3 text-[15px] font-medium text-ink group-hover:text-brand-soft">
                  {entry.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {entry.summary}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted">
              No journal entries yet — write the first one.
            </p>
          )}
        </div>
        <Link
          href="/journal"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
        >
          <Rss size={14} />
          Read the journal
        </Link>
      </section>

      {/* --------------------------------------------------------------- CTA */}
      <section className="border-t border-line/70">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-ink sm:text-3xl">
            The point of this site is that it cannot be faked.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            Every number here is generated from the repository. Every skill
            needs a proof link before it can be called shipped. Every journal
            entry is written by me, unaided, before the AI sees it.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/playbook"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand/85"
            >
              Read the playbook
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/links"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel px-5 py-2.5 text-sm text-ink transition hover:border-brand/40"
            >
              Copy all my links
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
