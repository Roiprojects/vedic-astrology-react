import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { PAGE_CONFIG, allPageIds } from "@/lib/data";
import { getAdminHomams, getAdminServices } from "@/lib/supabase/admin-data";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site";
export default function AdminDashboard() {
    const [services, setServices] = useState([]);
    const [homams, setHomams] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        Promise.all([getAdminServices(), getAdminHomams()])
            .then(([nextServices, nextHomams]) => {
            setServices(nextServices);
            setHomams(nextHomams);
        })
            .finally(() => setLoading(false));
    }, []);
    const cards = [
        {
            href: "/admin/services",
            icon: "🔮",
            title: "Astrology Consultations",
            desc: loading ? "…" : `${services.length} services — full content, pricing, FAQs`,
        },
        {
            href: "/admin/homams",
            icon: "🔥",
            title: "Homam Bookings",
            desc: loading ? "…" : `${homams.length} homams — full content, pricing, FAQs`,
        },
        ...allPageIds().map((id) => ({
            href: `/admin/pages/${id}`,
            icon: id === "birth-chart-pdf" ? "📜" : id === "chat-with-guruji" ? "💬" : "✋",
            title: PAGE_CONFIG[id].label,
            desc: "Hero copy, content & FAQs",
        })),
    ];
    return (_jsxs("div", { children: [_jsx(Helmet, { children: _jsxs("title", { children: ["Dashboard \u2014 Admin \u2014 ", siteConfig.name] }) }), _jsx("h1", { className: "font-serif text-3xl text-ink", children: "Services Admin" }), _jsx("p", { className: "mt-1 text-sm text-muted", children: "Manage every section under the site's Services menu." }), _jsx("div", { className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: cards.map((c) => (_jsxs(Link, { to: c.href, className: "group relative flex flex-col rounded-3xl border border-gold/20 bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-glow-gold)]", children: [_jsx("span", { className: "grid h-12 w-12 place-items-center rounded-2xl border border-gold/20 bg-[#b67a1b]/[0.03] text-2xl", children: c.icon }), _jsx("h2", { className: "mt-4 font-serif text-xl text-ink", children: c.title }), _jsx("p", { className: "mt-1.5 flex-1 text-sm text-muted", children: c.desc }), _jsxs("span", { className: "mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-light", children: ["Manage", _jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })] })] }, c.href))) })] }));
}
