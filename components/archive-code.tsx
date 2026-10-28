import { ChevronDown, Code2, Download } from "lucide-react";
import { Card } from "@/components/ui";
import type { ArchiveFile } from "@/lib/archive-shared";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * One code file in the archive, as a card.
 *
 * The code is **open by default**. Hiding it is optional, and the control
 * is a box you can see and tap — not a line of small words you have to
 * find. That is the whole difference between a card and a paragraph of
 * links: on a phone, the thing you want to look at should already be
 * there.
 *
 * This component is used in two places — the archive's topic pages and the
 * cards you can open in the archive itself — so the code looks the same
 * wherever it appears.
 */
export function ArchiveCodeCard({
  file,
  code,
  html,
}: {
  file: ArchiveFile;
  code: string;
  html: string;
}) {
  const lines = code ? code.split("\n").length : 0;
  const passed = (file.passed ?? 0) > 0;
  const allPassed = file.total ? file.passed === file.total : false;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-[13px] text-ink">{file.fileName}</p>
          {file.description && (
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
              {file.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {file.total ? (
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
                allPassed
                  ? "border-ok/40 text-ok"
                  : passed
                    ? "border-warn/40 text-warn"
                    : "border-line text-faint"
              }`}
            >
              {file.passed}/{file.total} tests
            </span>
          ) : null}
          {file.maxPoints ? (
            <span className="font-mono text-[11px] text-faint">{file.maxPoints} pts</span>
          ) : null}
          <a
            href={`${BASE_PATH}/archive-content/${file.filePath.replace(/^content\//, "")}`}
            download
            className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[12px] text-muted transition hover:border-brand/40 hover:text-brand-soft"
          >
            <Download className="h-3.5 w-3.5" />
            download
          </a>
        </div>
      </div>

      {file.compileError && (
        <p className="border-b border-line bg-bad/10 px-4 py-2 font-mono text-[11.5px] text-bad">
          {file.compileError}
        </p>
      )}

      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-panel-2 px-2.5 py-1.5 text-muted transition group-open:border-brand/45 group-open:text-brand-soft">
            <Code2 className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em]">code</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" />
          </span>
          <span className="font-mono text-[11px] text-faint">
            {lines} {lines === 1 ? "line" : "lines"}
          </span>
        </summary>
        <pre className="overflow-x-auto border-t border-line-soft bg-panel-2 px-4 py-3 font-mono text-[12px] leading-relaxed text-muted">
          <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </details>
    </Card>
  );
}
