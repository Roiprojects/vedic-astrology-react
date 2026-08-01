import { useState, useEffect, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export function useAuth() {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            setLoading(false);
            return;
        }
        const supabase = createSupabaseBrowserClient();
        async function refreshAdminState(session) {
            setSession(session);
            setUser(session?.user ?? null);
            if (!session) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }
            const { data: admin } = await supabase.rpc("is_admin");
            setIsAdmin(Boolean(admin));
            setLoading(false);
        }
        supabase.auth.getSession().then(({ data }) => {
            void refreshAdminState(data.session);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            void refreshAdminState(session);
        });
        return () => subscription.unsubscribe();
    }, []);
    const signIn = useCallback(async (email, password) => {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error)
            throw error;
        return data;
    }, []);
    const signOut = useCallback(async () => {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
    }, []);
    return { session, user, isAdmin, loading, signIn, signOut };
}
