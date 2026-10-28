import { STATUS_META, type Skill } from "@/content/skills";
import { Badge, Card, ProgressBar, Tag } from "@/components/ui";
import { effectiveProgress } from "@/lib/progress";
import { cn, progressTone } from "@/lib/utils";

export function SkillCard({ skill }: { skill: Skill }) {
  const meta = STATUS_META[skill.status];
  const value = effectiveProgress(skill);

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[15px] font-medium leading-snug text-ink">
            {skill.name}
          </h3>
          <p className="mt-1 font-mono text-[11px] text-faint">
            {skill.group}
          </p>
        </div>
        <Badge className={meta.className} dot={meta.dot}>
          {meta.label}
        </Badge>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-muted">{skill.why}</p>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px]">
          <span className="text-faint">readiness</span>
          <span className="text-ink">{value}%</span>
        </div>
        <ProgressBar value={value} tone={progressTone(value)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(skill.tags ?? []).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      {skill.proof && (
        <a
          href={skill.proof}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-accent transition hover:text-ink"
        >
          {skill.proofLabel ?? "Proof"} ↗
        </a>
      )}
    </Card>
  );
}

export function SkillRow({ skill }: { skill: Skill }) {
  const meta = STATUS_META[skill.status];
  const value = effectiveProgress(skill);

  return (
    <div className="group grid gap-2 border-b border-line-soft py-4 last:border-0 sm:grid-cols-[minmax(0,1fr)_160px_84px] sm:items-center sm:gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-ink">{skill.name}</span>
          <Badge className={cn(meta.className)} dot={meta.dot}>
            {meta.label}
          </Badge>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted">{skill.why}</p>
      </div>
      <ProgressBar value={value} tone={progressTone(value)} className="sm:w-full" />
      <span className="font-mono text-xs text-faint sm:text-right">{value}%</span>
    </div>
  );
}
