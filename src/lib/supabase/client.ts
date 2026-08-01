import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (anon key). Used in client components.
 * Safe to import; only fails if invoked without env.
 */
export function createSupabaseBrowserClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
  return createBrowserClient(url, key);
}
