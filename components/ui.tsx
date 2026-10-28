import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  dot,
}: {
  children: React.ReactNode;
  className?: string;
  dot?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone,
  className,
}: {
  value: number;
  tone: string;
  className?: string;
}) {
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line-soft", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-700", tone)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      {eyebrow && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-brand-soft">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-line bg-panel transition-colors hover:border-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-[14px] border border-line bg-panel px-4 py-4">
      <p className="font-mono text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-faint">{label}</p>
      {hint && <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-line-soft bg-panel-2 px-2 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}
