/**
 * Email notification utility — uses nodemailer.
 * Configure via environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAIL
 *
 * Works with Gmail (App Password), ZOHO, or any SMTP.
 * If env vars are not set, notifications are logged to console only.
 */
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER || "noreply@guruji.com";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER || "";

function createTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export async function sendAdminNotification(subject: string, html: string): Promise<void> {
  if (!ADMIN_EMAIL) {
    console.info("[mailer] ADMIN_EMAIL not set — notification not sent:", subject);
    return;
  }
  const transport = createTransport();
  if (!transport) {
    console.info("[mailer] SMTP not configured — notification not sent:", subject);
    return;
  }
  try {
    await transport.sendMail({ from: `My Vedic Astrology <${SMTP_FROM}>`, to: ADMIN_EMAIL, subject, html });
    console.info("[mailer] sent:", subject);
  } catch (e) {
    console.error("[mailer] send failed:", e);
  }
}

export async function sendPaymentNotification(data: {
  reference: string;
  paymentId: string;
  orderId: string;
  amount: number;
  serviceName: string;
  name?: string;
  email?: string;
  phone?: string;
}): Promise<void> {
  const amountFormatted = `₹${(data.amount / 100).toLocaleString("en-IN")}`;
  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#15803d;">Payment Received — ${data.reference}</h2>
  <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:12px 0;">
    <p style="margin:0;font-size:16px;color:#166534;font-weight:bold;">Amount: ${amountFormatted}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:#888;width:140px;">Payment ID</td><td style="padding:6px 0;font-family:monospace;">${data.paymentId}</td></tr>
    <tr><td style="padding:6px 0;color:#888;">Order ID</td><td style="padding:6px 0;font-family:monospace;">${data.orderId}</td></tr>
    <tr><td style="padding:6px 0;color:#888;">Enquiry Ref</td><td style="padding:6px 0;font-weight:bold;">${data.reference}</td></tr>
    <tr><td style="padding:6px 0;color:#888;">Service</td><td style="padding:6px 0;">${data.serviceName}</td></tr>
    ${data.name ? `<tr><td style="padding:6px 0;color:#888;">Customer</td><td style="padding:6px 0;">${data.name}</td></tr>` : ""}
    ${data.phone ? `<tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">${data.phone}</td></tr>` : ""}
    ${data.email ? `<tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${data.email}</td></tr>` : ""}
  </table>
  <p style="margin-top:20px;color:#666;font-size:12px;">View in admin: <a href="https://yoursite.com/admin/enquiries">Admin Panel → Enquiries</a></p>
</div>
`;
  await sendAdminNotification(`Payment Received ${amountFormatted} — ${data.reference}`, html);
}

export async function sendEnquiryNotification(data: {
  reference: string;
  variant: string;
  subject?: string;
  name: string;
  phone: string;
  email?: string | null;
  dob?: string | null;
  tob?: string | null;
  pob?: string | null;
  message?: string | null;
}): Promise<void> {
  const typeLabel = data.variant === "homam" ? "Homam Booking" : data.variant === "consultation" ? "Consultation" : "Enquiry";
  const subjectLine = `New ${typeLabel}: ${data.name} — ${data.reference}`;

  const html = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#b45309;">New ${typeLabel} — ${data.reference}</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:6px 0;color:#888;width:140px;">Name</td><td style="padding:6px 0;font-weight:bold;">${data.name}</td></tr>
    <tr><td style="padding:6px 0;color:#888;">Phone</td><td style="padding:6px 0;">${data.phone}</td></tr>
    ${data.email ? `<tr><td style="padding:6px 0;color:#888;">Email</td><td style="padding:6px 0;">${data.email}</td></tr>` : ""}
    ${data.subject ? `<tr><td style="padding:6px 0;color:#888;">Service</td><td style="padding:6px 0;">${data.subject}</td></tr>` : ""}
    ${data.dob ? `<tr><td style="padding:6px 0;color:#888;">Date of Birth</td><td style="padding:6px 0;">${data.dob}</td></tr>` : ""}
    ${data.tob ? `<tr><td style="padding:6px 0;color:#888;">Time of Birth</td><td style="padding:6px 0;">${data.tob}</td></tr>` : ""}
    ${data.pob ? `<tr><td style="padding:6px 0;color:#888;">Place of Birth</td><td style="padding:6px 0;">${data.pob}</td></tr>` : ""}
    ${data.message ? `<tr><td style="padding:6px 0;color:#888;vertical-align:top;">Message</td><td style="padding:6px 0;">${data.message}</td></tr>` : ""}
  </table>
  <p style="margin-top:20px;color:#666;font-size:12px;">View in admin: <a href="https://yoursite.com/admin/enquiries">Admin Panel → Enquiries</a></p>
</div>
`;

  await sendAdminNotification(subjectLine, html);
}
