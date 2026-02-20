const TEXT_MODEL = "gemini-3-flash-preview";   // your current one
const VISION_MODEL = "gemini-3-flash-preview";       // good for image scan
const API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function geminiFetch({ model, body, timeoutMs = 20000, retries = 2 }) {
  const url = `${API_ROOT}/${model}:generateContent`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": import.meta.env.VITE_GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(t);

      const data = await response.json().catch(() => ({}));

      // Retry on overload / rate limit
      if ((response.status === 503 || response.status === 429) && attempt < retries) {
        await sleep(800 * (attempt + 1));
        continue;
      }

      // Non-OK: return structured error payload for UI/debug
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          data,
          message: data?.error?.message || "Gemini request failed",
        };
      }

      return { ok: true, status: response.status, data };
    } catch (err) {
      clearTimeout(t);

      // Retry on transient network/timeout
      if (attempt < retries) {
        await sleep(800 * (attempt + 1));
        continue;
      }

      return {
        ok: false,
        status: 0,
        data: null,
        message: err?.name === "AbortError" ? "Request timed out" : (err?.message || "Network error"),
      };
    }
  }
}

export async function generateStudyMode(content) {
  const body = {
    contents: [
      {
        parts: [
          {
            text: `
You are a study assistant.

Return a well-formatted study guide in Markdown with these sections EXACTLY:
## Concise Summary
## Flashcards (Q&A)
## Practice Questions
## Key Equation

Rules:
- Use bullet points where helpful
- Keep math readable (LaTeX is allowed like $\\frac{d}{dx}x^n = nx^{n-1}$)

Notes:
${content}
            `.trim(),
          },
        ],
      },
    ],
  };

  const result = await geminiFetch({ model: TEXT_MODEL, body, retries: 2, timeoutMs: 25000 });

  if (!result.ok) {
    // Return readable error text to show in UI if needed
    return `⚠️ ${result.message}\n\n${JSON.stringify(result.data || {}, null, 2)}`;
  }

  // Join all parts safely (sometimes there are multiple)
  const parts = result.data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p) => p.text || "").join("");
  return text || "No response";
}

export async function extractNoteFromImage({ base64, mimeType }) {
  const body = {
    contents: [
      {
        parts: [
          {
            text: `Extract the notes from this image and return ONLY valid JSON:
{
  "course": "string (like CS120 or MATH122A, guess if obvious else 'UNKNOWN')",
  "title": "short title",
  "content": "clean study notes, preserve formulas"
}

Rules:
- Output JSON ONLY (no backticks, no extra text)
- Keep math readable (use x^(n-1), d/dx, etc.)
`.trim(),
          },
          {
            inlineData: {
              mimeType,
              data: base64,
            },
          },
        ],
      },
    ],
  };

  const result = await geminiFetch({ model: VISION_MODEL, body, retries: 2, timeoutMs: 30000 });

  if (!result.ok) {
    // Fallback object so UI doesn't crash
    return { course: "UNKNOWN", title: "Untitled", content: `⚠️ ${result.message}` };
  }

  const parts = result.data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p) => p.text || "").join("").trim();

  try {
    return JSON.parse(text);
  } catch {
    // If Gemini returns plain text instead of JSON, still give usable output
    return { course: "UNKNOWN", title: "Untitled", content: text };
  }
}