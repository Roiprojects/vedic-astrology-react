import { Capacitor } from "@capacitor/core";

const functionBase = (() => {
  const explicit = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return supabaseUrl ? `${supabaseUrl.replace(/\/$/, "")}/functions/v1` : "";
})();

function shouldUseSupabaseFunctions() {
  if (import.meta.env.VITE_API_MODE === "local") return false;
  if (import.meta.env.VITE_API_MODE === "supabase") return true;
  return Boolean(import.meta.env.PROD && functionBase && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

function toFunctionUrl(path: string) {
  const name = path.replace(/^\/api\//, "").split("/")[0];
  return `${functionBase}/${name}`;
}

export function apiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (Capacitor.isNativePlatform()) {
    return (import.meta.env.VITE_SITE_URL || "").replace(/\/$/, "");
  }
  return "";
}

export function resolveApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (shouldUseSupabaseFunctions() && path.startsWith("/api/")) return toFunctionUrl(path);
  return `${apiBaseUrl()}${path}`;
}

function visitorId(): string {
  const key = "vedic_ai_visitor";
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  } catch {
    return "anonymous";
  }
}

export function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("X-Visitor-Id", visitorId());
  if (shouldUseSupabaseFunctions() && path.startsWith("/api/")) {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (anonKey) {
      headers.set("Authorization", `Bearer ${anonKey}`);
      headers.set("apikey", anonKey);
    }
  }
  return fetch(resolveApiUrl(path), {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
}
