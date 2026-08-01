/**
 * Admin Homams routes — Express port of:
 *  app/api/admin/homams/route.ts  (GET list, POST create)
 *  app/api/admin/homams/[slug]/route.ts  (PUT update, DELETE)
 */

import { Router, Request, Response } from "express";
import { readHomamsRaw, writeHomamsRaw } from "../../lib/data/homams-store";
import { homamSchema } from "../../lib/admin/homam-schema";

const router = Router();

/** GET /api/admin/homams — list all homams (admin view). */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const homams = await readHomamsRaw();
    return res.json({ homams });
  } catch (err) {
    console.error("[admin/homams] GET error", err);
    return res.status(500).json({ error: "Failed to read homams." });
  }
});

/** POST /api/admin/homams — create a new homam. */
router.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const parsed = homamSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Please fix the highlighted fields.",
      issues: parsed.error.flatten(),
    });
  }

  const homams = await readHomamsRaw();
  if (homams.some((h) => h.slug === parsed.data.slug)) {
    return res.status(409).json({ error: `A homam with the slug "${parsed.data.slug}" already exists.` });
  }

  const next = [...homams, parsed.data];
  await writeHomamsRaw(next);
  res.json({ ok: true, slug: parsed.data.slug });
});

/** PUT /api/admin/homams/:slug — update an existing homam. */
router.put("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const body = req.body;
  const parsed = homamSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Please fix the highlighted fields.",
      issues: parsed.error.flatten(),
    });
  }

  const homams = await readHomamsRaw();
  const index = homams.findIndex((h) => h.slug === slug);
  if (index === -1) {
    return res.status(404).json({ error: "Homam not found." });
  }

  const nextSlug = parsed.data.slug;
  if (nextSlug !== slug && homams.some((h) => h.slug === nextSlug)) {
    return res.status(409).json({ error: `Another homam already uses the slug "${nextSlug}".` });
  }

  const next = [...homams];
  next[index] = parsed.data;
  await writeHomamsRaw(next);
  res.json({ ok: true, slug: nextSlug });
});

/** DELETE /api/admin/homams/:slug — delete a homam. */
router.delete("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const homams = await readHomamsRaw();
  const next = homams.filter((h) => h.slug !== slug);
  if (next.length === homams.length) {
    return res.status(404).json({ error: "Homam not found." });
  }
  await writeHomamsRaw(next);
  res.json({ ok: true });
});

export default router;
