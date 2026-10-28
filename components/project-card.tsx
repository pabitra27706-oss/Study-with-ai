import { ExternalLink, GitBranch } from "lucide-react";
import { PROJECT_STATUS_META, type Project } from "@/content/projects";
import { Badge, Card, Tag } from "@/components/ui";

export function ProjectCard({ project }: { project: Project }) {
  const meta = PROJECT_STATUS_META[project.status];

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-ink">{project.name}</h3>
          <p className="mt-1 text-[13px] italic text-muted">{project.tagline}</p>
        </div>
        <Badge className={meta.className}>{meta.label}</Badge>
      </div>

      <p className="mt-4 rounded-lg border border-line-soft bg-panel-2 p-3 text-[13px] leading-relaxed text-muted">
        <span className="font-mono text-[11px] uppercase tracking-wider text-brand-soft">
          Proves ·{" "}
        </span>
        {project.proves}
      </p>

      {project.highlights && (
        <ul className="mt-4 space-y-2">
          {project.highlights.map((h) => (
            <li
              key={h}
              className="flex gap-2.5 text-[13px] leading-relaxed text-muted"
            >
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand/70" />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <Tag key={s}>{s}</Tag>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-line-soft pt-4">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] text-muted transition hover:border-brand/40 hover:text-ink"
          >
            <GitBranch size={13} />
            Source
          </a>
        )}
        {project.live ? (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-lg border border-ok/30 bg-ok/10 px-3 py-1.5 font-mono text-[11px] text-ok transition hover:bg-ok/15"
          >
            <ExternalLink size={13} />
            Live
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-1.5 font-mono text-[11px] text-faint">
            Not deployed yet
          </span>
        )}
      </div>
    </Card>
  );
}
