/** Enquiry / Booking API route — stores to PostgreSQL. */
import { Router } from "express";
import { refineForVariant, type BookingVariant } from "../../src/lib/validation";
import { query } from "../lib/db";
import { sendEnquiryNotification, sendCustomerConfirmation } from "../lib/mailer";
import { sendAutoReport, shouldSendAutoReport } from "../lib/dosha-report";
import { rateLimit, clientIp } from "../lib/ratelimit";

const router = Router();

router.post("/", async (req, res) => {
  // 10 enquiries per hour per IP
  const ip = clientIp(req as Parameters<typeof clientIp>[0]);
  const rl = rateLimit(`enquiry:${ip}`, 10, 60 * 60_000);
  if (!rl.ok) {
    return res.status(429).set("Retry-After", String(rl.retryAfter)).json({ ok: false, error: "Too many submissions. Please try again later." });
  }

  const variant = (req.body?.variant || "contact") as BookingVariant;
  const parsed = refineForVariant(variant).safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ ok: false, error: "Validation failed", issues: parsed.error.flatten() });
  }

  if ((parsed.data as { website?: string }).website) {
    return res.json({ ok: true, id: "ignored" });
  }

  const d = parsed.data as Record<string, string | undefined>;
  const reference = `VA-${Date.now().toString(36).toUpperCase()}`;

  try {
    await query(
      `INSERT INTO enquiries (reference, variant, subject, name, phone, email, dob, tob, pob, gender, preferred_mode, preferred_date, message, service_interested, preferred_contact)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [reference, variant, d.subject||'', d.name||'', d.phone||'', d.email||null,
       d.dob||null, d.tob||null, d.pob||null, d.gender||null,
       d.preferredMode||null, d.preferredDate||null, d.message||null,
       d.serviceInterested||null, d.preferredContact||null]
    );
  } catch (e) {
    console.error("[enquiry] DB error:", e);
  }

  console.info("[enquiry] received", { reference, variant });

  // Send email notification to admin for all bookings
  sendEnquiryNotification({
    reference, variant, subject: d.subject,
    name: d.name || "", phone: d.phone || "",
    email: d.email, dob: d.dob, tob: d.tob, pob: d.pob, message: d.message,
  }).catch(() => {});

  // Send confirmation email to customer for all form submissions
  if (d.email) {
    sendCustomerConfirmation({
      toEmail: d.email,
      toName: d.name || "Valued Customer",
      reference,
      variant,
      subject: d.subject || null,
      dob: d.dob || null,
      tob: d.tob || null,
      pob: d.pob || null,
      message: d.message || null,
    }).catch(() => {});
  }

  // Send automated dosha analysis report to customer (if email provided)
  if (d.email && shouldSendAutoReport(d.subject || variant, d.email)) {
    sendAutoReport({
      reference, name: d.name || "", email: d.email,
      subject: d.subject, dob: d.dob, tob: d.tob, pob: d.pob, message: d.message,
    }).catch(() => {});
  }

  return res.json({ ok: true, reference });
});

export default router;
