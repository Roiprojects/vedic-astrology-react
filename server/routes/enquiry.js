/**
 * Enquiry / Booking API route — Express port of app/api/enquiry/route.ts
 *
 * Simple POST endpoint that validates booking data and logs it.
 */
import { bookingSchema } from "$lib/validation";
export async function POST(req, res) {
    let body;
    try {
        body = await req.json();
    }
    catch {
        return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
        return res.status(422).json({
            ok: false,
            error: "Validation failed",
            issues: parsed.error.flatten(),
        });
    }
    // Honeypot: silently accept but ignore obvious bots.
    if (parsed.data.website) {
        return res.json({ ok: true, id: "ignored" });
    }
    const reference = `VA-${Date.now().toString(36).toUpperCase()}`;
    // Placeholder for Supabase insert (backend phase).
    console.info("[enquiry] received", { reference, variant: parsed.data.variant });
    return res.json({ ok: true, reference });
}
