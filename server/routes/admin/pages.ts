// Admin Pages routes — PostgreSQL-backed
import { Router } from "express";
import { query } from "../../lib/db";
import { isPageId } from "../../../src/lib/data/pages-store";
import { pageContentSchema } from "../../lib/admin/page-content-schema";

const router = Router();

router.get("/:page", async (req, res) => {
  const { page } = req.params;
  if (!isPageId(page)) return res.status(404).json({ error: "Unknown page." });
  try {
    const { rows } = await query("SELECT content FROM pages WHERE slug = $1", [page]);
    res.json({ page, content: rows[0]?.content ?? {} });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.put("/:page", async (req, res) => {
  const { page } = req.params;
  if (!isPageId(page)) return res.status(404).json({ error: "Unknown page." });
  const parsed = pageContentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const content = { ...parsed.data, price: parsed.data.price ?? null };
  try {
    await query(
      `INSERT INTO pages (slug, title, content, active) VALUES ($1,$2,$3,true)
       ON CONFLICT (slug) DO UPDATE SET title=$2, content=$3, updated_at=now()`,
      [page, content.title ?? page, JSON.stringify(content)]
    );
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
