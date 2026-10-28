import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function DocViewer({
  title,
  kicker,
  intro,
  html,
  backHref,
  backLabel,
}: {
  title: string;
  kicker: string;
  intro: string;
  html: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"
      >
        <ArrowLeft size={14} />
        {backLabel}
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-soft">
          {kicker}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{intro}</p>
      </header>

      <div className="md mt-10" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
