export const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
export const AI_DISABLED_MESSAGE =
  "The AI service is not configured yet. Please contact Guruji directly on WhatsApp.";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export function getGeminiKey() {
  return Deno.env.get("GEMINI_API_KEY") || "";
}

export function geminiUrl(method: "generateContent" | "streamGenerateContent", key: string) {
  const sse = method === "streamGenerateContent" ? "&alt=sse" : "";
  return `${BASE}/${GEMINI_MODEL}:${method}?key=${encodeURIComponent(key)}${sse}`;
}

export function extractText(json: { candidates?: { content?: { parts?: { text?: string }[] } }[] }) {
  const parts = json?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts.map((part) => (typeof part?.text === "string" ? part.text : "")).join("");
}