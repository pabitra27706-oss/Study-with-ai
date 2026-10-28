/** Tiny class-name joiner — no runtime dependency needed for what we do here. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return String(input);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Counts, the way a video page shows them: 5,880,358 becomes 5.9M.
 *
 * These numbers are measured, not estimated, so they deserve to be readable
 * at a glance rather than printed in full.
 */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(value);
}

/** Adds a smooth "marching ants" gradient border to a card. */
export function progressTone(progress: number): string {
  if (progress >= 100) return "bg-ok";
  if (progress >= 50) return "bg-accent";
  if (progress > 0) return "bg-brand";
  return "bg-line";
}
