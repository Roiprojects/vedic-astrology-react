import { createServerClient } from "@supabase/ssr";

/**
 * Server Supabase client (anon key, cookie-aware) for route handlers.
 * Accepts a request object to read cookies from the incoming HTTP request.
 */
export async function createSupabaseServerClient(request: Request) {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }

  const cookieHeader = request.headers.get("cookie") || "";

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieHeader
          .split(";")
          .map((c) => {
            const [name, ...rest] = c.trim().split("=");
            return { name, value: rest.join("=") };
          })
          .filter((c) => c.name);
      },
      setAll() {
        // No-op in Vite context — cookie setting is handled by the server handler
      },
    },
  });
}

/**
 * Service-role client (server-only). Bypasses RLS — use ONLY in trusted
 * server code (e.g. admin actions, webhooks). Never expose to the browser.
 */
export function createSupabaseAdminClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createServerClient(url, serviceKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
