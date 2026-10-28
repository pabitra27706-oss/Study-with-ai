#!/usr/bin/env node
/**
 * new-topic.mjs — scaffold a new topic pack.
 *
 *   node scripts/new-topic.mjs <id> "<title>" [options]
 *
 * Options:
 *   --language C            default: C
 *   --category "..."        default: "Data Structures"
 *   --difficulty beginner   default: beginner
 *   --minutes 120           default: 120
 *   --tags a,b,c            default: (none)
 *   --dry-run               print what would happen, change nothing
 *
 * It creates the shape of a topic and nothing else:
 *
 *   curriculum/topics/<id>.json     the pack, full of TODO markers
 *   curriculum/reference/<id>/      where the reference solutions go
 *   learn/<id>/                     the learner's folder, empty and ready
 *
 * and it adds the topic to curriculum/index.json.
 *
 * It will not overwrite anything. If a file already exists it stops and says so.
 *
 * The shape is the easy half. The substance — the explanation, the videos with
 * real view counts, the tasks with hidden tests, the reference solutions — is
 * yours. Run `node scripts/check-topic.mjs <id> --deep` when you think you are
 * done; it will tell you exactly what is still missing.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

function option(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1 || index + 1 >= args.length) return fallback;
  return args[index + 1];
}

const positional = args.filter((arg, index) => {
  if (arg.startsWith("--")) return false;
  const previous = args[index - 1];
  return !["--language", "--category", "--difficulty", "--minutes", "--tags"].includes(previous);
});

const id = positional[0];
const title = positional[1];
const language = option("--language", "C");
const category = option("--category", "Data Structures");
const difficulty = option("--difficulty", "beginner");
const minutes = Number(option("--minutes", 120));
const tags = (option("--tags", "") ?? "")
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean);

if (!id || !title) {
  console.error("");
  console.error("  usage: node scripts/new-topic.mjs <id> \"<title>\" [options]");
  console.error("");
  console.error("  example: node scripts/new-topic.mjs sorting-in-c \"Sorting in C\" \\");
  console.error("             --category Algorithms --tags sort,quicksort,complexity");
  console.error("");
  process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error(`  The id "${id}" must be lower-case words joined by dashes.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const pack = {
  topic: {
    id,
    title,
    language,
    category,
    difficulty,
    dateCreated: `${today}T00:00:00Z`,
    lastUpdated: `${today}T00:00:00Z`,
    tags,
    description: "TODO: one sentence on what this topic is and why it is worth a learner's afternoon.",
    learningNotes: { whatILearned: "", challenges: "", nextSteps: "" },
  },
  files: [],
  curriculum: {
    summary: "TODO: what this topic teaches, in three or four sentences, and the one idea it all hangs on.",
    prerequisites: [],
    estimatedMinutes: minutes,
    rules: {
      writingMaxChars: 220,
      commentPolicy:
        "Every non-obvious line needs a WHY comment, not a WHAT comment. A comment that restates the code is deleted. A comment that states the reason is kept.",
      notePolicy:
        "Write three lines maximum: what you learned, what broke, what is next. If it needs more than 220 characters per line, it is not understood yet.",
    },
    explanation: [
      {
        h: "1. TODO — the first idea",
        md: "TODO — write the section. Say why the thing exists, show the shape of it in code, and name the bug that most people hit. A section is at least a paragraph and a code block.",
      },
    ],
    videos: [
      {
        title: "TODO — the video title, exactly as YouTube shows it",
        url: "https://www.youtube.com/watch?v=REPLACE_ME",
        channel: "TODO — the channel that published it",
        length: "00:00",
        minutes: 0,
        views: 0,
        likes: 0,
        published: "TODO — YYYY-MM-DD",
        measuredOn: "TODO — YYYY-MM-DD",
        why: "TODO — why this video, for this learner, at this point in the topic. Say what it gets right that the others do not.",
        order: 1,
      },
    ],
    references: [
      {
        title: "TODO — a text reference",
        url: "https://example.com",
        why: "TODO — what this reference is good for, and when to read it.",
      },
    ],
    tasks: [
      {
        id: "t1",
        title: "TODO — the first task",
        points: 0,
        prompt: "TODO — exactly what the program must read, do and print. Say what the output looks like.",
        starter: "#include <stdio.h>\n\nint main(void) {\n    /* your code here */\n\n    return 0;\n}\n",
        solutionFile: `curriculum/reference/${id}/t1.c`,
        explainTarget: "TODO — the one thing the learner has to explain in a comment.",
        hints: [
          "TODO — the nudge that unblocks them without giving the answer.",
          "TODO — the second nudge.",
        ],
        tests: [
          { stdin: "TODO\n", stdout: "TODO", public: true },
          { stdin: "TODO\n", stdout: "TODO", public: false },
        ],
      },
    ],
    rubric: {
      written: [
        {
          id: "q1",
          q: "TODO — the question the learner answers in their own words.",
          a: "TODO — the answer that would earn full marks.",
          keywords: ["TODO", "two", "words"],
          partial: "TODO — what a half-right answer says.",
        },
      ],
    },
  },
};

const learnerReadme = `# ${title}

This is your folder for the **${title}** topic. Everything the judge needs is in here.

## What goes where

| File | What it is |
|---|---|
| \`solutions/\` | your C code, one file per task: \`t1.c\`, \`t2.c\`, ... |
| \`answers.json\` | your written answers, one per rubric question (\`q1\`, \`q2\`, ...) |
| \`notes.json\` | your three lines: what you learned, what broke, what is next |
| \`verdict.json\` | my judgement — written by the judge, not by you |

## The loop

1. Open the repo in **CodeC**, clone it, and go to \`learn/${id}/solutions/\`.
2. Write \`t1.c\`. Give every non-obvious line a comment that says **why**, not what.
3. Commit and push from CodeC.
4. Say **"check ${id}"** in the chat. I read your code, compile it, run the tests, write the verdict, and put the notes back here.

Nothing else runs on its own. There is no CI bot watching this folder — I read it when you ask.

## The house rules

- Print one value per line. It keeps the output unambiguous and it stops a trailing space costing you a test.
- Every \`malloc\` gets a matching \`free\`.
- Every comment says why. \`// increment i\` is deleted; \`// i < n not i <= n, because n itself is a factor\` is kept.
`;

const answers = {};

/* -------------------------------------------------------------------- write */

const targets = [
  { path: join(ROOT, "curriculum/topics", `${id}.json`), content: `${JSON.stringify(pack, null, 2)}\n` },
  {
    path: join(ROOT, "curriculum/reference", id, ".gitkeep"),
    content: "",
  },
  { path: join(ROOT, "learn", id, "README.md"), content: learnerReadme },
  { path: join(ROOT, "learn", id, "answers.json"), content: `${JSON.stringify(answers, null, 2)}\n` },
  { path: join(ROOT, "learn", id, "solutions", ".gitkeep"), content: "" },
];

const existing = targets.filter((target) => existsSync(target.path));
if (existing.length) {
  console.error("");
  for (const target of existing) {
    console.error(`  x  already exists: ${target.path.replace(`${ROOT}/`, "")}`);
  }
  console.error("");
  console.error("  Nothing was written. Pick a different id, or remove those files first.");
  console.error("");
  process.exit(1);
}

if (dryRun) {
  console.log("");
  console.log("  Would create:");
  for (const target of targets) console.log(`    ${target.path.replace(`${ROOT}/`, "")}`);
  console.log("  and add the topic to curriculum/index.json");
  console.log("");
  process.exit(0);
}

for (const target of targets) {
  mkdirSync(dirname(target.path), { recursive: true });
  writeFileSync(target.path, target.content, "utf8");
}

// --- register in the index -------------------------------------------------
const indexPath = join(ROOT, "curriculum/index.json");
const index = JSON.parse(readFileSync(indexPath, "utf8"));

if (index.topics.some((topic) => topic.id === id)) {
  console.error(`  x  "${id}" is already in curriculum/index.json.`);
  process.exit(1);
}

index.topics.push({
  id,
  title,
  language,
  category,
  difficulty,
  dateCreated: `${today}T00:00:00Z`,
  lastUpdated: `${today}T00:00:00Z`,
  minutes,
  points: 0,
  tags,
  description: pack.topic.description,
  topicFile: `curriculum/topics/${id}.json`,
  learnDir: `learn/${id}`,
});

index.metadata.totalTopics = index.topics.length;
index.metadata.lastUpdated = new Date().toISOString();
if (!index.metadata.languages.includes(language)) index.metadata.languages.push(language);

writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");

console.log("");
console.log(`  Scaffolded "${id}".`);
console.log("");
for (const target of targets) console.log(`    ${target.path.replace(`${ROOT}/`, "")}`);
console.log("    curriculum/index.json  (registered)");
console.log("");
console.log("  Now fill it in. The order that works:");
console.log("");
console.log("    1. write the explanation sections");
console.log("    2. pick the videos — and MEASURE them: views, likes, length, channel");
console.log("    3. write the tasks, with at least one hidden test each");
console.log("    4. write the reference solutions in curriculum/reference/" + id + "/");
console.log("    5. write the rubric questions");
console.log("");
console.log(`  Then: node scripts/check-topic.mjs ${id} --deep`);
console.log("");
