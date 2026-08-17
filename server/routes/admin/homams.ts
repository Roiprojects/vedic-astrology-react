// Admin Homams routes — PostgreSQL-backed
import { Router } from "express";
import { query } from "../../lib/db";
import { homamSchema } from "../../lib/admin/homam-schema";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM homams ORDER BY display_order ASC, name ASC");
    res.json({ homams: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM homams WHERE slug = $1", [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ homam: rows[0] });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = homamSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const h = parsed.data;
  try {
    await query(
      `INSERT INTO homams (slug,name,icon,short_benefit,full_description,price,discount_price,duration,gradient,benefits,suitable_for,pooja_items,booking_instructions,faqs,featured,display_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
      [h.slug,h.name,h.icon,h.shortBenefit,h.fullDescription,h.price,h.discountPrice??null,
       h.duration,h.gradient,JSON.stringify(h.benefits),JSON.stringify(h.suitableFor),
       JSON.stringify(h.poojaItems),h.bookingInstructions,JSON.stringify(h.faqs),h.featured,h.order,h.active]
    );
    res.json({ ok: true, slug: h.slug });
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: `Slug "${h.slug}" already exists.` });
    res.status(500).json({ error: "DB error" });
  }
});

router.put("/:slug", async (req, res) => {
  const parsed = homamSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const h = parsed.data;
  const { slug } = req.params;
  try {
    const { rowCount } = await query(
      `UPDATE homams SET slug=$1,name=$2,icon=$3,short_benefit=$4,full_description=$5,price=$6,
       discount_price=$7,duration=$8,gradient=$9,benefits=$10,suitable_for=$11,pooja_items=$12,
       booking_instructions=$13,faqs=$14,featured=$15,display_order=$16,active=$17,updated_at=now()
       WHERE slug=$18`,
      [h.slug,h.name,h.icon,h.shortBenefit,h.fullDescription,h.price,h.discountPrice??null,
       h.duration,h.gradient,JSON.stringify(h.benefits),JSON.stringify(h.suitableFor),
       JSON.stringify(h.poojaItems),h.bookingInstructions,JSON.stringify(h.faqs),h.featured,h.order,h.active,slug]
    );
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, slug: h.slug });
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: `Slug "${h.slug}" already exists.` });
    res.status(500).json({ error: "DB error" });
  }
});

router.delete("/:slug", async (req, res) => {
  try {
    const { rowCount } = await query("DELETE FROM homams WHERE slug = $1", [req.params.slug]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
