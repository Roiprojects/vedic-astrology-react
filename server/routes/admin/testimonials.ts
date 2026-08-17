import { Router } from "express";
import { query } from "../../lib/db";
import { z } from "zod";

const router = Router();

const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(100),
  location: z.string().trim().max(100).default(""),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  service_type: z.string().trim().default("all"),
  text: z.string().trim().min(1).max(2000),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).default(() => new Date().toISOString().slice(0,10)),
  avatar_initial: z.string().trim().max(2).default(""),
  featured: z.boolean().default(false),
  display_order: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM testimonials ORDER BY display_order ASC, date DESC");
    res.json({ testimonials: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = testimonialSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const t = parsed.data;
  try {
    const { rows } = await query(
      `INSERT INTO testimonials (name,location,rating,service_type,text,date,avatar_initial,featured,display_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [t.name,t.location,t.rating,t.service_type,t.text,t.date,t.avatar_initial||t.name[0]||'G',t.featured,t.display_order,t.active]
    );
    res.json({ ok: true, testimonial: rows[0] });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.put("/:id", async (req, res) => {
  const parsed = testimonialSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const t = parsed.data;
  try {
    const { rowCount } = await query(
      `UPDATE testimonials SET name=$1,location=$2,rating=$3,service_type=$4,text=$5,date=$6,
       avatar_initial=$7,featured=$8,display_order=$9,active=$10,updated_at=now() WHERE id=$11`,
      [t.name,t.location,t.rating,t.service_type,t.text,t.date,t.avatar_initial||t.name[0]||'G',t.featured,t.display_order,t.active,req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { rowCount } = await query("DELETE FROM testimonials WHERE id = $1", [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
