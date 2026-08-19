// Admin Homams routes — PostgreSQL-backed
import { Router } from "express";
import { query } from "../../lib/db";
import { homamSchema } from "../../lib/admin/homam-schema";

const router = Router();

// Add image column if it doesn't exist yet
query("ALTER TABLE homams ADD COLUMN IF NOT EXISTS image TEXT").catch(() => {});


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
      `INSERT INTO homams (slug,name,icon,image,short_benefit,full_description,price,discount_price,duration,gradient,benefits,suitable_for,pooja_items,booking_instructions,faqs,featured,display_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [h.slug,h.name,h.icon,h.image??null,h.shortBenefit,h.fullDescription,h.price,h.discountPrice??null,
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
      `UPDATE homams SET slug=$1,name=$2,icon=$3,image=$4,short_benefit=$5,full_description=$6,price=$7,
       discount_price=$8,duration=$9,gradient=$10,benefits=$11,suitable_for=$12,pooja_items=$13,
       booking_instructions=$14,faqs=$15,featured=$16,display_order=$17,active=$18,updated_at=now()
       WHERE slug=$19`,
      [h.slug,h.name,h.icon,h.image??null,h.shortBenefit,h.fullDescription,h.price,h.discountPrice??null,
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
