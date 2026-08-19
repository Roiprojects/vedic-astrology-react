import { Router } from "express";
import { query } from "../../lib/db";
import { serviceSchema } from "../../lib/admin/service-schema";

const router = Router();

// Add image column if it doesn't exist yet
query("ALTER TABLE services ADD COLUMN IF NOT EXISTS image TEXT").catch(() => {});


router.get("/", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM services ORDER BY display_order ASC, title ASC");
    res.json({ services: rows });
  } catch (e) {
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM services WHERE slug = $1", [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ service: rows[0] });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const s = parsed.data;
  try {
    await query(
      `INSERT INTO services (slug,title,category_slug,icon,image,short_description,full_description,problem,price,discount_price,duration,gradient,analysis,receive,benefits,remedies,faqs,featured,display_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)`,
      [s.slug,s.title,s.categorySlug||'astrology-consultations',s.icon,s.image??null,s.shortDescription,s.fullDescription,
       s.problem,s.price,s.discountPrice??null,s.duration,s.gradient,
       JSON.stringify(s.analysis),JSON.stringify(s.receive),JSON.stringify(s.benefits),
       JSON.stringify(s.remedies),JSON.stringify(s.faqs),s.featured,s.order,s.active]
    );
    res.json({ ok: true, slug: s.slug });
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: `Slug "${s.slug}" already exists.` });
    res.status(500).json({ error: "DB error" });
  }
});

router.put("/:slug", async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const s = parsed.data;
  const { slug } = req.params;
  try {
    const { rowCount } = await query(
      `UPDATE services SET slug=$1,title=$2,category_slug=$3,icon=$4,image=$5,short_description=$6,full_description=$7,
       problem=$8,price=$9,discount_price=$10,duration=$11,gradient=$12,analysis=$13,receive=$14,benefits=$15,
       remedies=$16,faqs=$17,featured=$18,display_order=$19,active=$20,updated_at=now() WHERE slug=$21`,
      [s.slug,s.title,s.categorySlug||'astrology-consultations',s.icon,s.image??null,s.shortDescription,s.fullDescription,
       s.problem,s.price,s.discountPrice??null,s.duration,s.gradient,
       JSON.stringify(s.analysis),JSON.stringify(s.receive),JSON.stringify(s.benefits),
       JSON.stringify(s.remedies),JSON.stringify(s.faqs),s.featured,s.order,s.active,slug]
    );
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, slug: s.slug });
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: `Slug "${s.slug}" already exists.` });
    res.status(500).json({ error: "DB error" });
  }
});

router.delete("/:slug", async (req, res) => {
  try {
    const { rowCount } = await query("DELETE FROM services WHERE slug = $1", [req.params.slug]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
