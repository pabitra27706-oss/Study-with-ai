/**
 * providers/mock.mjs — a stand-in judge used for testing the wiring.
 *
 * It is NOT a real evaluation. It reads the evidence and composes a verdict
 * from templates so the whole pipeline (evidence -> judge -> write back ->
 * commit -> site) can be exercised without an API key.
 *
 * Select it with AI_PROVIDER=mock, or leave it as the automatic fallback
 * when no key is present, so the repository never ends up with a missing
 * score because a key expired.
 */

import { scoreAnswers } from "../rubric.mjs";

export async function complete(prompt) {
  const facts = extractFacts(prompt);

  if (!facts) {
    return {
      ok: true,
      text: JSON.stringify({
        verdict: "incomplete",
        score: 0,
        whatILearned: "",
        challenges: "No submission was found.",
        nextSteps: "Push a solution file to learn/<topic>/solutions/ and run again.",
        misconceptions: [],
        review: "Nothing to review yet.",
      }),
    };
  }

  const taskScore = facts.tasksPassed === facts.tasksTotal && facts.tasksTotal > 0 ? 1 : facts.taskRatio;
  const written = scoreAnswers(facts.answers ?? {}, facts.rubric ?? []);
  const total = Math.round(
    70 * taskScore + 15 * (written.score / 100) + 10 * (facts.explainScore / 100),
  );

  const verdict =
    total >= 90 ? "correct" : total >= 60 ? "mostly-correct" : total > 0 ? "incomplete" : "incorrect";

  const failing = facts.failing.map((item) => `- \`${item.id}\` ${item.message}`).join("\n");

  return {
    ok: true,
    text: JSON.stringify({
      verdict,
      score: total,
      whatILearned: facts.tasksPassed
        ? `I solved ${facts.tasksPassed} of ${facts.tasksTotal} tasks and the code compiles.`
        : "I attempted the topic.",
      challenges: facts.failing.length
        ? `Still failing: ${facts.failing.map((item) => `${item.id} ${item.message}`).join("; ")}.`
        : "No failing test cases.",
      nextSteps: facts.nextTask
        ? `Take on ${facts.nextTask} next.`
        : "Re-read the explanation section for the weakest task.",
      misconceptions: facts.failing.map((item) => `${item.id}: ${item.message}`),
      review:
        `**Offline evaluation.** No AI key was available, so this verdict comes from the machine evidence alone — what compiled, what passed, what the comments said. It cannot tell you whether you understood the idea, only whether the program behaved.\n\n` +
        `- Tasks passed: ${facts.tasksPassed}/${facts.tasksTotal}\n` +
        `- Explainability: ${facts.explainScore}%\n` +
        `- Written answers: ${written.score}% (keyword coverage, not judgement)\n\n` +
        (failing ? `**Still failing**\n${failing}\n\n` : "") +
        `Add a free Gemini key — \`https://aistudio.google.com/apikey\` — and this becomes a written review of the thinking, not just the result.\n\n` +
        `_The agent writes the same three notes either way. The difference is that with a key it can tell you why._`,
    }),
  };
}

/** Pulls the facts block back out of the prompt so the mock can reason. */
function extractFacts(prompt) {
  const match = prompt.match(/<<<FACTS>>>\n([\s\S]*?)\n<<<END FACTS>>>/);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}
