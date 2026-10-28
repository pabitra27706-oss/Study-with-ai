/**
 * evidence.mjs — the sensor.
 *
 * Produces the hard facts about a submission: does it compile, which test
 * cases pass, what do the comments say, which key ideas do the written
 * answers contain, and what exactly did the learner write.
 *
 * It deliberately does NOT produce a verdict. A verdict is a judgement, and
 * judgement belongs to the judge (see lib/judge.mjs). This module only
 * reports what happened.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

import { compileAndRun, detectCompiler } from "./lib/sandbox.mjs";
import { checkExplainability } from "./lib/explain.mjs";
import { scoreAnswers, scoreNotes } from "./lib/rubric.mjs";

/**
 * @param {{root: string, index: object, solutionsOverride?: string|null, learnOverride?: string|null}} options
 */
export async function collectEvidence({ root, index, solutionsOverride = null, learnOverride = null }) {
  const compiler = await detectCompiler();
  const topics = {};

  for (const entry of index.topics) {
    const pack = JSON.parse(readFileSync(join(root, entry.topicFile), "utf8"));
    const { topic, curriculum } = pack;

    const learnDir = learnOverride
      ? resolve(root, learnOverride)
      : join(root, entry.learnDir ?? `learn/${entry.id}`);
    const solutionsDir = solutionsOverride
      ? resolve(root, solutionsOverride)
      : join(learnDir, "solutions");

    const tasks = {};
    const code = {};
    let submitted = 0;

    for (const task of curriculum.tasks) {
      const solutionPath = join(solutionsDir, `${task.id}.c`);

      if (!existsSync(solutionPath)) {
        tasks[task.id] = {
          id: task.id,
          title: task.title,
          status: "not-submitted",
          passed: 0,
          total: task.tests.length,
          points: 0,
          maxPoints: task.points,
          compileError: null,
          failing: [],
          explain: null,
        };
        continue;
      }

      submitted += 1;
      const source = readFileSync(solutionPath, "utf8");
      code[task.id] = source;

      const outcome = await compileAndRun(source, task.tests);

      tasks[task.id] = {
        id: task.id,
        title: task.title,
        status:
          outcome.status === "graded"
            ? outcome.passed === outcome.total
              ? "passed"
              : outcome.passed > 0
                ? "partial"
                : "failed"
            : outcome.status,
        passed: outcome.passed,
        total: outcome.total,
        points:
          outcome.total > 0 ? Math.round((outcome.passed / outcome.total) * task.points) : 0,
        maxPoints: task.points,
        compileError: outcome.compileError ?? null,
        failing: outcome.results
          .filter((result) => !result.ok)
          .map((result) => ({
            expected: result.expected,
            actual: result.actual,
            error: result.error,
          })),
        explain: checkExplainability(source),
      };
    }

    const answersPath = join(learnDir, "answers.json");
    const notesPath = join(learnDir, "learner-notes.json");

    const answers = existsSync(answersPath) ? readFileSync(answersPath, "utf8") : "{}";
    const learnerNotes = existsSync(notesPath) ? readFileSync(notesPath, "utf8") : "{}";

    const parsedAnswers = safeJson(answers);
    const parsedNotes = safeJson(learnerNotes);

    const written = scoreAnswers(parsedAnswers, curriculum.rubric?.written ?? []);
    const notes = scoreNotes(parsedNotes, curriculum.rules);

    const graded = Object.values(tasks).filter((task) => task.explain);
    const explain = {
      score: graded.length
        ? Math.round(graded.reduce((sum, task) => sum + task.explain.score, 0) / graded.length)
        : 0,
      flags: graded.flatMap((task) =>
        task.explain.flags.map((flag) => ({ ...flag, file: task.id })),
      ),
      perFile: graded.map((task) => ({
        id: task.id,
        score: task.explain.score,
        flags: task.explain.flags,
        stats: task.explain.stats,
      })),
    };

    topics[topic.id] = {
      id: topic.id,
      title: topic.title,
      language: topic.language,
      submitted,
      tasks,
      code,
      answers: parsedAnswers,
      learnerNotes: parsedNotes,
      written: { score: written.score, answered: written.answered, total: written.total, perQuestion: written.perQuestion },
      notes: { score: notes.score, filledCount: notes.filledCount, total: notes.total, perField: notes.perField },
      explain,
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    compiler: compiler ?? null,
    topics,
  };
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
