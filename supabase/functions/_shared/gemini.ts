export const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
export const AI_DISABLED_MESSAGE =
  "The AI service is not configured yet. Please contact Guruji directly on WhatsApp.";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export function getGeminiKey() {
  return Deno.env.get("GEMINI_API_KEY") || "";
}

export async function resolveGeminiKey() {
  const envKey = getGeminiKey();
  if (envKey) return envKey;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return "";

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/edge_function_secrets?name=eq.GEMINI_API_KEY&select=value&limit=1`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    },
  );

  if (!response.ok) {
    console.error("[gemini] secret lookup failed", response.status, await response.text().catch(() => ""));
    return "";
  }

  const rows = (await response.json().catch(() => [])) as { value?: string }[];
  return rows[0]?.value || "";
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
