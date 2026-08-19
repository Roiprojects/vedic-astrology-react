import { Router } from "express";
import { query } from "../../lib/db";

const router = Router();

// Ensure table exists
query(`
  CREATE TABLE IF NOT EXISTS astrologers (
    id              SERIAL PRIMARY KEY,
    slug            TEXT UNIQUE NOT NULL,
    name            TEXT NOT NULL,
    title           TEXT NOT NULL DEFAULT '',
    image           TEXT,
    verified        BOOLEAN NOT NULL DEFAULT false,
    online          BOOLEAN NOT NULL DEFAULT false,
    rating          NUMERIC(3,1) NOT NULL DEFAULT 4.5,
    reviews         INTEGER NOT NULL DEFAULT 0,
    experience_years INTEGER NOT NULL DEFAULT 0,
    languages       JSONB NOT NULL DEFAULT '[]',
    specialties     JSONB NOT NULL DEFAULT '[]',
    price_chat      INTEGER NOT NULL DEFAULT 0,
    price_call      INTEGER NOT NULL DEFAULT 0,
    about           TEXT NOT NULL DEFAULT '',
    service_slug    TEXT,
    featured        BOOLEAN NOT NULL DEFAULT false,
    display_order   INTEGER NOT NULL DEFAULT 0,
    active          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
  )
`).catch((e) => console.error("[astrologers] ensureTable error:", e));

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM astrologers WHERE active = true ORDER BY display_order ASC, name ASC"
    );
    res.json({ astrologers: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM astrologers WHERE slug = $1 AND active = true",
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ astrologer: rows[0] });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
