import { Router } from "express";
import { query } from "../../lib/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM homams WHERE active = true ORDER BY display_order ASC"
    );
    res.json({ homams: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/featured", async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  try {
    const { rows } = await query(
      "SELECT * FROM homams WHERE active = true AND featured = true ORDER BY display_order ASC LIMIT $1",
      [limit]
    );
    res.json({ homams: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM homams WHERE slug = $1 AND active = true",
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ homam: rows[0] });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
