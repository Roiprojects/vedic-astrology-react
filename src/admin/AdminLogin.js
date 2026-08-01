import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { siteConfig } from "@/lib/site";
export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    async function onSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const supabase = createSupabaseBrowserClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });
            if (signInError) {
                setError(signInError.message);
                return;
            }
            const { data: isAdmin } = await supabase.rpc("is_admin");
            if (!isAdmin) {
                await supabase.auth.signOut();
                setError("This account does not have admin access.");
                return;
            }
            navigate("/admin/services");
        }
        catch {
            setError("Something went wrong. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "grid min-h-screen place-items-center px-6", children: [_jsx(Helmet, { children: _jsxs("title", { children: ["Admin Login \u2014 ", siteConfig.name] }) }), _jsxs("div", { className: "w-full max-w-sm", children: [_jsxs("div", { className: "mb-8 flex flex-col items-center text-center", children: [_jsx(BrandLogo, { href: null, showText: false, size: 64 }), _jsx("h1", { className: "mt-5 font-serif text-2xl text-ink", children: "Admin Panel" }), _jsx("p", { className: "mt-1 text-sm text-muted", children: "Sign in to manage services" })] }), _jsxs("form", { onSubmit: onSubmit, className: "rounded-3xl border border-gold/25 bg-surface/70 p-6 sm:p-8", children: [_jsx("label", { htmlFor: "email", className: "mb-1.5 block text-sm font-medium text-ink", children: "Email" }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" }), _jsx("input", { id: "email", type: "email", autoFocus: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full rounded-xl border border-gold/30 bg-overlay px-10 py-2.5 text-sm text-ink outline-none focus:border-gold/70", placeholder: "you@example.com" })] }), _jsx("label", { htmlFor: "password", className: "mb-1.5 block text-sm font-medium text-ink", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" }), _jsx("input", { id: "password", type: "password", autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full rounded-xl border border-gold/30 bg-overlay px-10 py-2.5 text-sm text-ink outline-none focus:border-gold/70", placeholder: "Enter your password" })] }), error && _jsx("p", { className: "mt-3 text-sm text-danger", children: error }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", className: "mt-6 w-full", disabled: loading, children: loading ? "Signing in…" : "Sign In" })] })] })] }));
}
