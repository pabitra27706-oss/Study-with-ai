import { marked } from "marked";

/**
 * Markdown → HTML for content that I author myself (journal entries, playbook
 * documents). The source is trusted local markdown, not user input, so
 * `dangerouslySetInnerHTML` is acceptable here — but never pass remote or
 * user-submitted content through this function.
 */
export async function renderMarkdown(source: string): Promise<string> {
  const html = await marked.parse(source, {
    gfm: true,
    breaks: false,
    async: true,
  });

  return addHeadingIds(html);
}

/**
 * Adds stable `id` anchors to h2/h3 so long documents can be deep-linked
 * and a table of contents can be generated from the same HTML.
 */
function addHeadingIds(html: string): string {
  const used = new Map<string, number>();
  const seen = new Set<string>();

  return html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_match, level: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "");
      const base = slugify(text) || "section";
      const count = used.get(base) ?? 0;
      used.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      if (seen.has(id)) return `<h${level}>${inner}</h${level}>`;
      seen.add(id);
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Pulls h2 headings out of rendered HTML to build a table of contents. */
export function extractHeadings(html: string): {
  id: string;
  text: string;
  level: number;
}[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const re = /<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g;
  let match: RegExpExecArray | null;

  while ((match = re.exec(html)) !== null) {
    headings.push({
      level: Number(match[1]),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ""),
    });
  }

  return headings;
}
