/**
 * explain.mjs — the "code must explain itself" checker.
 *
 * The rule this repo enforces:
 *   every non-obvious line carries a WHY comment, not a WHAT comment.
 *
 * A WHAT comment restates the code ("// increment i"). It adds no information
 * and rots the moment the code changes. A WHY comment states the reason
 * ("// i<=n not i<n: n itself is a factor of n!"). It survives edits and it is
 * the only thing that will still make sense to you in six months.
 *
 * This check is mechanical on purpose. It never tries to understand your
 * program; it only asks whether you explained the parts that are easy to get
 * wrong. That makes it repeatable, and repeatable is what makes it a system.
 */

/** Causal markers — a comment containing one of these is trying to explain *why*. */
const WHY_MARKERS = [
  "because",
  "why",
  "so that",
  "so we",
  "so the",
  "so ",
  "in order to",
  "to avoid",
  "to prevent",
  "to keep",
  "to stop",
  "instead of",
  "rather than",
  "not ",
  "must",
  "need",
  "needs",
  "required",
  "important",
  "ensures",
  "prevents",
  "keeps",
  "since",
  "otherwise",
  "careful",
  "watch out",
  "note:",
  "edge case",
  "bug",
  "would",
  "never",
  "only",
];

/** Words too generic to prove a comment is a restatement of the code. */
const STOP_WORDS = new Set([
  "the", "a", "an", "of", "to", "and", "or", "is", "are", "in", "on", "for", "if",
  "it", "this", "that", "with", "we", "i", "be", "as", "at", "by", "from", "not",
  "then", "so", "but", "can", "will", "when", "value", "number", "loop", "code",
  "print", "printf", "scanf", "int", "char", "long", "void", "return", "main",
  "include", "stdio", "std", "io", "h",
]);

/**
 * Splits a source file into code-only lines and a map of comments.
 *
 * Block comments are attached to the line they *end* on, so a comment written
 * above a statement sits directly above it — which is exactly how the
 * significance check wants to find it.
 */
export function extractComments(source) {
  const lines = String(source ?? "").split("\n");
  const codeLines = [];
  const comments = new Map();

  let inBlock = false;
  let buffer = [];

  lines.forEach((line, index) => {
    if (inBlock) {
      const end = line.indexOf("*/");
      if (end === -1) {
        buffer.push(line);
        codeLines.push("");
        return;
      }
      buffer.push(line.slice(0, end));
      const text = buffer
        .join(" ")
        .replace(/\*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) comments.set(index, text);
      codeLines.push(line.slice(end + 2));
      inBlock = false;
      buffer = [];
      return;
    }

    const blockStart = line.indexOf("/*");
    if (blockStart !== -1) {
      const blockEnd = line.indexOf("*/", blockStart);
      if (blockEnd === -1) {
        buffer.push(line.slice(blockStart + 2));
        codeLines.push(line.slice(0, blockStart));
        inBlock = true;
        return;
      }
      const text = line.slice(blockStart + 2, blockEnd).replace(/\s+/g, " ").trim();
      if (text) comments.set(index, text);
      codeLines.push(line.slice(0, blockStart) + line.slice(blockEnd + 2));
      return;
    }

    const slash = line.indexOf("//");
    if (slash !== -1) {
      const text = line.slice(slash + 2).trim();
      if (text) comments.set(index, text);
      codeLines.push(line.slice(0, slash));
      return;
    }

    codeLines.push(line);
  });

  return { codeLines, comments };
}

/**
 * @param {string} source C source text
 * @returns {{score: number, flags: Array<object>, stats: object}}
 */
export function checkExplainability(source) {
  const { codeLines, comments } = extractComments(source);
  const flags = [];

  let whyCount = 0;

  // --- Pass 1: classify every comment -------------------------------------
  for (const [index, comment] of comments) {
    const lower = comment.toLowerCase();
    const isWhy = WHY_MARKERS.some((marker) => lower.includes(marker));

    if (isWhy) {
      whyCount += 1;
      continue;
    }

    const restates = restatesCode(comment, codeLines[index] ?? "");
    flags.push({
      kind: restates ? "restates-code" : "no-why",
      line: index + 1,
      text: comment.slice(0, 140),
      message: restates
        ? "This comment repeats what the code already says. Say WHY instead."
        : "This comment states what, not why. Explain the reason or delete it.",
    });
  }

  // --- Pass 2: significant lines that carry no explanation -----------------
  const significant = findSignificantLines(codeLines);

  for (const sig of significant) {
    const own = comments.has(sig.lineIndex);
    const above = comments.has(sig.lineIndex - 1);

    if (!own && !above) {
      flags.push({
        kind: "missing-comment",
        line: sig.lineIndex + 1,
        text: sig.text.slice(0, 140),
        message: `This ${sig.what} has no comment on it or on the line above. Say why it is written this way.`,
      });
    }
  }

  const penalties = { "restates-code": 15, "no-why": 10, "missing-comment": 25 };
  const score = Math.max(
    0,
    100 - flags.reduce((total, flag) => total + (penalties[flag.kind] ?? 10), 0),
  );

  return {
    score,
    flags: flags.sort((a, b) => a.line - b.line),
    stats: {
      lines: codeLines.length,
      comments: comments.size,
      whyComments: whyCount,
      significantLines: significant.length,
    },
  };
}

/**
 * True when a comment is (nearly) a restatement of the code it sits on —
 * every meaningful word in the comment also appears in the code.
 */
function restatesCode(comment, code) {
  const commentTokens = tokenize(comment);
  const codeTokens = new Set(tokenize(code));

  if (commentTokens.length === 0) return false;

  const meaningful = commentTokens.filter((token) => !STOP_WORDS.has(token));
  if (meaningful.length === 0) return false;

  const shared = meaningful.filter((token) => codeTokens.has(token)).length;
  return shared / meaningful.length >= 0.8;
}

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9_]+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Finds the lines that genuinely need an explanation: loop headers, and
 * assignments inside a loop body (accumulator updates).
 */
function findSignificantLines(codeLines) {
  const significant = [];
  let depth = 0;
  let loopDepth = -1;

  codeLines.forEach((line, index) => {
    const code = line.trim();
    if (code === "") return;

    const opensLoop = /\b(for|while)\s*\(/.test(code) || /^do\b/.test(code);

    if (opensLoop) {
      significant.push({ lineIndex: index, text: code, what: "loop header" });
      loopDepth = depth;
    } else if (
      loopDepth >= 0 &&
      depth > loopDepth &&
      /^[A-Za-z_]\w*\s*(\*=|=|\+=|-=|\+\+|--)/.test(code)
    ) {
      significant.push({
        lineIndex: index,
        text: code,
        what: "value that changes each iteration",
      });
    }

    for (const char of code) {
      if (char === "{") depth += 1;
      if (char === "}") depth -= 1;
    }

    if (loopDepth >= 0 && depth <= loopDepth) loopDepth = -1;
  });

  return significant;
}
