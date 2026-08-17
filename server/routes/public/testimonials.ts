import { Router } from "express";
import { query } from "../../lib/db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM testimonials WHERE active = true ORDER BY date DESC, display_order ASC"
    );
    res.json({ testimonials: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/featured", async (req, res) => {
  const limit = Number(req.query.limit) || 6;
  try {
    const { rows } = await query(
      "SELECT * FROM testimonials WHERE active = true AND featured = true ORDER BY display_order ASC LIMIT $1",
      [limit]
    );
    res.json({ testimonials: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
