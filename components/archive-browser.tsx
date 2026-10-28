"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { Download, Grid2X2, List, Rows3, Search, X } from "lucide-react";
import type { ArchiveIndex, ArchiveIndexEntry } from "@/lib/archive-shared";
import {
  archiveDate,
  archiveLanguageTone,
  archiveMonthLabel,
} from "@/lib/archive-shared";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Sort = "newest" | "oldest" | "files" | "language";
type View = "grid" | "list" | "timeline";

const SORTS: Array<{ id: Sort; label: string }> = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "files", label: "Most files" },
  { id: "language", label: "By language" },
];

/**
 * The filters live in the URL, and the URL is the only copy.
 *
 * That makes every filtered view shareable and every one of them survive a
 * reload, with no state to keep in sync and no effect to write state from.
 */
function useUrlFilters() {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  const getSnapshot = useCallback(() => window.location.search, []);
  const getServerSnapshot = useCallback(() => "", []);

  const search = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const filters = useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      lang: params.get("lang") ?? "all",
      tag: params.get("tag"),
      query: params.get("q") ?? "",
      sort: (params.get("sort") as Sort) ?? "newest",
      view: (params.get("view") as View) ?? "grid",
    };
  }, [search]);

  const update = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    }
    const queryString = next.toString();
    window.history.replaceState(
      null,
      "",
      queryString ? `?${queryString}` : window.location.pathname,
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return { ...filters, update };
}

export function ArchiveBrowser({ index }: { index: ArchiveIndex }) {
  const { lang, tag, query, sort, view, update } = useUrlFilters();
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const topics = index.topics;

  const languages = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const topic of topics) {
      if (!seen.has(topic.language)) {
        seen.add(topic.language);
        out.push(topic.language);
      }
    }
    return out;
  }, [topics]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const topic of topics) {
      for (const item of topic.tags ?? []) {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 28);
  }, [topics]);

  const visible = useMemo(() => {
    let list = [...topics];
    if (lang !== "all") list = list.filter((topic) => topic.language === lang);
    if (tag) list = list.filter((topic) => (topic.tags ?? []).includes(tag));
    if (query) {
      const needle = query.toLowerCase();
      list = list.filter(
        (topic) =>
          topic.title.toLowerCase().includes(needle) ||
          (topic.description ?? "").toLowerCase().includes(needle) ||
          (topic.tags ?? []).some((item) => item.toLowerCase().includes(needle)),
      );
    }
    switch (sort) {
      case "oldest":
        list.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));
        break;
      case "files":
        list.sort((a, b) => (b.fileCount ?? 0) - (a.fileCount ?? 0));
        break;
      case "language":
        list.sort(
          (a, b) =>
            a.language.localeCompare(b.language) || b.dateCreated.localeCompare(a.dateCreated),
        );
        break;
      default:
        list.sort((a, b) => b.dateCreated.localeCompare(a.dateCreated));
    }
    return list;
  }, [topics, lang, tag, query, sort]);

  const grouped = useMemo(() => {
    const groups: Array<{ label: string; items: ArchiveIndexEntry[] }> = [];
    for (const topic of visible) {
      const label = archiveMonthLabel(topic.dateCreated);
      const last = groups[groups.length - 1];
      if (!last || last.label !== label) groups.push({ label, items: [topic] });
      else last.items.push(topic);
    }
    return groups;
  }, [visible]);

  const fileTotal = visible.reduce((sum, topic) => sum + (topic.fileCount ?? 0), 0);
  const selectedSet = new Set(selected);

  function toggleSelected(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id),
    );
  }

  function reset() {
    update({ lang: null, tag: null, q: null, sort: null, view: null });
    setSelected([]);
  }

  /** Build a ZIP of the selected topics in the browser, like the old archive did. */
  async function downloadSelected() {
    const chosen = topics.filter((topic) => selectedSet.has(topic.id));
    if (!chosen.length) return;
    setBusy(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const topic of chosen) {
        for (const file of await fetchTopicFiles(topic)) {
          zip.file(`${topic.id}/${file.name}`, file.body);
        }
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `learning-archive-${chosen.length}-topics.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  async function fetchTopicFiles(topic: ArchiveIndexEntry) {
    const response = await fetch(`${BASE_PATH}/archive-data/${topic.topicFile.replace(/^data\//, "")}`);
    if (!response.ok) return [];
    const payload = (await response.json()) as {
      files?: Array<{ fileName: string; filePath: string }>;
    };
    const out: Array<{ name: string; body: string }> = [];
    for (const file of payload.files ?? []) {
      const fileResponse = await fetch(
        `${BASE_PATH}/archive-content/${file.filePath.replace(/^content\//, "")}`,
      );
      if (!fileResponse.ok) continue;
      out.push({ name: file.fileName, body: await fileResponse.text() });
    }
    return out;
  }

  const viewButtons: Array<{ id: View; label: string; icon: React.ReactNode }> = [
    { id: "grid", label: "Grid", icon: <Grid2X2 className="h-3.5 w-3.5" /> },
    { id: "list", label: "List", icon: <List className="h-3.5 w-3.5" /> },
    { id: "timeline", label: "Timeline", icon: <Rows3 className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* ---------------- sidebar ---------------- */}
      <aside className="space-y-6">
        <div className="rounded-[14px] border border-line bg-panel p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Languages</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => update({ lang: null })}
              className={`rounded-md border px-2 py-1 font-mono text-[11px] transition ${
                lang === "all"
                  ? "border-brand/50 bg-brand/10 text-brand-soft"
                  : "border-line-soft bg-panel-2 text-muted hover:text-ink"
              }`}
            >
              all <span className="opacity-60">{topics.length}</span>
            </button>
            {languages.map((language) => {
              const count = topics.filter((topic) => topic.language === language).length;
              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => update({ lang: language })}
                  className={`rounded-md border px-2 py-1 font-mono text-[11px] transition ${
                    lang === language
                      ? "border-brand/50 bg-brand/10 text-brand-soft"
                      : "border-line-soft bg-panel-2 text-muted hover:text-ink"
                  }`}
                >
                  {language} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {tagCounts.length > 0 && (
          <div className="rounded-[14px] border border-line bg-panel p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Tags</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tagCounts.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => update({ tag: tag === name ? null : name })}
                  className={`rounded-md border px-2 py-1 font-mono text-[11px] transition ${
                    tag === name
                      ? "border-brand/50 bg-brand/10 text-brand-soft"
                      : "border-line-soft bg-panel-2 text-muted hover:text-ink"
                  }`}
                >
                  {name} <span className="opacity-60">{count}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ---------------- results ---------------- */}
      <div>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-faint" />
            <input
              type="search"
              value={query}
              onChange={(event) => update({ q: event.target.value })}
              placeholder="Search 69 topics…"
              className="w-full rounded-lg border border-line bg-panel py-2 pl-9 pr-9 text-[13px] text-ink outline-none transition placeholder:text-faint focus:border-brand/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => update({ q: null })}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint transition hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
            aria-label="Sort"
            className="rounded-lg border border-line bg-panel px-3 py-2 text-[13px] text-muted outline-none transition focus:border-brand/50"
          >
            {SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex overflow-hidden rounded-lg border border-line">
            {viewButtons.map((button) => (
              <button
                key={button.id}
                type="button"
                onClick={() => update({ view: button.id })}
                aria-pressed={view === button.id}
                title={button.label}
                className={`px-2.5 py-2 transition ${
                  view === button.id
                    ? "bg-panel-2 text-brand-soft"
                    : "bg-panel text-faint hover:text-ink"
                }`}
              >
                {button.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-faint">
            Showing {visible.length} topic{visible.length === 1 ? "" : "s"} · {fileTotal} file
            {fileTotal === 1 ? "" : "s"}
          </p>
          {(lang !== "all" || tag || query) && (
            <button
              type="button"
              onClick={reset}
              className="font-mono text-[11px] text-brand-soft transition hover:text-ink"
            >
              reset filters
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="rounded-[14px] border border-line bg-panel px-6 py-14 text-center">
            <p className="text-[15px] text-ink">No topics match those filters.</p>
            <p className="mt-1.5 text-[13px] text-muted">
              Try a different language, tag or search term.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-4 rounded-lg border border-line bg-panel-2 px-3 py-1.5 text-[13px] text-muted transition hover:text-ink"
            >
              Reset filters
            </button>
          </div>
        ) : view === "timeline" ? (
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.label}>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-soft">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {group.items.map((topic) => (
                    <Link
                      key={topic.id}
                      href={`/archive/${topic.id}`}
                      className="block rounded-[14px] border border-line bg-panel p-4 transition-colors hover:border-brand/50"
                    >
                      <div className="flex flex-wrap items-center gap-2">
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
                      </div>
                      {topic.description && (
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
                          {topic.description}
                        </p>
                      )}
                      <p className="mt-2 font-mono text-[11px] text-faint">
                        {archiveDate(topic.dateCreated)} · {topic.fileCount ?? 0} file
                        {topic.fileCount === 1 ? "" : "s"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : view === "list" ? (
          <div className="overflow-hidden rounded-[14px] border border-line bg-panel">
            {visible.map((topic) => (
              <div
                key={topic.id}
                className="flex flex-wrap items-center gap-3 border-b border-line-soft px-4 py-3 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedSet.has(topic.id)}
                  onChange={(event) => toggleSelected(topic.id, event.target.checked)}
                  aria-label={`Select ${topic.title}`}
                  className="h-3.5 w-3.5 accent-[#8b5cf6]"
                />
                <span
                  className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${archiveLanguageTone(topic.language)}`}
                >
                  {topic.language}
                </span>
                <Link
                  href={`/archive/${topic.id}`}
                  className="min-w-0 flex-1 truncate text-[14px] text-ink transition hover:text-brand-soft"
                >
                  {topic.title}
                </Link>
                <span className="font-mono text-[11px] text-faint">
                  {archiveDate(topic.dateCreated)} · {topic.fileCount ?? 0}f
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((topic) => (
              <div
                key={topic.id}
                className="group relative rounded-[14px] border border-line bg-panel p-4 transition-colors hover:border-brand/50"
              >
                <input
                  type="checkbox"
                  checked={selectedSet.has(topic.id)}
                  onChange={(event) => toggleSelected(topic.id, event.target.checked)}
                  aria-label={`Select ${topic.title}`}
                  className="absolute right-3 top-3 h-3.5 w-3.5 accent-[#8b5cf6]"
                />
                <div className="flex flex-wrap items-center gap-2 pr-6">
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${archiveLanguageTone(topic.language)}`}
                  >
                    {topic.language}
                  </span>
                  {topic.source === "engine" && (
                    <span className="rounded-full border border-accent/40 px-2 py-0.5 font-mono text-[11px] text-accent">
                      graded
                    </span>
                  )}
                  {topic.score !== null && topic.score !== undefined && (
                    <span className="font-mono text-[11px] text-faint">{topic.score}%</span>
                  )}
                </div>
                <h3 className="mt-2.5 text-[15px] font-semibold text-ink">
                  <Link href={`/archive/${topic.id}`} className="transition hover:text-brand-soft">
                    {topic.title}
                  </Link>
                </h3>
                {topic.description && (
                  <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-muted">
                    {topic.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                  {(topic.tags ?? []).slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-line-soft bg-panel-2 px-1.5 py-0.5 font-mono text-[10px] text-faint"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-3 font-mono text-[11px] text-faint">
                  {archiveDate(topic.dateCreated)} · {topic.fileCount ?? 0} file
                  {topic.fileCount === 1 ? "" : "s"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------------- selection bar ---------------- */}
      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-panel/95 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
            <p className="font-mono text-[12px] text-muted">
              {selected.length} topic{selected.length === 1 ? "" : "s"} selected
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-lg border border-line px-3 py-1.5 text-[13px] text-muted transition hover:text-ink"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={downloadSelected}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-lg border border-brand/40 bg-brand/10 px-3 py-1.5 text-[13px] text-brand-soft transition hover:border-brand/70 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                {busy ? "Building…" : "Download ZIP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
