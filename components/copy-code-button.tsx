"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Copy a file to the clipboard, ready to paste into CodeC.
 *
 * The code is fetched at the moment you tap, not carried in the page. The
 * archive's topic pages already contain the code in their HTML; a second
 * copy of it inside the page's data would make every page twice as big,
 * on a phone, for no reason.
 *
 * The clipboard API needs a secure context, which the live site is. Older
 * Android browsers fall back to the old trick, because the point of this
 * button is to work on the phone in your hand.
 */
export function CopyCodeButton({
  url,
  label = "copy",
}: {
  /** Where the file lives. The same URL the download button uses. */
  url: string;
  label?: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(String(response.status));
      await writeToClipboard(await response.text());
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy the code, ready to paste into CodeC"
      aria-label="Copy the code to the clipboard"
      className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[12px] text-muted transition hover:border-brand/40 hover:text-brand-soft"
    >
      {state === "copied" ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {state === "copied" ? "copied" : state === "failed" ? "failed" : label}
    </button>
  );
}

/** The clipboard API, with the old way as a fallback. */
async function writeToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "-1000px";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  area.remove();
}
