"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  SKILL_GROUPS,
  STATUS_META,
  type Skill,
  type SkillGroup,
  type SkillStatus,
} from "@/content/skills";
import { SkillCard } from "@/components/skill-card";
import { effectiveProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: Array<SkillStatus | "all"> = [
  "all",
  "learning",
  "building",
  "shipped",
  "planned",
];

export function SkillsExplorer({ skills }: { skills: Skill[] }) {
  const [group, setGroup] = useState<SkillGroup | "all">("all");
  const [status, setStatus] = useState<SkillStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (group !== "all" && s.group !== group) return false;
      if (status !== "all" && s.status !== status) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.why.toLowerCase().includes(q) ||
        (s.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [skills, group, status, query]);

  const average = filtered.length
    ? Math.round(
        filtered.reduce((acc, s) => acc + effectiveProgress(s), 0) /
          filtered.length,
      )
    : 0;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 rounded-[14px] border border-line bg-panel p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={group === "all"} onClick={() => setGroup("all")}>
              All groups
            </FilterChip>
            {SKILL_GROUPS.map((g) => (
              <FilterChip
                key={g}
                active={group === g}
                onClick={() => setGroup(group === g ? "all" : g)}
              >
                {g}
              </FilterChip>
            ))}
          </div>

          <label className="relative block sm:w-64">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills…"
              className="w-full rounded-lg border border-line bg-panel-2 py-2 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-brand/50"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line-soft pt-4">
          <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
            status
          </span>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] transition",
                status === s
                  ? "border-brand/50 bg-brand/10 text-brand-soft"
                  : "border-line bg-panel-2 text-muted hover:text-ink",
              )}
            >
              {s === "all" ? "All" : STATUS_META[s].label}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] text-faint">
            {filtered.length} shown · avg {average}%
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[14px] border border-dashed border-line p-10 text-center text-sm text-muted">
          Nothing matches that filter. Try widening it.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg border px-3 py-1.5 text-xs transition",
        active
          ? "border-brand/50 bg-brand/10 text-brand-soft"
          : "border-line bg-panel-2 text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
