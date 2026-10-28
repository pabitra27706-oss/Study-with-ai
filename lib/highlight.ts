/**
 * Syntax highlighting, in one place.
 *
 * This module is deliberately free of anything server-only: the archive's
 * topic pages highlight at build time, and the archive's cards highlight in
 * the browser when you open one. Both need the same markup, so both use
 * this.
 *
 * It registers only the languages the archive actually holds, rather than
 * importing all of highlight.js. The difference is about a megabyte of
 * JavaScript a phone would otherwise have to download to open one card.
 */

import hljs from "highlight.js/lib/core";
import c from "highlight.js/lib/languages/c";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import xml from "highlight.js/lib/languages/xml";

const REGISTERED: [string, Parameters<typeof hljs.registerLanguage>[1]][] = [
  ["c", c],
  ["css", css],
  ["java", java],
  ["javascript", javascript],
  ["json", json],
  ["markdown", markdown],
  ["python", python],
  ["sql", sql],
  ["xml", xml],
];

for (const [name, definition] of REGISTERED) {
  hljs.registerLanguage(name, definition);
}

const LANGUAGE_BY_EXTENSION: Record<string, string> = {
  ".c": "c",
  ".h": "c",
  ".py": "python",
  ".js": "javascript",
  ".html": "xml",
  ".css": "css",
  ".java": "java",
  ".sql": "sql",
  ".json": "json",
  ".md": "markdown",
};

/**
 * Highlighted markup for a code file.
 *
 * Done at build time on the topic pages, so the visitor's phone does no
 * highlighting work at all. Done in the browser on the archive's cards,
 * because a card is opened after the page has already loaded.
 */
export function highlightArchiveFile(fileName: string, code: string): string {
  const extension = fileName.slice(fileName.lastIndexOf("."));
  const language = LANGUAGE_BY_EXTENSION[extension] ?? "";
  if (!language || !hljs.getLanguage(language)) {
    return escapeHtml(code);
  }
  try {
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
  } catch {
    return escapeHtml(code);
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
