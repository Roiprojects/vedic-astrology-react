const functionBase = (() => {
    const explicit = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL;
    if (explicit)
        return explicit.replace(/\/$/, "");
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl.replace(/\/$/, "")}/functions/v1` : "";
})();
function shouldUseSupabaseFunctions() {
    if (import.meta.env.VITE_API_MODE === "local")
        return false;
    if (import.meta.env.VITE_API_MODE === "supabase")
        return true;
    return Boolean(import.meta.env.PROD && functionBase && import.meta.env.VITE_SUPABASE_ANON_KEY);
}
function toFunctionUrl(path) {
    const name = path.replace(/^\/api\//, "").split("/")[0];
    return `${functionBase}/${name}`;
}
export function apiFetch(path, init = {}) {
    if (!shouldUseSupabaseFunctions() || !path.startsWith("/api/")) {
        return fetch(path, init);
    }
    const headers = new Headers(init.headers);
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (anonKey) {
        headers.set("Authorization", `Bearer ${anonKey}`);
        headers.set("apikey", anonKey);
    }
    return fetch(toFunctionUrl(path), { ...init, headers });
}
