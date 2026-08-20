import { Router } from "express";
import jwt from "jsonwebtoken";
import { rateLimit, clientIp } from "../lib/ratelimit";
import { query } from "../lib/db";

const router = Router();
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

async function getAdminConfig() {
  let JWT_SECRET = process.env.JWT_SECRET;
  let ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    try {
      const res = await query(
        "SELECT key, value::text FROM settings WHERE key IN ('jwt_secret','admin_email','admin_password')"
      );
      for (const row of res.rows) {
        const val = row.value?.replace(/^"|"$/g, "");
        if (row.key === "jwt_secret") JWT_SECRET = val;
        if (row.key === "admin_email") ADMIN_EMAIL = val;
        if (row.key === "admin_password") ADMIN_PASSWORD = val;
      }
    } catch { /* DB unavailable — fall through */ }
  }
  return { JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD };
}

router.post("/login", async (req, res) => {
  const ip = clientIp(req as Parameters<typeof clientIp>[0]);
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) {
    return res.status(429).set("Retry-After", String(rl.retryAfter))
      .json({ ok: false, error: "Too many login attempts. Please wait before trying again." });
  }

  const { JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } = await getAdminConfig();

  if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(503).json({ ok: false, error: "Admin login not configured." });
  }

  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password || email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: "Invalid email or password" });
  }
  const token = jwt.sign({ isAdmin: true }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return res.json({ ok: true });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("admin_token");
  return res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const token = req.cookies?.admin_token;
  if (!token) return res.json({ isAdmin: false });
  const { JWT_SECRET } = await getAdminConfig();
  if (!JWT_SECRET) return res.json({ isAdmin: false });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
    return res.json({ isAdmin: Boolean(payload.isAdmin) });
  } catch {
    return res.json({ isAdmin: false });
  }
});

export default router;
