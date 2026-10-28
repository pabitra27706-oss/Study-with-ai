import type { Metadata } from "next";
import Link from "next/link";
import {
  BatteryCharging,
  CloudLightning,
  Cpu,
  FolderGit2,
  Smartphone,
  Terminal,
} from "lucide-react";
import { SectionHeading, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Phone-first",
  description:
    "The operating manual for learning, building and shipping from an Android phone with Termux — what the phone does, what the CI runner does, and what never works.",
};

const SPLIT = [
  {
    icon: Smartphone,
    title: "The phone does",
    items: [
      "Read, write, commit. Every line of code I have shipped was typed on a phone.",
      "Git: clone, branch, commit, push, review PRs.",
      "gh: the GitHub CLI — issues, PRs, releases, Pages, Actions.",
      "Python, Node, shell, a local static server, an editor (nano, or my own).",
      "The learning loop: read, attempt, quiz, log.",
      "Everything that needs judgement, taste and typing.",
    ],
  },
  {
    icon: CloudLightning,
    title: "The CI runner does",
    items: [
      "npm ci, TypeScript, ESLint, the Next.js static export.",
      "Gradle builds and Android release APKs.",
      "Docker images and anything else that needs a real Linux userland.",
      "Deployments to GitHub Pages, Vercel, Netlify, Render.",
      "Every build that needs glibc — because Android is bionic.",
    ],
  },
];

const BLOCKERS = [
  {
    problem: "Native binaries need glibc; Android is bionic",
    detail:
      "Next.js's Turbopack/SWC, lightningcss and Gradle's native parts are compiled against glibc. On stock Termux they will not load.",
    fix: "Push the build to GitHub Actions. A workflow file is the build machine. This is exactly the rule AppFlow already states.",
  },
  {
    problem: "You cannot build a big project in 20 minutes between classes",
    detail:
      "A full Next.js build on a mid-range Android phone is slow, hot, and drains the battery for a result you can get free in CI.",
    fix: "Never build locally. `git push` is the build command. Watch it with `gh run watch` from the same phone.",
  },
  {
    problem: "/sdcard is not a POSIX filesystem",
    detail:
      "Android's shared storage breaks permissions, symlinks and case sensitivity. Git and proot both misbehave there.",
    fix: "Keep the clone in Termux's own home (`~/Study-with-ai`). Clone inside the Ubuntu filesystem too, if you use proot.",
  },
  {
    problem: "A 6-inch screen is a hostile editor",
    detail:
      "Typing a 200-line TypeScript file on a phone keyboard is slow, and typo-driven commits are a real cost.",
    fix: "Keep the phone for short, high-leverage edits: READMEs, issues, PR reviews, small fixes. Use an agent for the long writes, and never let it write the journal.",
  },
  {
    problem: "Termux is not on the Play Store",
    detail:
      "The Play Store build is years old and its package manager is broken.",
    fix: "Install from F-Droid: f-droid.org/packages/com.termux. Then `pkg update && pkg install git gh`.",
  },
];

const LOOP = [
  {
    step: "01",
    title: "Pull",
    cmd: "cd ~/Study-with-ai && git pull",
    note: "Ten seconds. Everything else happens against what is already on the server.",
  },
  {
    step: "02",
    title: "Attempt first",
    cmd: "nano notes/<topic>.md",
    note: "Write what you think before you ask anything. This is the rule that keeps the AI a tutor and not a crutch.",
  },
  {
    step: "03",
    title: "Commit the decision",
    cmd: "git add -A && git commit -m \"What I decided, not what I changed\"",
    note: "A commit is a dated record of a thought. That is the whole point of Git as memory.",
  },
  {
    step: "04",
    title: "Push and let CI build",
    cmd: "git push && gh run watch",
    note: "The build happens on GitHub's Ubuntu runner. You watch it on the phone like a build log.",
  },
  {
    step: "05",
    title: "Log the mistake",
    cmd: "$EDITOR journal/$(date +%F)-<slug>.md",
    note: "Attempt, mistake, fix. The one folder an AI agent is never allowed to write.",
  },
];

export default function PhonePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <SectionHeading
        eyebrow="Operating manual"
        title="I have no computer. The phone is the machine."
        description="That is not a limitation to apologise for — it is a constraint that has already produced a 3-star developer tool, two shipped Android apps and a published Termux textbook. This is the system that makes it work."
      />

      <div className="mb-16 grid gap-5 md:grid-cols-2">
        {SPLIT.map((col) => (
          <Card key={col.title} className="p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-brand/30 bg-brand/10">
                <col.icon size={15} className="text-brand-soft" />
              </span>
              <h3 className="text-base font-medium text-ink">{col.title}</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {col.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
                >
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mb-16">
        <SectionHeading
          eyebrow="The loop"
          title="One day, five commands, about an hour"
          description="This is the same daily loop as the learning design, sized for a phone. The only difference is that the build is somebody else's job."
        />
        <div className="space-y-3">
          {LOOP.map((item) => (
            <div
              key={item.step}
              className="rounded-[14px] border border-line bg-panel p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
                <span className="font-mono text-sm text-brand-soft sm:w-8">
                  {item.step}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-medium text-ink">{item.title}</h3>
                  <code className="mt-2 block overflow-x-auto rounded-lg border border-line-soft bg-panel-2 px-3 py-2 font-mono text-[12px] text-accent">
                    {item.cmd}
                  </code>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
                    {item.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <SectionHeading
          eyebrow="Known limits"
          title="Five things that will bite you, and what to do about them"
          description="Found the hard way, so you do not have to."
        />
        <div className="space-y-4">
          {BLOCKERS.map((b) => (
            <div
              key={b.problem}
              className="rounded-[14px] border border-line bg-panel p-5"
            >
              <div className="flex items-start gap-3">
                <Cpu size={16} className="mt-0.5 shrink-0 text-warn" />
                <div>
                  <h3 className="text-[15px] font-medium text-ink">
                    {b.problem}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    {b.detail}
                  </p>
                  <p className="mt-2.5 border-l-2 border-ok/40 pl-3 text-[13px] leading-relaxed text-muted">
                    <span className="text-ok">Fix · </span>
                    {b.fix}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <FolderGit2 size={16} className="text-brand-soft" />
          <h3 className="mt-3 text-sm font-medium text-ink">
            Git is the only required habit
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            Everything else in this system is optional tooling. Committing is
            the part that makes a phone-only workflow work at all, because the
            repository is the memory and the remote is the build machine.
          </p>
        </Card>
        <Card className="p-5">
          <Terminal size={16} className="text-accent" />
          <h3 className="mt-3 text-sm font-medium text-ink">
            One repo, one purpose
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            AppFlow says it: keep apps small, distinct and time-boxed to four
            weeks. The same rule applies to repositories. A phone session is
            20 minutes — scope accordingly.
          </p>
        </Card>
        <Card className="p-5">
          <BatteryCharging size={16} className="text-ok" />
          <h3 className="mt-3 text-sm font-medium text-ink">
            Never build on the phone
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            A local build is slow, hot and useless, because CI will do it
            faster and for free. The only exception is a five-second type
            check to catch a typo before you push.
          </p>
        </Card>
      </div>

      <div className="mt-16 flex flex-wrap gap-4">
        <Link
          href="/audit"
          className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
        >
          ← What your GitHub actually proves
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-accent transition hover:text-ink"
        >
          Back to the dashboard →
        </Link>
      </div>
    </div>
  );
}
