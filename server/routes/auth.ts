import { Router } from "express";
import jwt from "jsonwebtoken";
import { rateLimit, clientIp } from "../lib/ratelimit";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("[auth] FATAL: JWT_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in environment variables. Admin login is disabled.");
}

router.post("/login", (req, res) => {
  // 5 attempts per 15 minutes per IP
  const ip = clientIp(req as Parameters<typeof clientIp>[0]);
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60_000);
  if (!rl.ok) {
    return res
      .status(429)
      .set("Retry-After", String(rl.retryAfter))
      .json({ ok: false, error: "Too many login attempts. Please wait before trying again." });
  }

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

router.get("/me", (req, res) => {
  const token = req.cookies?.admin_token;
  if (!token || !JWT_SECRET) return res.json({ isAdmin: false });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
    return res.json({ isAdmin: Boolean(payload.isAdmin) });
  } catch {
    return res.json({ isAdmin: false });
  }
});

export default router;
