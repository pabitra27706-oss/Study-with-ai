"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Loader2, TriangleAlert } from "lucide-react";
import {
  archiveDate,
  archiveLanguageSlug,
  archiveLanguageTone,
} from "@/lib/archive-shared";
import type { ArchiveIndexEntry, ArchiveTopic } from "@/lib/archive-shared";
import { highlightArchiveFile } from "@/lib/highlight";
import { ArchiveCodeCard } from "@/components/archive-code";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * A topic in the archive, as a card you open in place.
 *
 * The archive is its own part of the site, not a list of links to other
 * pages: tap a card and the topic opens right there — the notes, the
 * verdict, the misconceptions, and the code itself, open by default.
 *
 * The permalink still exists. `/archive/<topic>` is a real page and is
 * still what you share; this is the same content without the trip.
 */
export function ArchiveTopicCard({
  topic,
  dense = false,
  aside,
}: {
  topic: ArchiveIndexEntry;
  dense?: boolean;
  /** Rendered in the top-right corner — used for the ZIP selection box. */
  aside?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<ArchiveTopic | null>(null);
  const [sources, setSources] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function load() {
    setStatus("loading");
    try {
      const lang = archiveLanguageSlug(topic.language);
      const response = await fetch(`${BASE_PATH}/archive-data/topics/${lang}/${topic.id}.json`);
      if (!response.ok) throw new Error(String(response.status));

      const data = (await response.json()) as ArchiveTopic;
      setPayload(data);

      const texts: Record<string, string> = {};
      await Promise.all(
        (data.files ?? []).map(async (file) => {
          const url = `${BASE_PATH}/archive-content/${file.filePath.replace(/^content\//, "")}`;
          const result = await fetch(url);
          texts[file.filePath] = result.ok ? await result.text() : "";
        }),
      );
      setSources(texts);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (!payload && status !== "loading") void load();
  }

  const notes = payload?.topic?.learningNotes;

  return (
    <div className="relative overflow-hidden rounded-[14px] border border-line bg-panel transition-colors hover:border-brand/40">
      {aside && <div className="absolute right-3 top-3 z-10">{aside}</div>}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="block w-full cursor-pointer text-left"
      >
        <div className={dense ? "px-4 py-3" : "p-4"}>
          <div className={`flex flex-wrap items-center gap-2 ${aside ? "pr-6" : ""}`}>
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${archiveLanguageTone(topic.language)}`}
            >
              {topic.language}
            </span>
            <span className="text-[14px] font-medium text-ink">{topic.title}</span>
            {topic.source === "engine" && (
              <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[11px] text-accent">
                graded
              </span>
            )}
            {topic.source === "adopted" && (
              <span className="rounded-full border border-warn/40 px-2 py-0.5 font-mono text-[11px] text-warn">
                recovered
              </span>
            )}
          </div>
          {topic.description && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{topic.description}</p>
          )}
          {topic.tags && topic.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {topic.tags.slice(0, 4).map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-line-soft bg-panel-2 px-1.5 py-0.5 font-mono text-[10px] text-faint"
                >
                  {item}
                </span>
              ))}
            </div>
          )}
          <p className="mt-2.5 font-mono text-[11px] text-faint">
            {archiveDate(topic.dateCreated)} · {topic.fileCount ?? 0} file
            {topic.fileCount === 1 ? "" : "s"}
            {topic.score != null && ` · ${topic.score}%`}
          </p>
        </div>
      </button>

      {open && (
        <div className="border-t border-line-soft px-4 py-4">
          {status === "loading" && (
            <p className="flex items-center gap-2 font-mono text-[12px] text-faint">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              loading this topic…
            </p>
          )}

          {status === "error" && (
            <p className="flex items-center gap-2 text-[13px] text-warn">
              <TriangleAlert className="h-3.5 w-3.5" />
              This topic could not be loaded from the archive mirror.
            </p>
          )}

          {payload && (
            <div className="space-y-4">
              {notes && (notes.whatILearned || notes.challenges || notes.nextSteps) && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {notes.whatILearned && (
                    <div className="rounded-[12px] border border-line-soft bg-panel-2 px-3 py-2.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        what I learned
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">
                        {notes.whatILearned}
                      </p>
                    </div>
                  )}
                  {notes.challenges && (
                    <div className="rounded-[12px] border border-line-soft bg-panel-2 px-3 py-2.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        what got in the way
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">
                        {notes.challenges}
                      </p>
                    </div>
                  )}
                  {notes.nextSteps && (
                    <div className="rounded-[12px] border border-line-soft bg-panel-2 px-3 py-2.5">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
                        next
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">
                        {notes.nextSteps}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {payload.engine?.misconceptions && payload.engine.misconceptions.length > 0 && (
                <ul className="space-y-2">
                  {payload.engine.misconceptions.map((item, index) => (
                    <li
                      key={index}
                      className="rounded-[12px] border border-warn/25 bg-warn/5 px-3.5 py-2.5 text-[13px] leading-relaxed text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {payload.files && payload.files.length > 0 ? (
                payload.files.map((file) => {
                  const code = sources[file.filePath] ?? "";
                  return (
                    <ArchiveCodeCard
                      key={file.id}
                      file={file}
                      code={code}
                      html={highlightArchiveFile(file.fileName, code)}
                    />
                  );
                })
              ) : (
                <p className="text-[13px] text-faint">
                  No code file for this topic yet. It is here, waiting.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="border-t border-line-soft px-4 py-2.5">
        <Link
          href={`/archive/${topic.id}`}
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-faint transition hover:text-brand-soft"
        >
          open the topic page
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
