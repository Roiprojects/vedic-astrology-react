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
  const isSSL = SMTP_PORT === 465;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: isSSL,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    pool: true,
    maxConnections: 5,
    rateDelta: 1000,
    rateLimit: 5,
  });
}

function generateMessageId() {
  return `<${Date.now()}.${Math.random().toString(36).substring(2, 15)}@myvedicastrology.in>`;
}

function getTransactionalHeaders() {
  return {
    "Message-ID": generateMessageId(),
    "X-Mailer": "My Vedic Astrology Mailer",
    "X-Priority": "3",
  };
}

// Only for actual bulk/newsletter emails
function getBulkHeaders() {
  return {
    ...getTransactionalHeaders(),
    "List-Unsubscribe": "<mailto:info@myvedicastrology.in?subject=unsubscribe>, <https://myvedicastrology.in/unsubscribe>",
    "Precedence": "bulk",
    "X-Auto-Response-Suppress": "OOF, AutoReply",
  };
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
    const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    await transport.sendMail({
      from: `My Vedic Astrology <${SMTP_FROM}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
      text,
      headers: getTransactionalHeaders(),
    });
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

export async function sendConsultationReport(data: {
  toEmail: string;
  toName: string;
  serviceTitle: string;
  pdfBuffer: Buffer;
  fileName: string;
}): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    console.info("[mailer] SMTP not configured — consultation report not sent to customer");
    return;
  }

  const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fffbf0;border:1px solid #e9c97e;border-radius:12px;overflow:hidden;">
  <div style="background:#b45309;padding:28px 32px;">
    <h1 style="margin:0;color:white;font-size:22px;letter-spacing:0.5px;">ॐ My Vedic Astrology</h1>
    <p style="margin:8px 0 0;color:#ffe9b3;font-size:13px;">Sampath Kumara Guruji · Bangalore</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="font-size:16px;color:#1c1010;">Namaste, <strong>${data.toName}</strong> 🙏</p>
    <p style="color:#4b3320;line-height:1.7;">
      Your personalized <strong>${data.serviceTitle}</strong> consultation report has been prepared by
      Guruji using the principles of <em>Parasara Hora Shastra</em> and the Lahiri/Chitra Paksha ayanamsa.
    </p>
    <p style="color:#4b3320;line-height:1.7;">
      Please find your detailed Vedic Astrology report attached to this email as a PDF.
      It includes your nakshatra, rashi, lagna, astrological analysis of your concern,
      remedies, mantras, and gemstone recommendations.
    </p>
    <div style="background:#fef3c7;border-left:4px solid #b45309;padding:14px 18px;margin:20px 0;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:13px;color:#78350f;font-style:italic;">
        "The planets influence, but the soul decides. These remedies, when followed with devotion,
        bring the grace of the Divine to remove obstacles from your path."
        <br/>— Sampath Kumara Guruji
      </p>
    </div>
    <p style="color:#4b3320;line-height:1.7;">
      For any follow-up questions, please reply to this email or reach Guruji directly on WhatsApp.
    </p>
    <p style="margin-top:24px;color:#4b3320;">With blessings,<br/>
    <strong style="color:#b45309;">Sampath Kumara Guruji</strong><br/>
    My Vedic Astrology · Bangalore<br/>
    <a href="https://myvedicastrology.in" style="color:#b45309;">myvedicastrology.in</a>
    </p>
  </div>
  <div style="background:#fdf3e3;padding:14px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#a38060;">
      © My Vedic Astrology · Bangalore · info@myvedicastrology.in
    </p>
  </div>
</div>
`;

  const text = `Namaste ${data.toName},

Your personalized ${data.serviceTitle} Vedic Astrology Report is ready.

Guruji has prepared your detailed report using Parasara Hora Shastra and Lahiri/Chitra Paksha ayanamsa. The PDF is attached and includes your nakshatra, rashi, lagna, analysis, remedies, mantras, and gemstone recommendations.

"The planets influence, but the soul decides. These remedies, when followed with devotion, bring the grace of the Divine to remove obstacles from your path."
— Sampath Kumara Guruji

For follow-up questions, reply to this email or contact Guruji on WhatsApp: +91 98861 00565

With blessings,
Sampath Kumara Guruji
My Vedic Astrology · Bangalore
https://myvedicastrology.in

© My Vedic Astrology · Bangalore · info@myvedicastrology.in`;

  try {
    await transport.sendMail({
      from: `My Vedic Astrology — Guruji <${SMTP_FROM}>`,
      to: `${data.toName} <${data.toEmail}>`,
      subject: `Your ${data.serviceTitle} Vedic Astrology Report — My Vedic Astrology`,
      html,
      text,
      headers: getTransactionalHeaders(),
      attachments: [
        {
          filename: data.fileName,
          content: data.pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    console.info("[mailer] consultation report sent to:", data.toEmail);
  } catch (e) {
    console.error("[mailer] failed to send consultation report:", e);
  }
}

const VARIANT_LABELS: Record<string, string> = {
  consultation: "Astrology Consultation",
  homam: "Homam Booking",
  "birth-chart": "Birth Chart PDF",
  chat: "Chat Booking",
  contact: "General Enquiry",
};

/** Confirmation email sent to the customer after any form submission */
export async function sendCustomerConfirmation(data: {
  toEmail: string;
  toName: string;
  reference: string;
  variant: string;
  subject?: string | null;
  dob?: string | null;
  tob?: string | null;
  pob?: string | null;
  message?: string | null;
}): Promise<void> {
  const transport = createTransport();
  if (!transport) return;

  const serviceLabel = data.subject || VARIANT_LABELS[data.variant] || "Enquiry";
  const hasBirthDetails = data.dob || data.tob || data.pob;

  const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fffbf0;border:1px solid #e9c97e;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#b45309,#92400e);padding:24px 32px;">
    <h1 style="margin:0;color:#ffe08a;font-size:20px;letter-spacing:0.5px;">ॐ My Vedic Astrology</h1>
    <p style="margin:8px 0 0;color:#ffe9b3;font-size:13px;">Sampath Kumara Guruji · Bangalore</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#1c1010;margin:0 0 12px;">Namaste, <strong>${data.toName}</strong> 🙏</p>
    <p style="color:#4b3320;line-height:1.7;margin:0 0 16px;">
      Thank you for reaching out to My Vedic Astrology. We have received your request for
      <strong>${serviceLabel}</strong> and Guruji will review your details and get back to you shortly.
    </p>

    <div style="background:#fff3cd;border:1.5px solid #b45309;border-radius:10px;padding:16px 20px;margin:0 0 20px;">
      <p style="margin:0 0 6px;font-size:12px;color:#7c4a00;text-transform:uppercase;letter-spacing:0.08em;">Your Reference Number</p>
      <p style="margin:0;font-size:28px;font-weight:bold;letter-spacing:4px;color:#b45309;font-family:monospace;">${data.reference}</p>
      <p style="margin:6px 0 0;font-size:12px;color:#7c4a00;">Please keep this safe for follow-up</p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
      <tr style="border-bottom:1px solid #f0e0b0;">
        <td style="padding:8px 0;color:#7c5c30;width:130px;">Service</td>
        <td style="padding:8px 0;color:#1c1010;font-weight:500;">${serviceLabel}</td>
      </tr>
      ${hasBirthDetails ? `
      <tr style="border-bottom:1px solid #f0e0b0;">
        <td style="padding:8px 0;color:#7c5c30;">Date of Birth</td>
        <td style="padding:8px 0;color:#1c1010;">${data.dob || "—"}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0b0;">
        <td style="padding:8px 0;color:#7c5c30;">Time of Birth</td>
        <td style="padding:8px 0;color:#1c1010;">${data.tob || "—"}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0e0b0;">
        <td style="padding:8px 0;color:#7c5c30;">Place of Birth</td>
        <td style="padding:8px 0;color:#1c1010;">${data.pob || "—"}</td>
      </tr>` : ""}
      ${data.message ? `
      <tr>
        <td style="padding:8px 0;color:#7c5c30;vertical-align:top;">Your concern</td>
        <td style="padding:8px 0;color:#1c1010;">${data.message}</td>
      </tr>` : ""}
    </table>

    <div style="background:#fef3c7;border-left:4px solid #b45309;padding:14px 18px;margin-bottom:20px;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:13px;color:#78350f;font-style:italic;">
        "The planets influence, but the soul decides. With sincere effort and divine grace, every obstacle can be overcome."
        <br/>— Sampath Kumara Guruji
      </p>
    </div>

    <p style="color:#4b3320;line-height:1.7;font-size:14px;margin:0 0 6px;">
      Guruji will reach out to you via phone or WhatsApp within <strong>24–48 hours</strong>.
      For urgent matters, contact us directly:
    </p>
    <p style="margin:0;font-size:14px;">
      📞 <a href="tel:+919886100565" style="color:#b45309;">+91 98861 00565</a> &nbsp;·&nbsp;
      💬 <a href="https://wa.me/919886100565" style="color:#b45309;">WhatsApp</a>
    </p>
  </div>
  <div style="background:#fdf3e3;padding:14px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#a38060;">
      © My Vedic Astrology · Bangalore ·
      <a href="https://myvedicastrology.in" style="color:#b45309;">myvedicastrology.in</a> ·
      info@myvedicastrology.in
    </p>
  </div>
</div>`;

  const text = `Namaste ${data.toName},

Thank you for reaching out to My Vedic Astrology. We have received your request for ${serviceLabel} (Ref: ${data.reference}).

${hasBirthDetails ? `Birth Details:
Date of Birth: ${data.dob || "—"}
Time of Birth: ${data.tob || "—"}
Place of Birth: ${data.pob || "—"}

` : ""}${data.message ? `Your concern: ${data.message}

` : ""}"The planets influence, but the soul decides. With sincere effort and divine grace, every obstacle can be overcome."
— Sampath Kumara Guruji

Guruji will reach out to you via phone or WhatsApp within 24–48 hours.
For urgent matters: +91 98861 00565 | WhatsApp: https://wa.me/919886100565

---
My Vedic Astrology · Bangalore
https://myvedicastrology.in
info@myvedicastrology.in`;

  try {
    await transport.sendMail({
      from: `My Vedic Astrology <${SMTP_FROM}>`,
      to: `${data.toName} <${data.toEmail}>`,
      subject: `We received your ${serviceLabel} request — Ref: ${data.reference}`,
      html,
      text,
      headers: getTransactionalHeaders(),
    });
    console.info("[mailer] customer confirmation sent to:", data.toEmail);
  } catch (e) {
    console.error("[mailer] customer confirmation failed:", e);
  }
}

/** Payment confirmation email sent to the customer after successful payment */
export async function sendCustomerPaymentConfirmation(data: {
  toEmail: string;
  toName: string;
  reference: string;
  paymentId: string;
  amount: number;
  serviceName: string;
}): Promise<void> {
  const transport = createTransport();
  if (!transport) return;

  const amountFormatted = `₹${(data.amount / 100).toLocaleString("en-IN")}`;

  const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fffbf0;border:1px solid #e9c97e;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#15803d,#166534);padding:24px 32px;">
    <h1 style="margin:0;color:#bbf7d0;font-size:20px;letter-spacing:0.5px;">✓ Payment Confirmed</h1>
    <p style="margin:8px 0 0;color:#dcfce7;font-size:13px;">My Vedic Astrology · Bangalore</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#1c1010;margin:0 0 12px;">Namaste, <strong>${data.toName}</strong> 🙏</p>
    <p style="color:#4b3320;line-height:1.7;margin:0 0 20px;">
      Your payment of <strong>${amountFormatted}</strong> for <strong>${data.serviceName}</strong> has been received successfully.
      Your booking is now confirmed and Guruji will reach out to you shortly.
    </p>

    <div style="background:#f0fdf4;border:1.5px solid #22c55e;border-radius:10px;padding:20px;margin:0 0 20px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #bbf7d0;">
          <td style="padding:8px 0;color:#166534;width:140px;">Amount Paid</td>
          <td style="padding:8px 0;font-weight:bold;font-size:18px;color:#15803d;">${amountFormatted}</td>
        </tr>
        <tr style="border-bottom:1px solid #bbf7d0;">
          <td style="padding:8px 0;color:#166534;">Service</td>
          <td style="padding:8px 0;color:#1c1010;">${data.serviceName}</td>
        </tr>
        <tr style="border-bottom:1px solid #bbf7d0;">
          <td style="padding:8px 0;color:#166534;">Reference</td>
          <td style="padding:8px 0;font-weight:bold;color:#b45309;letter-spacing:1px;">${data.reference}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#166534;">Payment ID</td>
          <td style="padding:8px 0;font-family:monospace;font-size:12px;color:#555;">${data.paymentId}</td>
        </tr>
      </table>
    </div>

    <p style="color:#4b3320;line-height:1.7;font-size:14px;margin:0 0 6px;">
      Guruji will contact you within <strong>24–48 hours</strong>. For urgent queries:
    </p>
    <p style="margin:0;font-size:14px;">
      📞 <a href="tel:+919886100565" style="color:#b45309;">+91 98861 00565</a> &nbsp;·&nbsp;
      💬 <a href="https://wa.me/919886100565" style="color:#b45309;">WhatsApp</a>
    </p>
  </div>
  <div style="background:#fdf3e3;padding:14px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#a38060;">
      © My Vedic Astrology · Bangalore ·
      <a href="https://myvedicastrology.in" style="color:#b45309;">myvedicastrology.in</a>
    </p>
  </div>
</div>`;

  const text = `Namaste ${data.toName},

Your payment of ${amountFormatted} for ${data.serviceName} has been received successfully.

Booking Reference: ${data.reference}
Payment ID: ${data.paymentId}

Your booking is now confirmed and Guruji will reach out to you shortly.

Guruji will contact you within 24–48 hours.
For urgent queries: +91 98861 00565 | WhatsApp: https://wa.me/919886100565

---
My Vedic Astrology · Bangalore
https://myvedicastrology.in`;

  try {
    await transport.sendMail({
      from: `My Vedic Astrology <${SMTP_FROM}>`,
      to: `${data.toName} <${data.toEmail}>`,
      subject: `Payment Confirmed ${amountFormatted} — ${data.serviceName} · Ref: ${data.reference}`,
      html,
      text,
      headers: getTransactionalHeaders(),
    });
    console.info("[mailer] payment confirmation sent to:", data.toEmail);
  } catch (e) {
    console.error("[mailer] payment confirmation failed:", e);
  }
}
