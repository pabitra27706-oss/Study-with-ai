/**
 * llm.mjs — optional AI review of a submission.
 *
 * The deterministic grader (compile + tests + rubric keywords) is the judge.
 * This is the extra pair of eyes: it reads what you wrote and says one thing
 * that is actually useful. It is strictly optional — without GEMINI_API_KEY
 * nothing here runs, and nothing else changes.
 *
 * The Gemini free tier is enough for this. Get a key at
 * https://aistudio.google.com/apikey and store it as a repository secret named
 * GEMINI_API_KEY, or export it in Termux before running the grader.
 */

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * @param {{topic: object, pack: object, answers: object, notes: object, results: object, apiKey: string}} input
 * @returns {Promise<{ok: boolean, markdown?: string, error?: string}>}
 */
export async function aiReview({ topic, pack, answers, notes, results, apiKey }) {
  if (!apiKey) return { ok: false, error: "no API key" };

  const prompt = buildPrompt({ topic, pack, answers, notes, results });

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `API returned ${response.status}` };
    }

    const payload = await response.json();
    const markdown = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!markdown) return { ok: false, error: "empty response" };

    return { ok: true, markdown };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

function buildPrompt({ topic, pack, answers, notes, results }) {
  const curriculum = pack.curriculum;

  const taskSummary = Object.values(results.tasks ?? {})
    .map(
      (task) =>
        `- ${task.id} (${task.title}): ${task.status}, ${task.passed}/${task.total} tests, ${task.points}/${task.maxPoints} points` +
        (task.compileError ? `\n    compile error: ${task.compileError}` : ""),
    )
    .join("\n");

  const rubricSummary = (curriculum.rubric?.written ?? [])
    .map((item) => {
      const scored = results.written?.perQuestion?.find((entry) => entry.id === item.id);
      const answer = (answers?.[item.id] ?? "").trim() || "(not answered)";
      const verdict = scored ? `${Math.round(scored.score * 100)}%` : "0%";
      return `Q: ${item.q}\n   expected: ${item.a}\n   learner wrote: ${answer}\n   keyword score: ${verdict}`;
    })
    .join("\n\n");

  const explainSummary = (results.explain?.flags ?? [])
    .map((flag) => `- ${flag.file}:${flag.line} ${flag.message}`)
    .join("\n");

  return `You are grading a learner's submission for the topic "${topic.title}" (${topic.language}).

The learner wrote these three short lines:
- What I learned: ${notes.whatILearned || "(empty)"}
- What broke: ${notes.challenges || "(empty)"}
- Next step: ${notes.nextSteps || "(empty)"}

Automated task results:
${taskSummary}

Written answers graded against the rubric:
${rubricSummary}

${explainSummary ? `Explanation issues flagged by the checker:\n${explainSummary}\n` : ""}
The rules for the three short lines: one sentence each, at most 220 characters, no essays.

Reply in EXACTLY this markdown format and nothing else:

**What is solid**
(one or two lines — name the specific thing they got right)

**Fix this first**
(one line naming the single most important correction, with the corrected idea in a few words)

**Then this**
(one line for the second-most-important correction)

**One thing to re-read**
(a single sentence naming the section of the topic they should re-read, by its heading number)

Be direct and specific. No praise padding. If something is wrong, say what the right version is.`;
}
