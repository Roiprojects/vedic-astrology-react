import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setIsAdmin(Boolean(d.isAdmin)))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Login failed");
    setIsAdmin(true);
  }, []);

  const signOut = useCallback(async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
  }, []);

  // Keep session/user aliases for backward compat with AdminLayout
  const session = isAdmin ? { user: { email: "admin" } } : null;

  return { session, user: session?.user ?? null, isAdmin, loading, signIn, signOut };
}
