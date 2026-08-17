import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "../../lib/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "..", "..", "public", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded or invalid type" });
  const url = `/uploads/${req.file.filename}`;
  try {
    const { rows } = await query(
      `INSERT INTO media_library (filename, original_name, mime_type, size_bytes, url, alt_text)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [req.file.filename, req.file.originalname, req.file.mimetype, req.file.size, url, req.body.alt_text || ""]
    );
    res.json({ ok: true, url, file: rows[0] });
  } catch {
    res.json({ ok: true, url });
  }
});

router.get("/", async (_req, res) => {
  try {
    const { rows } = await query("SELECT * FROM media_library ORDER BY created_at DESC LIMIT 100");
    res.json({ files: rows });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
