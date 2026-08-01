/**
 * Palm Reading API route — Express port of app/api/palm-reading/route.ts
 *
 * Accepts a palm image (base64) and returns a Vedic palmistry reading
 * using Google Gemini (multimodal).
 */
import { getGeminiKey, geminiUrl, extractText, AI_DISABLED_MESSAGE, SUPPORTED_IMAGE_TYPES, } from "$lib/gemini";
import { rateLimit, clientIp } from "$lib/ratelimit";
const SYSTEM_PROMPT = `You are a warm, respectful Vedic palmistry guide (Hasta Samudrika Shastra) assisting on the "Vedic Astrology" platform of Sampath Kumara.

You will be shown a photograph of a person's palm. Give a thoughtful, encouraging palm reading grounded in classical palmistry.

RULES:
- First silently check the image really shows an open human palm. If it clearly does NOT (no palm visible, too blurry, not a hand), respond ONLY with: "IMAGE_UNCLEAR: <one short friendly sentence asking for a clearer, well-lit photo of the open palm>".
- Otherwise, read what is reasonably visible: the major lines (Heart, Head, Life, and Fate/Sun if visible), the mounts, and overall hand shape.
- Structure the reading with these clearly-labelled sections, each 2-4 sentences:
  1. Overall Impression
  2. Heart Line — Love & Relationships
  3. Head Line — Mind & Career
  4. Life Line — Vitality & Wellbeing
  5. Fate & Fortune
  6. Guidance & Remedies (gentle, spiritual — e.g. mantras, gratitude, a suitable homam)
- Be positive, hopeful, and non-deterministic. Never predict death, disease, exact dates, or guaranteed outcomes.
- Keep the whole reading under ~400 words. Use plain text with the section titles on their own line. No markdown symbols like # or *.
- End by gently inviting them to book a personal consultation with Guruji for deeper analysis.`;
export async function POST(req, res) {
    const key = getGeminiKey();
    if (!key) {
        return res.status(503).json({ ok: false, error: AI_DISABLED_MESSAGE });
    }
    // Free-tier safeguard: max 6 palm readings/min per visitor.
    const ip = clientIp(req);
    const rl = rateLimit(`palm:${ip}`, 6, 60000);
    if (!rl.ok) {
        return res
            .status(429)
            .set("Retry-After", String(rl.retryAfter))
            .json({ ok: false, error: "You're going a little fast — please wait a moment and try again." });
    }
    let body;
    try {
        body = await req.json();
    }
    catch {
        return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
    const { imageBase64, mediaType, name, question } = body;
    if (!imageBase64 || !mediaType) {
        return res.status(400).json({ ok: false, error: "A palm image is required." });
    }
    if (!SUPPORTED_IMAGE_TYPES.includes(mediaType)) {
        return res.status(400).json({ ok: false, error: "Please upload a JPG, PNG or WebP image." });
    }
    if (imageBase64.length > 7500000) {
        return res.status(413).json({ ok: false, error: "Image is too large. Please upload one under 5 MB." });
    }
    const contextLine = [name ? `The querent's name is ${name}.` : null, question ? `They especially want guidance about: ${question}` : null]
        .filter(Boolean)
        .join(" ");
    const payload = {
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [
            {
                role: "user",
                parts: [
                    { inlineData: { mimeType: mediaType, data: imageBase64 } },
                    { text: `Please read this palm.${contextLine ? " " + contextLine : ""}` },
                ],
            },
        ],
        generationConfig: {
            maxOutputTokens: 1800,
            temperature: 0.9,
            thinkingConfig: { thinkingBudget: 0 },
        },
    };
    try {
        const res2 = await fetch(geminiUrl("generateContent", key), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const json = (await res2.json());
        if (!res2.ok) {
            console.error("[palm-reading] gemini error", res2.status, json?.error?.message);
            return res.status(500).json({
                ok: false,
                error: "Something went wrong generating your reading. Please try again.",
            });
        }
        const text = extractText(json).trim();
        if (!text) {
            return res.status(422).json({
                ok: false,
                error: "The reading could not be generated for this image. Please try a clear, well-lit photo of your open palm.",
            });
        }
        if (text.startsWith("IMAGE_UNCLEAR:")) {
            return res.status(422).json({ ok: false, error: text.replace("IMAGE_UNCLEAR:", "").trim() });
        }
        return res.json({ ok: true, reading: text });
    }
    catch (err) {
        console.error("[palm-reading] error", err);
        return res.status(500).json({
            ok: false,
            error: "Something went wrong generating your reading. Please try again.",
        });
    }
}
