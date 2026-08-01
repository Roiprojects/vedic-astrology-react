/**
 * Admin Pages routes — Express port of app/api/admin/pages/[page]/route.ts
 *
 * Handles page content for informational pages (birth-chart-pdf, chat-with-guruji, palm-reading).
 * All routes protected by adminAuthMiddleware.
 */
import { Router } from "express";
import { isPageId, readPageContent, writePageContent } from "$lib/data/pages-store";
import { pageContentSchema } from "$lib/admin/page-content-schema";
const router = Router();
/** GET /api/admin/pages/:page — read page content */
router.get("/:page", async (req, res) => {
    const { page } = req.params;
    if (!isPageId(page)) {
        return res.status(404).json({ error: "Unknown page." });
    }
    try {
        const content = await readPageContent(page);
        return res.json({ page, content });
    }
    catch (err) {
        console.error("[admin/pages] GET error", err);
        return res.status(500).json({ error: "Failed to read page content." });
    }
});
/** PUT /api/admin/pages/:page — update page content */
router.put("/:page", async (req, res) => {
    const { page } = req.params;
    if (!isPageId(page)) {
        return res.status(404).json({ error: "Unknown page." });
    }
    const body = await req.json().catch(() => null);
    const parsed = pageContentSchema.safeParse(body);
    if (!parsed.success) {
        return res.status(400).json({
            error: "Please fix the highlighted fields.",
            issues: parsed.error.flatten(),
        });
    }
    try {
        await writePageContent(page, {
            ...parsed.data,
            price: parsed.data.price ?? null,
        });
        return res.json({ ok: true });
    }
    catch (err) {
        console.error("[admin/pages] PUT error", err);
        return res.status(500).json({ error: "Failed to write page content." });
    }
});
export default router;
