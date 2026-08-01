import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { getHomamsForAdmin } from "@/lib/data";
import { HomamForm } from "@/components/admin/HomamForm";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site";
export default function AdminHomamNewPage() {
    const [homams, setHomams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextOrder, setNextOrder] = useState(1);
    useEffect(() => {
        const data = getHomamsForAdmin();
        setHomams(data);
        setNextOrder(data.reduce((max, h) => Math.max(max, h.order), 0) + 1);
        setLoading(false);
    }, []);
    const blank = {
        slug: "",
        name: "",
        icon: "🔥",
        shortBenefit: "",
        fullDescription: "",
        price: 0,
        discountPrice: null,
        duration: "2–3 hours",
        gradient: "from-orange-500/30 to-red-600/30",
        benefits: [],
        suitableFor: [],
        poojaItems: [],
        bookingInstructions: "",
        faqs: [],
        featured: false,
        order: nextOrder,
        active: true,
    };
    return (_jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx(Helmet, { children: _jsxs("title", { children: ["New Homam \u2014 Admin \u2014 ", siteConfig.name] }) }), loading ? (_jsx("p", { className: "text-muted", children: "Loading\u2026" })) : (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/admin/homams", className: "inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to homams"] }), _jsx("h1", { className: "mt-4 font-serif text-3xl text-ink", children: "New homam" }), _jsx("p", { className: "mt-1 text-sm text-muted", children: "Add a new sacred fire ritual to the site." }), _jsx(HomamForm, { mode: "create", initial: blank })] }))] }));
}
