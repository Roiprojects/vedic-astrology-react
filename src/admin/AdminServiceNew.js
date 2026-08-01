import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { getAdminServices } from "@/lib/supabase/admin-data";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site";
export default function AdminServiceNewPage() {
    const [loading, setLoading] = useState(true);
    const [nextOrder, setNextOrder] = useState(1);
    useEffect(() => {
        getAdminServices()
            .then((data) => setNextOrder(data.reduce((max, s) => Math.max(max, s.order), 0) + 1))
            .finally(() => setLoading(false));
    }, []);
    const blank = {
        slug: "",
        title: "",
        categorySlug: "astrology-consultations",
        icon: "🔮",
        shortDescription: "",
        fullDescription: "",
        problem: "",
        price: 0,
        discountPrice: null,
        duration: "20–30 min consultation",
        gradient: "from-amber-500/30 to-orange-600/30",
        analysis: [],
        receive: [],
        benefits: [],
        remedies: [],
        faqs: [],
        featured: false,
        order: nextOrder,
        active: true,
    };
    return (_jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx(Helmet, { children: _jsxs("title", { children: ["New Service \u2014 Admin \u2014 ", siteConfig.name] }) }), loading ? (_jsx("p", { className: "text-muted", children: "Loading\u2026" })) : (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/admin/services", className: "inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to services"] }), _jsx("h1", { className: "mt-4 font-serif text-3xl text-ink", children: "New service" }), _jsx("p", { className: "mt-1 text-sm text-muted", children: "Add a new astrology service to the site." }), _jsx(ServiceForm, { mode: "create", initial: blank })] }))] }));
}
