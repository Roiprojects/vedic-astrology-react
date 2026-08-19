/**
 * Subscription routes — Razorpay recurring plans.
 *
 * GET  /api/subscriptions/plans        — list available plans
 * POST /api/subscriptions/create       — create a Razorpay subscription
 * GET  /api/subscriptions/status       — get user's active subscription
 * POST /api/subscriptions/webhook      — handle Razorpay subscription events
 */

import { Router, Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import { query } from "../lib/db";
import { getUserFromToken } from "./user";
import { rateLimit, clientIp } from "../lib/ratelimit";

const router = Router();

const KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

function getRazorpay() {
  if (!KEY_ID || !KEY_SECRET) throw new Error("Razorpay keys not configured");
  return new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
}

// ─── Subscription plans (Razorpay plan_id must be created in Razorpay dashboard
//     or via API first — these are the human-readable definitions) ─────────────

export const PLANS = [
  {
    id: "free",
    name: "Nakshatra Starter",
    price: 0,
    currency: "INR",
    interval: null,
    features: [
      "3 AI chat questions/session",
      "Birth chart overview",
      "Basic nakshatra & rashi",
      "App access",
    ],
    badge: null,
  },
  {
    id: "star",
    name: "Jyotish Star",
    price: 499,
    currency: "INR",
    interval: "monthly",
    razorpayPlanEnvKey: "RAZORPAY_PLAN_STAR",
    features: [
      "Unlimited AI chat",
      "1 consultation/month",
      "Detailed birth chart",
      "Dosha analysis report",
      "Gemstone recommendations",
      "Priority email support",
    ],
    badge: "Popular",
  },
  {
    id: "cosmic",
    name: "Cosmic Divine",
    price: 1499,
    currency: "INR",
    interval: "monthly",
    razorpayPlanEnvKey: "RAZORPAY_PLAN_COSMIC",
    features: [
      "Everything in Jyotish Star",
      "3 consultations/month",
      "Monthly PDF astrology report",
      "Homam booking priority",
      "Muhurta (auspicious timing)",
      "Dedicated Guruji WhatsApp",
    ],
    badge: "Best Value",
  },
];

// ─── Ensure table ─────────────────────────────────────────────────────────────

async function ensureSubscriptionsTable() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id                  SERIAL PRIMARY KEY,
        user_id             INTEGER REFERENCES app_users(id) ON DELETE CASCADE,
        plan_id             TEXT NOT NULL,
        razorpay_sub_id     TEXT,
        razorpay_plan_id    TEXT,
        status              TEXT DEFAULT 'created',
        current_start       TIMESTAMPTZ,
        current_end         TIMESTAMPTZ,
        created_at          TIMESTAMPTZ DEFAULT NOW(),
        updated_at          TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } catch (e) {
    console.error("[subscriptions] ensureTable error:", e);
  }
}
ensureSubscriptionsTable();

// ─── Routes ───────────────────────────────────────────────────────────────────

/** GET /api/subscriptions/plans */
router.get("/plans", (_req: Request, res: Response) => {
  return res.json({
    ok: true,
    plans: PLANS.map(({ razorpayPlanEnvKey: _, ...p }) => p),
  });
});

/** POST /api/subscriptions/create */
router.post("/create", async (req: Request, res: Response) => {
  const ip = clientIp(req as Parameters<typeof clientIp>[0]);
  const rl = rateLimit(`sub-create:${ip}`, 10, 60_000);
  if (!rl.ok) return res.status(429).json({ ok: false, error: "Too many requests." });

  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ ok: false, error: "Please sign in to subscribe." });

  const { planId } = req.body as { planId?: string };
  const plan = PLANS.find((p) => p.id === planId && p.price > 0);
  if (!plan) return res.status(400).json({ ok: false, error: "Invalid plan." });

  const razorpayPlanId = plan.razorpayPlanEnvKey ? process.env[plan.razorpayPlanEnvKey] : null;
  if (!razorpayPlanId) {
    return res.status(503).json({
      ok: false,
      error: `Razorpay plan not configured. Please set ${plan.razorpayPlanEnvKey} in environment variables.`,
    });
  }

  try {
    const instance = getRazorpay();
    // Fetch user email for Razorpay
    const userRow = await query(`SELECT email, name, phone FROM app_users WHERE id = $1`, [user.userId]);
    const u = userRow.rows[0] as { email: string; name: string | null; phone: string | null } | undefined;

    const sub = await instance.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: 12, // up to 12 billing cycles
      quantity: 1,
      customer_notify: 1,
      notify_info: u ? { notify_email: u.email, notify_phone: u.phone ?? undefined } : undefined,
      notes: { user_id: String(user.userId), plan_id: planId },
    } as Parameters<typeof instance.subscriptions.create>[0]);

    // Record in DB
    await query(
      `INSERT INTO user_subscriptions (user_id, plan_id, razorpay_sub_id, razorpay_plan_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'created', NOW(), NOW())`,
      [user.userId, planId, sub.id, razorpayPlanId]
    );

    return res.json({ ok: true, subscriptionId: sub.id, keyId: KEY_ID });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Subscription creation failed";
    console.error("[subscriptions/create]", msg);
    return res.status(500).json({ ok: false, error: msg });
  }
});

/** GET /api/subscriptions/status */
router.get("/status", async (req: Request, res: Response) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ ok: false, error: "Not authenticated." });
  try {
    const row = await query(
      `SELECT plan, plan_expires_at FROM app_users WHERE id = $1`,
      [user.userId]
    );
    const u = row.rows[0] as { plan: string; plan_expires_at: string | null } | undefined;
    const subRow = await query(
      `SELECT plan_id, status, current_start, current_end, razorpay_sub_id
       FROM user_subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [user.userId]
    );
    return res.json({
      ok: true,
      plan: u?.plan ?? "free",
      planExpiresAt: u?.plan_expires_at ?? null,
      subscription: subRow.rows[0] ?? null,
    });
  } catch (e) {
    console.error("[subscriptions/status] db error:", e);
    return res.status(500).json({ ok: false, error: "Failed to fetch subscription." });
  }
});

/** POST /api/subscriptions/webhook — Razorpay sends events here */
router.post("/webhook", async (req: Request, res: Response) => {
  const signature = req.headers["x-razorpay-signature"] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || KEY_SECRET;

  if (signature && webhookSecret) {
    const body = JSON.stringify(req.body);
    const expected = crypto.createHmac("sha256", webhookSecret).update(body).digest("hex");
    if (expected !== signature) {
      return res.status(400).json({ ok: false, error: "Invalid signature" });
    }
  }

  const event = req.body as {
    event: string;
    payload?: {
      subscription?: { entity?: { id: string; plan_id: string; status: string; current_start: number; current_end: number; notes?: { user_id?: string; plan_id?: string } } };
    };
  };

  const sub = event.payload?.subscription?.entity;
  if (!sub) return res.json({ ok: true });

  const userId = sub.notes?.user_id ? Number(sub.notes.user_id) : null;
  const planId = sub.notes?.plan_id ?? "star";

  const start = sub.current_start ? new Date(sub.current_start * 1000).toISOString() : null;
  const end = sub.current_end ? new Date(sub.current_end * 1000).toISOString() : null;

  try {
    // Update subscription record
    await query(
      `UPDATE user_subscriptions SET status = $1, current_start = $2, current_end = $3, updated_at = NOW()
       WHERE razorpay_sub_id = $4`,
      [sub.status, start, end, sub.id]
    );

    // Update user plan on activation / renewal
    if (userId && ["active", "authenticated"].includes(sub.status)) {
      await query(
        `UPDATE app_users SET plan = $1, plan_expires_at = $2, updated_at = NOW() WHERE id = $3`,
        [planId, end, userId]
      );
    }

    // Downgrade to free on cancellation / expiry
    if (userId && ["cancelled", "expired", "completed"].includes(sub.status)) {
      const planEnd = end ? new Date(end) : null;
      if (!planEnd || planEnd < new Date()) {
        await query(`UPDATE app_users SET plan = 'free', plan_expires_at = NULL, updated_at = NOW() WHERE id = $1`, [userId]);
      }
    }

    console.info("[subscriptions/webhook]", event.event, sub.id, sub.status);
    return res.json({ ok: true });
  } catch (e) {
    console.error("[subscriptions/webhook] db error:", e);
    return res.status(500).json({ ok: false });
  }
});

export default router;
