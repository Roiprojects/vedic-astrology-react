import { Router } from "express";
import { query } from "../../lib/db";

const router = Router();

router.get("/", async (req, res) => {
  const status = req.query.status as string | undefined;
  try {
    const { rows } = status
      ? await query("SELECT * FROM enquiries WHERE status=$1 ORDER BY created_at DESC LIMIT 200", [status])
      : await query("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200");
    res.json({ enquiries: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

router.put("/:id/status", async (req, res) => {
  const { status } = req.body as { status?: string };
  if (!status) return res.status(400).json({ error: "status required" });
  try {
    const { rowCount } = await query(
      "UPDATE enquiries SET status=$1, updated_at=now() WHERE id=$2",
      [status, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
