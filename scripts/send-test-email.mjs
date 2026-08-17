import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "ns1.sslsecure.co.in",
  port: 465,
  secure: true,
  auth: { user: "info@myvedicastrology.in", pass: "1qLVTZ0vOgFkx" },
  tls: { rejectUnauthorized: false, ciphers: "SSLv3" },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#fffbf0;border:1px solid #e9c97e;border-radius:12px;overflow:hidden;">
  <div style="background:#b45309;padding:28px 32px;">
    <h1 style="margin:0;color:white;font-size:22px;letter-spacing:0.5px;">ॐ My Vedic Astrology</h1>
    <p style="margin:8px 0 0;color:#ffe9b3;font-size:13px;">Sampath Kumara Guruji · Bangalore</p>
  </div>
  <div style="padding:28px 32px;">
    <p style="font-size:16px;color:#1c1010;">Namaste 🙏</p>
    <p style="color:#4b3320;line-height:1.7;">
      This is a <strong>test email</strong> from My Vedic Astrology website (myvedicastrology.in).
    </p>
    <p style="color:#4b3320;line-height:1.7;">
      Our SMTP email system is configured and working correctly. Consultation reports, booking confirmations,
      and enquiry notifications will be delivered through this email system.
    </p>
    <div style="background:#fef3c7;border-left:4px solid #b45309;padding:14px 18px;margin:20px 0;border-radius:0 8px 8px 0;">
      <p style="margin:0;font-size:13px;color:#78350f;font-style:italic;">
        "The stars align, and the path becomes clear through devotion and divine wisdom."
        <br/>— Sampath Kumara Guruji
      </p>
    </div>
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

const recipients = [
  "roiprojects012@gmail.com",
  "sdata0605@gmail.com",
];

console.log("Verifying SMTP connection...");
try {
  await transport.verify();
  console.log("✓ SMTP connection OK");
} catch (e) {
  console.error("✗ SMTP verify failed:", e.message);
  process.exit(1);
}

for (const to of recipients) {
  try {
    const info = await transport.sendMail({
      from: `My Vedic Astrology — Guruji <info@myvedicastrology.in>`,
      to,
      subject: "Test Email — My Vedic Astrology (myvedicastrology.in)",
      html,
    });
    console.log(`✓ Sent to ${to} — messageId: ${info.messageId}`);
  } catch (e) {
    console.error(`✗ Failed to send to ${to}:`, e.message);
  }
}

transport.close();
console.log("Done.");
