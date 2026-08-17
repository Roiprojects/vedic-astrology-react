import { Router } from "express";
import { query } from "../../lib/db";
import { serviceSchema } from "../../lib/admin/service-schema";

const router = Router();

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
      `INSERT INTO services (slug,title,category_slug,icon,short_description,full_description,problem,price,discount_price,duration,gradient,analysis,receive,benefits,remedies,faqs,featured,display_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)`,
      [s.slug,s.title,s.categorySlug||'astrology-consultations',s.icon,s.shortDescription,s.fullDescription,
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
      `UPDATE services SET slug=$1,title=$2,category_slug=$3,icon=$4,short_description=$5,full_description=$6,
       problem=$7,price=$8,discount_price=$9,duration=$10,gradient=$11,analysis=$12,receive=$13,benefits=$14,
       remedies=$15,faqs=$16,featured=$17,display_order=$18,active=$19,updated_at=now() WHERE slug=$20`,
      [s.slug,s.title,s.categorySlug||'astrology-consultations',s.icon,s.shortDescription,s.fullDescription,
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
