/**
 * judge.mjs — the AI judge: prompt, provider selection, verdict parsing.
 *
 * The machine evidence (compile result, test results, comment-quality flags)
 * is a SENSOR, not the verdict. It tells the AI what happened. The AI decides
 * what it means: whether the learner understood, where their reasoning broke,
 * and what to do next.
 *
 * That distinction matters. A program that fails one edge case because of an
 * off-by-one and a program that fails because the concept is not understood
 * look identical to a test runner and completely different to a teacher.
 */

import { complete as geminiComplete } from "./providers/gemini.mjs";
import { complete as mockComplete } from "./providers/mock.mjs";

/** Picks the provider: an explicit override, a real key, or the offline fallback. */
export function selectProvider(env = process.env) {
  const requested = (env.AI_PROVIDER ?? "").toLowerCase();

  if (requested === "mock") return { name: "mock", complete: mockComplete };
  if (requested === "gemini" || env.GEMINI_API_KEY) {
    return {
      name: "gemini",
      complete: (prompt, options) =>
        geminiComplete(prompt, { ...options, apiKey: env.GEMINI_API_KEY }),
    };
  }
  return { name: "offline", complete: mockComplete };
}

/**
 * Builds the judging prompt.
 *
 * @param {{pack: object, evidence: object}} input
 * @returns {string}
 */
export function buildPrompt({ pack, evidence }) {
  const { topic, curriculum } = pack;

  const sections = curriculum.explanation
    .map((section, index) => `${index + 1}. ${section.h}`)
    .join("\n");

  const tasks = curriculum.tasks
    .map((task) => {
      const graded = evidence.tasks[task.id];
      const code = evidence.code[task.id] ?? "(no file submitted)";
      const result = graded
        ? `${graded.status} — ${graded.passed}/${graded.total} tests, ${graded.points}/${graded.maxPoints} points`
        : "not submitted";

      return [
        `### Task ${task.id}: ${task.title} (${task.points} points)`,
        `Requirement: ${task.prompt}`,
        `What the comment must explain: ${task.explainTarget}`,
        `Machine result: ${result}`,
        graded?.compileError ? `Compile error: ${graded.compileError}` : "",
        graded?.failing?.length
          ? `Failing cases:\n${graded.failing
              .map(
                (item) =>
                  `  - expected ${JSON.stringify(item.expected)} / got ${JSON.stringify(item.actual)}${item.error ? ` — ${item.error}` : ""}`,
              )
              .join("\n")}`
          : "",
        graded?.explain?.flags?.length
          ? `Comment problems flagged:\n${graded.explain.flags
              .map((flag) => `  - line ${flag.line}: ${flag.message} (${JSON.stringify(flag.text)})`)
              .join("\n")}`
          : "",
        `Submitted code:\n\`\`\`c\n${code}\n\`\`\``,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  const rubric = curriculum.rubric.written
    .map((item) => {
      const answer = evidence.answers[item.id] ?? "";
      const scored = evidence.written.perQuestion.find((entry) => entry.id === item.id);
      return [
        `Q${item.id}: ${item.q}`,
        `A full-credit answer looks like: ${item.a}`,
        `Partial credit: ${item.partial ?? ""}`,
        `Key ideas the answer should contain: ${item.keywords.join(", ")}`,
        `Keyword coverage the machine found: ${scored ? Math.round(scored.score * 100) : 0}%${scored?.missing?.length ? ` (missing: ${scored.missing.join(", ")})` : ""}`,
        `Learner wrote: ${answer ? answer : "(not answered)"}`,
      ].join("\n");
    })
    .join("\n\n");

  const facts = {
    topic: topic.id,
    tasksTotal: curriculum.tasks.length,
    tasksPassed: Object.values(evidence.tasks).filter((task) => task.status === "passed").length,
    taskRatio:
      Object.values(evidence.tasks).reduce((sum, task) => sum + task.points, 0) /
      Math.max(
        1,
        Object.values(evidence.tasks).reduce((sum, task) => sum + task.maxPoints, 0),
      ),
    explainScore: evidence.explain.score,
    failing: Object.values(evidence.tasks)
      .filter((task) => task.status !== "passed" && task.status !== "not-started")
      .map((task) => ({
        id: task.id,
        message: task.compileError
          ? `does not compile: ${task.compileError}`
          : `${task.passed}/${task.total} test cases pass`,
      })),
    rubric: curriculum.rubric.written,
    answers: evidence.answers,
    nextTask: curriculum.tasks.find((task) => evidence.tasks[task.id]?.status !== "passed")?.id ?? null,
  };

  return `You are the judge for a learner's submission in the topic "${topic.title}" (${topic.language}).

Your job is NOT to check whether the code runs. That has already been measured.
Your job is to judge whether the learner UNDERSTOOD, and to write notes that
will make the next attempt better.

WHAT THE LEARNER WAS TAUGHT (section headings only — you know the material):
${sections}

WHAT THE LEARNER WAS ASKED:
${tasks}

THE WRITTEN QUESTIONS AND THEIR ANSWERS:
${rubric}

HOW TO JUDGE

1. Correctness is necessary but not sufficient. A program can pass every test
   and still show a wrong mental model in the written answers, or vice versa.
   Weigh the answers and the comments as heavily as the test results.

2. The machine results are a SENSOR, not a verdict. If a test fails because of
   an off-by-one but the learner's comment shows they know why the boundary
   matters, say so — and do not treat it as a concept failure. If the learner
   has no idea why it failed, name that as the real problem.

3. Judge the COMMENTS. The rule is that a comment must say WHY, never WHAT.
   "multi = i * multi" with no comment is a gap. A comment that says
   "multiply, not add: factorial is a product of 1..n" is exactly right.

4. Be specific. Name the task, the line, the test case, the misconception.
   "Review loops" is useless. "t3: you divide before taking the remainder, so
   the last digit is lost — take n % 10 first, then n / 10" is useful.

5. Never hand over the full solution as a fix. Give the correction, not the
   finished program. The learner has to write the next one.

6. Do not invent problems. If the work is correct and well explained, say it
   is correct. Padding praise and inventing criticism both waste the learner's
   time.

7. Write the three notes lines in the LEARNER'S voice: first person, plain,
   one sentence each, under 220 characters. They will be published as the
   learner's own notes, so they must sound like something a student would
   write, not like an AI talking about a student.

OUTPUT — JSON only, no markdown fence around it, exactly these keys:

{
  "verdict": "correct" | "mostly-correct" | "incomplete" | "incorrect",
  "score": <integer 0-100>,
  "whatILearned": "<one sentence, first person, the thing they can now do>",
  "challenges": "<one sentence, first person, the specific thing that broke>",
  "nextSteps": "<one sentence, first person, the next concrete action>",
  "misconceptions": ["<short phrase>", "..."],
  "review": "<markdown, 150-300 words: what is solid, what to fix first, what to fix next, the one section to re-read>"
}

The score weights: tasks 70, written answers 15, notes 5, explainability 10.
Use the machine results for the tasks and explainability components, but judge
the written answers yourself — the keyword coverage is a hint, not the truth.
A learner who wrote a correct idea without using the exact keyword still
deserves the mark.

<<<FACTS>>>
${JSON.stringify(facts, null, 2)}
<<<END FACTS>>>`;
}

/**
 * Parses the judge's reply into a verdict. Tolerant: it copes with a fenced
 * JSON block, and with a reply that has a stray sentence around the object.
 */
export function parseVerdict(text) {
  const raw = String(text ?? "").trim();
  const candidate = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();

  let parsed = null;
  try {
    parsed = JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        parsed = JSON.parse(candidate.slice(start, end + 1));
      } catch {
        parsed = null;
      }
    }
  }

  if (!parsed) {
    return {
      ok: false,
      error: "could not parse the judge's reply",
      raw: raw.slice(0, 500),
    };
  }

  const score = Number(parsed.score);
  return {
    ok: true,
    verdict: {
      verdict: String(parsed.verdict ?? "incomplete"),
      score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
      whatILearned: String(parsed.whatILearned ?? "").slice(0, 400),
      challenges: String(parsed.challenges ?? "").slice(0, 400),
      nextSteps: String(parsed.nextSteps ?? "").slice(0, 400),
      misconceptions: Array.isArray(parsed.misconceptions)
        ? parsed.misconceptions.map((item) => String(item).slice(0, 200))
        : [],
      review: String(parsed.review ?? "").trim(),
    },
  };
}
