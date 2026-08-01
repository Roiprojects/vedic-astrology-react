import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAdminHomam } from "@/lib/supabase/admin-data";
import { HomamForm } from "@/components/admin/HomamForm";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site";
export default function AdminHomamEditPage() {
    const { slug } = useParams();
    const homamSlug = slug ?? "";
    const [homam, setHomam] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            const data = await getAdminHomam(homamSlug);
            if (!cancelled)
                setHomam(data);
            if (!cancelled)
                setLoading(false);
        }
        load();
        return () => { cancelled = true; };
    }, [homamSlug]);
    if (loading) {
        return (_jsx("div", { className: "mx-auto max-w-3xl", children: _jsx("p", { className: "text-muted", children: "Loading\u2026" }) }));
    }
    if (!homam) {
        return (_jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx("p", { className: "text-muted", children: "Homam not found." }), _jsx(Link, { to: "/admin/homams", className: "text-gold-light underline", children: "Back to homams" })] }));
    }
    return (_jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx(Helmet, { children: _jsxs("title", { children: ["Edit \u00B7 ", homam.name, " \u2014 Admin \u2014 ", siteConfig.name] }) }), _jsxs(Link, { to: "/admin/homams", className: "inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to homams"] }), _jsx("h1", { className: "mt-4 font-serif text-3xl text-ink", children: "Edit homam" }), _jsxs("p", { className: "mt-1 text-sm text-muted", children: ["Editing ", _jsx("span", { className: "font-medium text-ink", children: homam.name })] }), _jsx(HomamForm, { mode: "edit", initial: homam })] }));
}
