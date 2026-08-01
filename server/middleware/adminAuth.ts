/**
 * Admin authentication middleware for Express.
 *
 * Verifies the user's Supabase session from the `sb-*-auth-token` cookie
 * and checks the `is_admin` RPC. Attaches `req.user` on success.
 */

import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseUrl(): string {
  const url = SUPABASE_URL;
  if (!url) {
    throw new Error("SUPABASE_URL, VITE_SUPABASE_URL, or NEXT_PUBLIC_SUPABASE_URL must be set");
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = SUPABASE_ANON_KEY;
  if (!key) {
    throw new Error("SUPABASE_ANON_KEY, VITE_SUPABASE_ANON_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  }
  return key;
}

function createAnonSupabase() {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false },
  });
}

function createServiceSupabase() {
  return createClient(getSupabaseUrl(), SUPABASE_SERVICE_KEY!, {
    auth: { persistSession: false },
  });
}

/**
 * Extract the access token from the Supabase auth-token cookie.
 * The cookie value is a JSON string: `{"access_token":"...","refresh_token":"...","expires_at":...}`.
 */
function getAccessToken(req: Request): string | null {
  const cookieHeader = req.headers.cookie || "";
  const cookies = cookie.parse(cookieHeader);
  const authTokenCookie = Object.keys(cookies).find((k) => k.endsWith("-auth-token"));
  if (!authTokenCookie) return null;

  try {
    const parsed = JSON.parse(cookies[authTokenCookie] || "{}");
    return typeof parsed.access_token === "string" ? parsed.access_token : null;
  } catch {
    return null;
  }
}

export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const supabase = createAnonSupabase();

    // getUser() accepts an optional access_token — pass it directly
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.warn("[adminAuth] Invalid session:", error?.message);
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check admin status — use service-role client to bypass RLS if available
    let isAdmin: boolean;
    if (SUPABASE_SERVICE_KEY) {
      const adminSupabase = createServiceSupabase();
      const { data, error: rpcError } = await adminSupabase.rpc("is_admin");
      isAdmin = !rpcError && data === true;
    } else {
      const { data, error: rpcError } = await supabase.rpc("is_admin");
      isAdmin = !rpcError && data === true;
    }

    if (!isAdmin) {
      console.warn("[adminAuth] User is not admin:", user.email ?? user.id);
      return res.status(403).json({ error: "Forbidden — admin access required" });
    }

    (req as any).user = user;
    next();
  } catch (err) {
    console.error("[adminAuth] Unexpected error:", err);
    return res.status(503).json({ error: "Auth not configured" });
  }
}
