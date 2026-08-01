import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Pencil, Plus, Star } from "lucide-react";
import { getAdminServices } from "@/lib/supabase/admin-data";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site";
function formatPrice(price, discount) {
    if (discount != null && discount < price) {
        return `₹${discount.toLocaleString("en-IN")} (was ₹${price.toLocaleString("en-IN")})`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
}
export default function AdminServicesPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        getAdminServices()
            .then(setServices)
            .catch((err) => setError(err.message || "Could not load services."))
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("div", { children: [_jsx(Helmet, { children: _jsxs("title", { children: ["Services \u2014 Admin \u2014 ", siteConfig.name] }) }), _jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-serif text-3xl text-ink", children: "Services" }), _jsx("p", { className: "mt-1 text-sm text-muted", children: loading ? "…" : `${services.length} service${services.length === 1 ? "" : "s"} · edit any field, toggle visibility, or add a new one.` })] }), _jsxs(Link, { to: "/admin/services/new", className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron via-saffron-deep to-gold-deep px-5 py-2.5 text-sm font-medium text-[#1a0a04] shadow-[0_10px_30px_-10px_rgba(240,132,46,0.6)] transition-transform hover:-translate-y-0.5", children: [_jsx(Plus, { className: "h-4 w-4" }), "New Service"] })] }), _jsxs("div", { className: "mt-8 overflow-hidden rounded-3xl border border-gold/20 bg-surface/60", children: [error && _jsx("p", { className: "p-5 text-sm text-danger", children: error }), _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "border-b border-gold/20 bg-[#b67a1b]/[0.02] text-xs uppercase tracking-wide text-faint", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 font-medium", children: "Service" }), _jsx("th", { className: "hidden px-5 py-3 font-medium sm:table-cell", children: "Price" }), _jsx("th", { className: "hidden px-5 py-3 font-medium md:table-cell", children: "Order" }), _jsx("th", { className: "px-5 py-3 font-medium", children: "Status" }), _jsx("th", { className: "px-5 py-3 text-right font-medium", children: "Edit" })] }) }), _jsx("tbody", { children: services.map((s) => (_jsxs("tr", { className: "border-b border-gold/10 last:border-0 hover:bg-[#b67a1b]/[0.015]", children: [_jsx("td", { className: "px-5 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/20 bg-[#b67a1b]/[0.03] text-xl", children: s.icon }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1.5 font-medium text-ink", children: [_jsx("span", { className: "truncate", children: s.title }), s.featured && (_jsx(Star, { className: "h-3.5 w-3.5 shrink-0 fill-gold text-gold" }))] }), _jsxs("div", { className: "truncate text-xs text-faint", children: ["/", s.slug] })] })] }) }), _jsx("td", { className: "hidden px-5 py-4 text-muted sm:table-cell", children: formatPrice(s.price, s.discountPrice) }), _jsx("td", { className: "hidden px-5 py-4 text-muted md:table-cell", children: s.order }), _jsx("td", { className: "px-5 py-4", children: _jsx("span", { className: s.active
                                                    ? "inline-flex rounded-full bg-online/10 px-2.5 py-0.5 text-xs font-medium text-online ring-1 ring-online/30"
                                                    : "inline-flex rounded-full bg-[#b67a1b]/[0.04] px-2.5 py-0.5 text-xs font-medium text-faint ring-1 ring-gold/20", children: s.active ? "Live" : "Hidden" }) }), _jsx("td", { className: "px-5 py-4 text-right", children: _jsxs(Link, { to: `/admin/services/${s.slug}`, className: "inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-medium text-gold-light transition-colors hover:border-gold/70", children: [_jsx(Pencil, { className: "h-3.5 w-3.5" }), "Edit"] }) })] }, s.slug))) })] })] })] }));
}
