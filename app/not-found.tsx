import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-32 text-center">
      <p className="font-mono text-sm text-brand-soft">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
        This page does not exist
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted">
        Which is, honestly, the correct response to a question that has no
        answer yet. Write it down and go find it.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand/85"
        >
          Back to the dashboard
        </Link>
        <Link
          href="/journal"
          className="rounded-xl border border-line bg-panel px-5 py-2.5 text-sm text-ink transition hover:border-brand/40"
        >
          Read the journal
        </Link>
      </div>
    </div>
  );
}
