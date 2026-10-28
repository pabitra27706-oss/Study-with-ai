/**
 * rubric.mjs — scores the written answers against a fixed rubric.
 *
 * The learner writes one short answer per rubric question. The scorer checks
 * how many of the key ideas the answer contains. It is deliberately dumb:
 * keyword coverage, not judgement. A dumb scorer is honest — it cannot be
 * fooled by a confident paragraph that says nothing, and it never silently
 * rewards a lucky phrase.
 *
 * If an LLM is available (see llm.mjs) its verdict is recorded alongside this
 * score rather than replacing it, so the two never have to agree.
 */

const MIN_ANSWER_CHARS = 12;

/**
 * @param {Record<string, string>} answers  { "q1": "..." }
 * @param {Array<{id: string, q: string, a: string, keywords: string[], partial?: string}>} rubric
 * @returns {{score: number, answered: number, perQuestion: Array<object>}}
 */
export function scoreAnswers(answers, rubric) {
  const perQuestion = [];
  let earned = 0;
  let possible = 0;

  for (const item of rubric) {
    possible += 1;

    const raw = (answers?.[item.id] ?? "").trim();
    if (raw === "") {
      perQuestion.push({
        id: item.id,
        q: item.q,
        answered: false,
        score: 0,
        hits: [],
        missing: item.keywords ?? [],
        feedback: "Not answered yet.",
      });
      continue;
    }

    if (raw.length < MIN_ANSWER_CHARS) {
      perQuestion.push({
        id: item.id,
        q: item.q,
        answered: true,
        score: 0,
        hits: [],
        missing: item.keywords ?? [],
        feedback: "Too short to judge — write one full sentence.",
      });
      continue;
    }

    const lower = raw.toLowerCase();
    const hits = (item.keywords ?? []).filter((keyword) =>
      lower.includes(keyword.toLowerCase()),
    );
    const missing = (item.keywords ?? []).filter((keyword) => !hits.includes(keyword));

    const ratio = (item.keywords ?? []).length ? hits.length / item.keywords.length : 0;
    const score = Math.min(1, ratio);

    earned += score;

    perQuestion.push({
      id: item.id,
      q: item.q,
      answered: true,
      score: Number(score.toFixed(2)),
      hits,
      missing,
      feedback:
        score >= 1
          ? "Full marks."
          : score > 0
            ? `Partly right. Missing: ${missing.join(", ")}. ${item.partial ?? ""}`.trim()
            : `Not there yet. ${item.partial ?? `Look for: ${missing.join(", ")}.`}`,
    });
  }

  return {
    score: possible ? Math.round((earned / possible) * 100) : 0,
    answered: perQuestion.filter((item) => item.answered).length,
    total: possible,
    perQuestion,
  };
}

/**
 * Scores the learner's three free-text lines against the topic rules:
 * `whatILearned`, `challenges`, `nextSteps`. The point is not the prose — it
 * is that the learner filled all three in, and kept them short.
 */
export function scoreNotes(learningNotes, rules = {}) {
  const maxChars = rules.writingMaxChars ?? 220;
  const fields = ["whatILearned", "challenges", "nextSteps"];
  const labels = {
    whatILearned: "What I learned",
    challenges: "What broke",
    nextSteps: "What is next",
  };

  const perField = fields.map((field) => {
    const value = String(learningNotes?.[field] ?? "").trim();
    const filled = value.length > 0;
    const tooLong = value.length > maxChars;

    return {
      field,
      label: labels[field],
      filled,
      tooLong,
      chars: value.length,
      text: value,
      feedback: !filled
        ? "Empty — fill this in."
        : tooLong
          ? `${value.length} characters. The limit is ${maxChars}. If it needs more, it is not understood yet.`
          : "Good.",
    };
  });

  const filledCount = perField.filter((field) => field.filled).length;
  const overCount = perField.filter((field) => field.tooLong).length;

  return {
    score: Math.round((filledCount / fields.length) * 100 - overCount * 20),
    filledCount,
    total: fields.length,
    perField,
  };
}
