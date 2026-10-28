/**
 * sandbox.mjs — compile and run untrusted C in a controlled way.
 *
 * Works with `gcc` (Linux CI, desktop) and `clang` (Termux on Android), because
 * the whole point of this runner is that the phone is a first-class machine.
 */

import { spawn, execFile } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** Cached compiler probe — the first call pays for the lookup, the rest are free. */
let compilerCache = null;

/**
 * Finds a working C compiler. Honours $CC first, then tries gcc, then clang.
 * @returns {Promise<{bin: string, version: string} | null>}
 */
export async function detectCompiler() {
  if (compilerCache) return compilerCache;

  const candidates = [process.env.CC, "gcc", "clang"].filter(Boolean);

  for (const bin of candidates) {
    try {
      const { stdout } = await execFileAsync(bin, ["--version"], { timeout: 10_000 });
      const version = stdout.split("\n")[0]?.trim() ?? bin;
      compilerCache = { bin, version };
      return compilerCache;
    } catch {
      // try the next candidate
    }
  }

  compilerCache = null;
  return null;
}

/**
 * Output comparison ignores trailing whitespace on each line and trailing blank
 * lines. Learners write `printf("1 ")` instead of `printf("1")` constantly and
 * that should not cost them the point.
 */
export function normalizeOutput(raw) {
  return String(raw ?? "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/, ""))
    .join("\n")
    .replace(/\n+$/, "");
}

/**
 * Compiles one C source file and runs it against a list of test cases.
 *
 * @param {string} source      C source text
 * @param {Array<{stdin: string, stdout: string}>} tests
 * @param {{timeoutMs?: number}} [options]
 * @returns {Promise<{status: string, compileError?: string, results: Array<object>, passed: number, total: number}>}
 */
export async function compileAndRun(source, tests, options = {}) {
  const timeoutMs = options.timeoutMs ?? 5000;
  const compiler = await detectCompiler();

  if (!compiler) {
    return {
      status: "no-compiler",
      compileError:
        "No C compiler found. Install one: `pkg install clang` (Termux) or `apt install gcc` (Linux).",
      results: [],
      passed: 0,
      total: tests.length,
    };
  }

  const dir = mkdtempSync(join(tmpdir(), "cgrade-"));
  const srcPath = join(dir, "main.c");
  const binPath = join(dir, "main");

  try {
    writeFileSync(srcPath, source, "utf8");

    const compile = await runProcess(
      compiler.bin,
      ["-std=c17", "-Wall", "-Wextra", "-O1", "-o", binPath, srcPath],
      { timeoutMs: 20_000 },
    );

    if (compile.code !== 0) {
      const firstError =
        compile.stderr
          .split("\n")
          .map((line) => line.trim())
          .find((line) => line.includes("error:")) ?? compile.stderr.split("\n")[0] ?? "";
      return {
        status: "compile-error",
        compileError: firstError || "compilation failed",
        results: [],
        passed: 0,
        total: tests.length,
      };
    }

    const results = [];
    let passed = 0;

    for (const test of tests) {
      const run = await runProcess(binPath, [], {
        timeoutMs,
        stdin: test.stdin ?? "",
      });

      const expected = normalizeOutput(test.stdout);
      const actual = normalizeOutput(run.stdout);
      const match = matchesExpected(actual, expected);
      const ok = run.code === 0 && match.ok;

      if (ok) passed += 1;

      results.push({
        ok,
        exact: match.exact,
        noisy: match.ok && !match.exact,
        expected,
        actual,
        exitCode: run.code,
        timedOut: run.timedOut,
        error: run.timedOut
          ? `timed out after ${timeoutMs}ms — is your loop terminating?`
          : run.code !== 0
            ? firstErrorLine(run.stderr)
            : null,
      });
    }

    return { status: "graded", results, passed, total: tests.length };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Runs a process with an optional stdin payload and a hard timeout. */
function runProcess(bin, args, { timeoutMs = 5000, stdin = "" } = {}) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(bin, args, { stdio: ["pipe", "pipe", "pipe"] });
    } catch (error) {
      resolve({ code: 1, stdout: "", stderr: String(error), timedOut: false });
      return;
    }

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ code: 1, stdout, stderr: stderr + String(error), timedOut });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 0, stdout, stderr, timedOut });
    });

    if (stdin) {
      child.stdin.write(stdin);
    }
    child.stdin.end();
  });
}

/**
 * Does the output contain the expected answer?
 *
 * The sensor measures one thing: **is the right value there?** A program that
 * prints `Factorial of 5 = 120` has computed 5! correctly. Requiring a byte-
 * for-byte match would fail it for a formatting difference and leave the
 * judge arguing with the sensor instead of judging the work.
 *
 * So: the expected answer must appear as a whole token (or a whole line, for
 * multi-line expectations). `120` matches `Factorial of 5 = 120`; it does not
 * match `1200`, and it does not match a program that only ever prints 120.
 *
 * When the output carries extra text, the result is still a pass — but it is
 * marked `noisy`, so the judge can see the difference and decide whether the
 * extra text is acceptable. The sensor reports; it does not scold.
 */
function matchesExpected(actual, expected) {
  if (actual === expected) return { ok: true, exact: true };

  const expectedLines = expected.split("\n").map((line) => line.trim()).filter(Boolean);
  if (expectedLines.length === 0) return { ok: actual.trim() === "", exact: false };

  if (expectedLines.length > 1) {
    const actualLines = actual.split("\n").map((line) => line.trim());
    const ok = expectedLines.every((line) => actualLines.includes(line));
    return { ok, exact: false };
  }

  const want = expectedLines[0];
  const tokens = actual.split(/\s+/).filter(Boolean);
  return { ok: tokens.includes(want), exact: false };
}

function firstErrorLine(stderr) {
  return (
    String(stderr ?? "")
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.includes("error")) ?? "program exited with an error"
  );
}

/** True when a path exists on disk. */
export function exists(path) {
  return existsSync(path);
}
