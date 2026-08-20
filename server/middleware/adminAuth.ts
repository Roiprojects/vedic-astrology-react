import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { query } from "../lib/db";

async function getJwtSecret(): Promise<string | undefined> {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  try {
    const res = await query("SELECT value::text FROM settings WHERE key = 'jwt_secret'");
    const val = res.rows[0]?.value?.replace(/^"|"$/g, "");
    return val || undefined;
  } catch {
    return undefined;
  }
}

export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const JWT_SECRET = await getJwtSecret();
  if (!JWT_SECRET) return res.status(503).json({ error: "Admin auth not configured" });
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
    if (!payload.isAdmin) return res.status(403).json({ error: "Forbidden" });
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
