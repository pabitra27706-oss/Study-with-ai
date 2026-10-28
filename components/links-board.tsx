"use client";

import { ExternalLink } from "lucide-react";
import { links, type LinkItem } from "@/content/links";
import { CopyButton } from "@/components/copy-button";

const KIND_LABEL: Record<LinkItem["kind"], string> = {
  code: "Code",
  site: "Site",
  social: "Social",
  doc: "Documents",
  resource: "Resources",
};

const ORDER: LinkItem["kind"][] = ["site", "code", "social", "doc", "resource"];

export function LinksBoard() {
  const grouped = ORDER.map((kind) => ({
    kind,
    items: links.filter((l) => l.kind === kind),
  })).filter((g) => g.items.length > 0);

  const allText = links
    .map((l) => `${l.label}: ${l.url}${l.note ? ` — ${l.note}` : ""}`)
    .join("\n");

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-line bg-panel p-5">
        <div>
          <p className="text-sm font-medium text-ink">Copy everything at once</p>
          <p className="mt-1 text-[13px] text-muted">
            {links.length} links, ready to paste into an application form or a
            message.
          </p>
        </div>
        <CopyButton value={allText} label="Copy all links" />
      </div>

      {grouped.map((group) => (
        <section key={group.kind}>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-brand-soft">
            {KIND_LABEL[group.kind]}
          </h2>
          <div className="space-y-3">
            {group.items.map((item) => (
              <div
                key={item.id}
                className="rounded-[14px] border border-line bg-panel p-4 transition hover:border-brand/30"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    {item.note && (
                      <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                        {item.note}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <CopyButton value={item.url} />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Open ${item.label}`}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition hover:border-brand/40 hover:text-ink"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
                <p className="mt-3 truncate font-mono text-xs text-faint">
                  {item.url}
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
