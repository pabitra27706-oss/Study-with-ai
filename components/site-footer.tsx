import Link from "next/link";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line/70 bg-panel/40">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-mono text-sm text-ink">
              study<span className="text-brand-soft">-with-ai</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              A skill-readiness journey built on AI tutoring, Git as memory, and
              the web as proof. Built from the repository itself.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/archive" className="text-muted transition hover:text-ink">
              Archive
            </Link>
            <Link href="/progress" className="text-muted transition hover:text-ink">
              Progress
            </Link>
            <Link href="/skills" className="text-muted transition hover:text-ink">
              Skills
            </Link>
            <Link href="/projects" className="text-muted transition hover:text-ink">
              Projects
            </Link>
            <Link href="/journal" className="text-muted transition hover:text-ink">
              Journal
            </Link>
            <Link href="/playbook" className="text-muted transition hover:text-ink">
              Playbook
            </Link>
            <Link href="/links" className="text-muted transition hover:text-ink">
              Links
            </Link>
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted transition hover:text-ink"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line-soft pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.location} · Built with Next.js + Tailwind · Content generated
            from the repo
          </p>
          <p className="font-mono">
            Attempt first. Ask second. Test unaided. — the rule this whole
            system runs on.
          </p>
        </div>
      </div>
    </footer>
  );
}
