import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isNativePlatform } from "@/lib/platform";

let cached: SupabaseClient | null = null;

/**
 * Browser / Capacitor Supabase client (anon key only).
 * Service-role keys must never be used here.
 */
export function createSupabaseBrowserClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }
  if (cached) return cached;
  cached = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: !isNativePlatform(),
    },
  });
  return cached;
}
