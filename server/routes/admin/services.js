/**
 * Admin Services routes — Express port of:
 *  app/api/admin/services/route.ts  (GET list, POST create)
 *  app/api/admin/services/[slug]/route.ts  (PUT update, DELETE)
 */
import { Router } from "express";
import { readServicesRaw, writeServicesRaw } from "$lib/data/services-store";
import { serviceSchema } from "$lib/admin/service-schema";
const router = Router();
router.get("/", async (_req, res) => {
    try {
        const services = await readServicesRaw();
        res.json({ services });
    }
    catch (err) {
        console.error("[admin/services] GET error", err);
        res.status(500).json({ error: "Failed to read services." });
    }
});
router.post("/", async (req, res) => {
    const body = await req.json().catch(() => null);
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Please fix the highlighted fields.",
            issues: parsed.error.flatten(),
        });
    }
    const services = await readServicesRaw();
    if (services.some((s) => s.slug === parsed.data.slug)) {
        return res.status(409).json({ error: `A service with the slug "${parsed.data.slug}" already exists.` });
    }
    const next = [...services, parsed.data];
    await writeServicesRaw(next);
    res.json({ ok: true, slug: parsed.data.slug });
});
router.put("/:slug", async (req, res) => {
    const { slug } = req.params;
    const body = await req.json().catch(() => null);
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Please fix the highlighted fields.",
            issues: parsed.error.flatten(),
        });
    }
    const services = await readServicesRaw();
    const index = services.findIndex((s) => s.slug === slug);
    if (index === -1) {
        return res.status(404).json({ error: "Service not found." });
    }
    const nextSlug = parsed.data.slug;
    if (nextSlug !== slug && services.some((s) => s.slug === nextSlug)) {
        return res.status(409).json({ error: `Another service already uses the slug "${nextSlug}".` });
    }
    const next = [...services];
    next[index] = parsed.data;
    await writeServicesRaw(next);
    res.json({ ok: true, slug: nextSlug });
});
router.delete("/:slug", async (req, res) => {
    const { slug } = req.params;
    const services = await readServicesRaw();
    const next = services.filter((s) => s.slug !== slug);
    if (next.length === services.length) {
        return res.status(404).json({ error: "Service not found." });
    }
    await writeServicesRaw(next);
    res.json({ ok: true });
});
export default router;
