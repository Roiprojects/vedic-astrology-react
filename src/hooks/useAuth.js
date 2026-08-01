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
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
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
