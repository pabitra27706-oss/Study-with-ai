import Link from "next/link";
import { milestones, type MilestoneState } from "@/content/milestones";
import { cn } from "@/lib/utils";

const STATE_STYLE: Record<MilestoneState, { dot: string; text: string; label: string }> = {
  done: { dot: "bg-ok", text: "text-ok", label: "Done" },
  active: { dot: "bg-accent", text: "text-accent", label: "In progress" },
  upcoming: { dot: "bg-line", text: "text-faint", label: "Upcoming" },
};

export function Timeline() {
  return (
    <ol className="relative space-y-0">
      {milestones.map((m, i) => {
        const style = STATE_STYLE[m.state];
        const last = i === milestones.length - 1;

        return (
          <li key={m.id} className="relative grid gap-2 pb-8 pl-8 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className="absolute left-[5px] top-4 h-full w-px bg-line"
              />
            )}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-[5px] h-[11px] w-[11px] rounded-full border-2 border-canvas",
                style.dot,
              )}
            />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-brand-soft">
                {m.when}
              </span>
              <span className={cn("font-mono text-[11px]", style.text)}>
                · {style.label}
              </span>
            </div>
            <h3 className="text-[15px] font-medium text-ink">{m.title}</h3>
            <p className="max-w-2xl text-[13px] leading-relaxed text-muted">
              {m.detail}
            </p>
            {m.href && (
              <Link
                href={m.href}
                className="text-xs text-accent transition hover:text-ink"
              >
                {m.hrefLabel ?? "Open"} →
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
