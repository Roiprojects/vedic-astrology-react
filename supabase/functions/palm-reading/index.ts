import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { AI_DISABLED_MESSAGE, extractText, geminiUrl, resolveGeminiKey } from "../_shared/gemini.ts";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SYSTEM_PROMPT = `You are a warm, respectful Vedic palmistry guide assisting on the Vedic Astrology platform of Sampath Kumara.

First silently check the image really shows an open human palm. If it clearly does not, respond only with: IMAGE_UNCLEAR: one short friendly sentence asking for a clearer, well-lit photo.

Otherwise, give a thoughtful, encouraging palm reading with these sections: Overall Impression, Heart Line - Love & Relationships, Head Line - Mind & Career, Life Line - Vitality & Wellbeing, Fate & Fortune, Guidance & Remedies. Be positive and non-deterministic. Never predict death, disease, exact dates, or guaranteed outcomes. Keep under 400 words and invite them to book a personal consultation for deeper analysis.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  const key = await resolveGeminiKey();
  if (!key) return jsonResponse({ ok: false, error: AI_DISABLED_MESSAGE }, 503);

  let body: { imageBase64?: string; mediaType?: string; name?: string; question?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
  }

  if (!body.imageBase64 || !body.mediaType) return jsonResponse({ ok: false, error: "A palm image is required." }, 400);
  if (!SUPPORTED_IMAGE_TYPES.includes(body.mediaType)) return jsonResponse({ ok: false, error: "Please upload a JPG, PNG or WebP image." }, 400);
  if (body.imageBase64.length > 7_500_000) return jsonResponse({ ok: false, error: "Image is too large. Please upload one under 5 MB." }, 413);

  const contextLine = [body.name ? `The querent's name is ${body.name}.` : null, body.question ? `They especially want guidance about: ${body.question}` : null]
    .filter(Boolean)
    .join(" ");

  const payload = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{
      role: "user",
      parts: [
        { inlineData: { mimeType: body.mediaType, data: body.imageBase64 } },
        { text: `Please read this palm.${contextLine ? " " + contextLine : ""}` },
      ],
    }],
    generationConfig: { maxOutputTokens: 1800, temperature: 0.9, thinkingConfig: { thinkingBudget: 0 } },
  };

  try {
    const upstream = await fetch(geminiUrl("generateContent", key), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await upstream.json();
    if (!upstream.ok) {
      console.error("[palm-reading] gemini error", upstream.status, json?.error?.message);
      return jsonResponse({ ok: false, error: "Something went wrong generating your reading. Please try again." }, 500);
    }
    const text = extractText(json).trim();
    if (!text) return jsonResponse({ ok: false, error: "The reading could not be generated for this image. Please try a clear, well-lit photo of your open palm." }, 422);
    if (text.startsWith("IMAGE_UNCLEAR:")) return jsonResponse({ ok: false, error: text.replace("IMAGE_UNCLEAR:", "").trim() }, 422);
    return jsonResponse({ ok: true, reading: text });
  } catch (err) {
    console.error("[palm-reading] error", err);
    return jsonResponse({ ok: false, error: "Something went wrong generating your reading. Please try again." }, 500);
  }
});
