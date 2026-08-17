import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("[adminAuth] FATAL: JWT_SECRET env var is not set. All admin routes will be inaccessible.");
}

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
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
