import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type EnquiryBody = Record<string, string | number | null | undefined>;

function requireEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function reference() {
  return `VA-${Date.now().toString(36).toUpperCase()}`;
}

async function insertRow(table: string, row: Record<string, unknown>) {
  const supabaseUrl = requireEnv("SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceKey}`,
      "apikey": serviceKey,
      "Prefer": "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ ok: false, error: "Method not allowed" }, 405);

  let body: EnquiryBody;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON" }, 400);
  }

  if (body.website) return jsonResponse({ ok: true, id: "ignored" });
  if (!body.name || !body.phone) return jsonResponse({ ok: false, error: "Name and phone are required." }, 422);

  const ref = reference();
  const variant = String(body.variant || "contact");

  try {
    if (variant === "contact") {
      await insertRow("contact_enquiries", {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        subject: body.subject || null,
        message: body.message || null,
        service_interested: body.serviceInterested || null,
      });
    } else if (variant === "birth-chart") {
      await insertRow("birth_chart_requests", {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        dob: body.dob || null,
        tob: body.tob || null,
        pob: body.pob || null,
        gender: body.gender || null,
        notes: body.message || null,
      });
    } else {
      await insertRow("bookings", {
        reference: ref,
        variant,
        subject: body.subject || null,
        customer_name: body.name,
        phone: body.phone,
        email: body.email || null,
        dob: body.dob || null,
        tob: body.tob || null,
        pob: body.pob || null,
        gender: body.gender || null,
        preferred_date: body.preferredDate || null,
        preferred_mode: body.preferredMode || null,
        message: body.message || null,
      });
    }
    return jsonResponse({ ok: true, reference: ref });
  } catch (err) {
    console.error("[enquiry] insert error", err);
    return jsonResponse({ ok: false, error: "Could not submit. Please try WhatsApp." }, 500);
  }
});