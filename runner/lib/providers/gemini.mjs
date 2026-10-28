/**
 * providers/gemini.mjs — the real judge.
 *
 * Uses the Gemini free tier (https://aistudio.google.com/apikey). One call per
 * submission. The prompt asks for JSON so the verdict is machine-readable and
 * the notes can be written straight into the repository.
 */

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * @param {string} prompt
 * @param {{apiKey: string, temperature?: number, maxOutputTokens?: number, json?: boolean}} options
 * @returns {Promise<{ok: boolean, text?: string, error?: string}>}
 */
export async function complete(prompt, options) {
  const { apiKey, temperature = 0.3, maxOutputTokens = 2000, json = false } = options;

  if (!apiKey) return { ok: false, error: "no API key" };

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens,
      ...(json ? { responseMimeType: "application/json" } : {}),
    },
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return { ok: false, error: `API ${response.status}: ${detail.slice(0, 200)}` };
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();

    if (!text) return { ok: false, error: "empty response" };
    return { ok: true, text };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
