import { Router } from "express";
import { query } from "../../lib/db";
import { z } from "zod";

const router = Router();

const astrologerSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  title: z.string().default(""),
  image: z.string().nullable().optional(),
  verified: z.boolean().default(false),
  online: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(4.5),
  reviews: z.number().int().min(0).default(0),
  experienceYears: z.number().int().min(0).default(0),
  languages: z.array(z.string()).default([]),
  specialties: z.array(z.string()).default([]),
  priceChat: z.number().int().min(0).default(0),
  priceCall: z.number().int().min(0).default(0),
  about: z.string().default(""),
  serviceSlug: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  active: z.boolean().default(true),
});

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM astrologers ORDER BY display_order ASC, name ASC");
    res.json({ astrologers: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { rows } = await query("SELECT * FROM astrologers WHERE slug = $1", [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    res.json({ astrologer: rows[0] });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = astrologerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const a = parsed.data;
  try {
    const { rows } = await query(
      `INSERT INTO astrologers
         (slug,name,title,image,verified,online,rating,reviews,experience_years,languages,specialties,
          price_chat,price_call,about,service_slug,featured,display_order,active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING *`,
      [a.slug, a.name, a.title, a.image ?? null, a.verified, a.online, a.rating, a.reviews,
       a.experienceYears, JSON.stringify(a.languages), JSON.stringify(a.specialties),
       a.priceChat, a.priceCall, a.about, a.serviceSlug ?? null, a.featured, a.order, a.active]
    );
    res.json({ ok: true, astrologer: rows[0] });
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: `Slug "${a.slug}" already exists.` });
    res.status(500).json({ error: "DB error" });
  }
});

router.put("/:slug", async (req, res) => {
  const parsed = astrologerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten() });
  const a = parsed.data;
  try {
    const { rowCount } = await query(
      `UPDATE astrologers SET
         slug=$1,name=$2,title=$3,image=$4,verified=$5,online=$6,rating=$7,reviews=$8,
         experience_years=$9,languages=$10,specialties=$11,price_chat=$12,price_call=$13,
         about=$14,service_slug=$15,featured=$16,display_order=$17,active=$18,updated_at=NOW()
       WHERE slug=$19`,
      [a.slug, a.name, a.title, a.image ?? null, a.verified, a.online, a.rating, a.reviews,
       a.experienceYears, JSON.stringify(a.languages), JSON.stringify(a.specialties),
       a.priceChat, a.priceCall, a.about, a.serviceSlug ?? null, a.featured, a.order, a.active,
       req.params.slug]
    );
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (e: any) {
    if (e.code === "23505") return res.status(409).json({ error: `Slug "${a.slug}" already exists.` });
    res.status(500).json({ error: "DB error" });
  }
});

// Seed from static file — only inserts if table is empty
router.post("/seed", async (_req, res) => {
  const { rowCount } = await query("SELECT 1 FROM astrologers LIMIT 1").catch(() => ({ rowCount: 0 }));
  if (rowCount && rowCount > 0) return res.json({ ok: true, message: "Already seeded" });

  const seed = [
    { slug:"guruji", name:"Guruji", title:"Founder • Vedic Master", image:"/images/rishi-guruji.svg", verified:true, online:true, rating:4.9, reviews:1280, experienceYears:25, languages:["English","Kannada","Hindi","Telugu"], specialties:["Vedic Astrology","Marriage","Career","Relationship"], priceChat:2000, priceCall:2500, about:"Authentic Vedic guidance grounded in classical Jyotisha.", serviceSlug:"janna-jataka-comprehensive-birth-chart", featured:true, order:0, active:true },
    { slug:"vedic-relationship", name:"Acharya Meera", title:"Relationship & Compatibility", image:"/images/rishi-guruji.svg", verified:true, online:true, rating:4.8, reviews:640, experienceYears:14, languages:["English","Hindi"], specialties:["Relationship","Marriage","Vedic Astrology"], priceChat:1800, priceCall:2200, about:"Specialises in Venus, 7th house, guna matching, and restoring harmony.", serviceSlug:"love-relationship-problems", featured:false, order:1, active:true },
    { slug:"career-guide", name:"Pandit Arjun Rao", title:"Career & Dasha Timing", image:"/images/rishi-guruji.svg", verified:true, online:false, rating:4.7, reviews:410, experienceYears:18, languages:["English","Kannada","Tamil"], specialties:["Career","Finance","Vedic Astrology"], priceChat:1600, priceCall:2100, about:"Focuses on 10th-house strength, Saturn transits, and timing for job change.", serviceSlug:"career-confusion-job-problems", featured:false, order:2, active:true },
    { slug:"palm-vastu", name:"Smt. Lakshmi Sharma", title:"Palmistry & Vastu", image:"/images/rishi-guruji.svg", verified:true, online:true, rating:4.6, reviews:290, experienceYears:12, languages:["English","Hindi","Marathi"], specialties:["Palmistry","Vastu","Numerology"], priceChat:1200, priceCall:1600, about:"Reads the five major lines and mounts, then aligns home directions with planetary remedies.", serviceSlug:null, featured:false, order:3, active:true },
    { slug:"kp-timing", name:"Prof. Nikhil Iyer", title:"KP Astrology & Muhurat", image:"/images/rishi-guruji.svg", verified:true, online:true, rating:4.8, reviews:355, experienceYears:16, languages:["English","Malayalam"], specialties:["KP Astrology","Career","Finance"], priceChat:1900, priceCall:2400, about:"Uses Krishnamurti Paddhati sub-lords for precise event timing and muhurat.", serviceSlug:"janna-jataka-comprehensive-birth-chart", featured:false, order:4, active:true },
  ];

  try {
    for (const a of seed) {
      await query(
        `INSERT INTO astrologers (slug,name,title,image,verified,online,rating,reviews,experience_years,languages,specialties,price_chat,price_call,about,service_slug,featured,display_order,active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) ON CONFLICT (slug) DO NOTHING`,
        [a.slug,a.name,a.title,a.image,a.verified,a.online,a.rating,a.reviews,a.experienceYears,JSON.stringify(a.languages),JSON.stringify(a.specialties),a.priceChat,a.priceCall,a.about,a.serviceSlug,a.featured,a.order,a.active]
      );
    }
    res.json({ ok: true, message: `Seeded ${seed.length} astrologers` });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:slug", async (req, res) => {
  try {
    const { rowCount } = await query("DELETE FROM astrologers WHERE slug = $1", [req.params.slug]);
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
