/**
 * User auth routes (SMTP OTP login) + profile management.
 *
 * POST /api/user/send-otp    — send 6-digit OTP to email
 * POST /api/user/verify-otp  — verify OTP, return JWT
 * GET  /api/user/me          — get current user from Bearer JWT
 * PUT  /api/user/profile     — update user profile (name, phone, birth)
 */

import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { query } from "../lib/db";
import { generateOTP, storeOTP, verifyOTP } from "../lib/otp";
import { rateLimit, clientIp } from "../lib/ratelimit";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "vedic-user-jwt-secret";

// ─── JWT helpers ─────────────────────────────────────────────────────────────

function signUserToken(email: string, userId: number): string {
  return jwt.sign({ email, userId }, JWT_SECRET, { expiresIn: "30d" });
}

export function getUserFromToken(req: Request): { email: string; userId: number } | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { email: string; userId: number };
    return { email: payload.email, userId: payload.userId };
  } catch {
    return null;
  }
}

// ─── SMTP transport ───────────────────────────────────────────────────────────

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });
}

// ─── Ensure users table ───────────────────────────────────────────────────────

async function ensureUsersTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS app_users (
        id          SERIAL PRIMARY KEY,
        email       TEXT UNIQUE NOT NULL,
        name        TEXT,
        phone       TEXT,
        dob         TEXT,
        tob         TEXT,
        pob         TEXT,
        gender      TEXT,
        language    TEXT,
        plan        TEXT DEFAULT 'free',
        plan_expires_at TIMESTAMPTZ,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } catch (e) {
    console.error("[user] ensureUsersTable error:", e);
  }
}
ensureUsersTable();

// ─── Routes ───────────────────────────────────────────────────────────────────

/** POST /api/user/send-otp */
router.post("/send-otp", async (req: Request, res: Response) => {
  const ip = clientIp(req as Parameters<typeof clientIp>[0]);
  const rl = rateLimit(`otp-send:${ip}`, 5, 10 * 60_000); // 5 per 10 min per IP
  if (!rl.ok) {
    return res.status(429).json({ ok: false, error: "Too many requests. Please wait before requesting another OTP." });
  }

  const { email } = req.body as { email?: string };
  if (!email || !email.includes("@")) {
    return res.status(400).json({ ok: false, error: "A valid email address is required." });
  }

  const transport = createTransport();
  if (!transport) {
    return res.status(503).json({ ok: false, error: "Email service is not configured." });
  }

  const otp = generateOTP();
  storeOTP(email, otp);

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const html = `
<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;background:#fffbf0;border:1px solid #e9c97e;border-radius:12px;overflow:hidden;">
  <div style="background:linear-gradient(135deg,#b45309,#92400e);padding:24px 32px;">
    <h1 style="margin:0;color:#ffe08a;font-size:20px;letter-spacing:0.5px;">ॐ My Vedic Astrology</h1>
  </div>
  <div style="padding:28px 32px;">
    <p style="font-size:15px;color:#1c1010;margin:0 0 12px;">Namaste 🙏</p>
    <p style="color:#4b3320;line-height:1.7;margin:0 0 20px;">Your one-time sign-in code for My Vedic Astrology is:</p>
    <div style="text-align:center;background:#fff3cd;border:2px solid #b45309;border-radius:12px;padding:20px;margin:0 0 20px;">
      <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#b45309;font-family:monospace;">${otp}</span>
    </div>
    <p style="color:#6b5230;font-size:13px;margin:0 0 8px;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
    <p style="color:#6b5230;font-size:13px;margin:0;">If you did not request this, please ignore this email.</p>
  </div>
  <div style="background:#fdf3e3;padding:14px 32px;text-align:center;">
    <p style="margin:0;font-size:11px;color:#a38060;">© My Vedic Astrology · info@myvedicastrology.in</p>
  </div>
</div>`;

  try {
    await transport.sendMail({
      from: `My Vedic Astrology <${from}>`,
      to: email,
      subject: `${otp} — Your My Vedic Astrology sign-in code`,
      html,
    });
    return res.json({ ok: true, message: "OTP sent to your email." });
  } catch (e) {
    console.error("[user/send-otp] mail error:", e);
    return res.status(500).json({ ok: false, error: "Failed to send OTP email. Please try again." });
  }
});

/** POST /api/user/verify-otp */
router.post("/verify-otp", async (req: Request, res: Response) => {
  const ip = clientIp(req as Parameters<typeof clientIp>[0]);
  const rl = rateLimit(`otp-verify:${ip}`, 10, 10 * 60_000);
  if (!rl.ok) {
    return res.status(429).json({ ok: false, error: "Too many verification attempts." });
  }

  const { email, otp, name } = req.body as { email?: string; otp?: string; name?: string };
  if (!email || !otp) {
    return res.status(400).json({ ok: false, error: "Email and OTP are required." });
  }

  const result = verifyOTP(email, otp);
  if (result === "expired") return res.status(400).json({ ok: false, error: "OTP has expired. Please request a new one." });
  if (result === "too_many_attempts") return res.status(400).json({ ok: false, error: "Too many failed attempts. Please request a new OTP." });
  if (result !== "valid") return res.status(400).json({ ok: false, error: "Incorrect code. Please try again." });

  // Upsert user
  try {
    const row = await query(
      `INSERT INTO app_users (email, name, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (email) DO UPDATE
         SET name = COALESCE(EXCLUDED.name, app_users.name), updated_at = NOW()
       RETURNING id, email, name, plan, plan_expires_at`,
      [email.toLowerCase(), name || null]
    );
    const user = row.rows[0] as { id: number; email: string; name: string | null; plan: string; plan_expires_at: string | null };
    const token = signUserToken(user.email, user.id);
    return res.json({ ok: true, token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan, planExpiresAt: user.plan_expires_at } });
  } catch (e) {
    console.error("[user/verify-otp] db error:", e);
    return res.status(500).json({ ok: false, error: "Account creation failed. Please try again." });
  }
});

/** GET /api/user/me */
router.get("/me", async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ ok: false, error: "Not authenticated." });
  try {
    const row = await query(
      `SELECT id, email, name, phone, dob, tob, pob, gender, language, plan, plan_expires_at FROM app_users WHERE id = $1`,
      [user.userId]
    );
    if (!row.rows.length) return res.status(404).json({ ok: false, error: "User not found." });
    const u = row.rows[0];
    return res.json({ ok: true, user: u });
  } catch (e) {
    console.error("[user/me] db error:", e);
    return res.status(500).json({ ok: false, error: "Failed to load profile." });
  }
});

/** PUT /api/user/profile */
router.put("/profile", async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ ok: false, error: "Not authenticated." });
  const { name, phone, dob, tob, pob, gender, language } = req.body as {
    name?: string; phone?: string; dob?: string; tob?: string; pob?: string; gender?: string; language?: string;
  };
  try {
    await query(
      `UPDATE app_users SET
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        dob = COALESCE($3, dob),
        tob = COALESCE($4, tob),
        pob = COALESCE($5, pob),
        gender = COALESCE($6, gender),
        language = COALESCE($7, language),
        updated_at = NOW()
       WHERE id = $8`,
      [name || null, phone || null, dob || null, tob || null, pob || null, gender || null, language || null, user.userId]
    );
    return res.json({ ok: true });
  } catch (e) {
    console.error("[user/profile] db error:", e);
    return res.status(500).json({ ok: false, error: "Failed to update profile." });
  }
});

export default router;
