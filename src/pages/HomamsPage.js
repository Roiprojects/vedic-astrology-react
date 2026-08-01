import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { HomamCard } from "@/components/cards/HomamCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { getHomams } from "@/lib/data";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
export default function HomamsPage() {
    const [homams, setHomams] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getHomams()
            .then(setHomams)
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["15 Vedic Homams \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Book authentic Vedic fire rituals (homams) for prosperity, peace, protection, health, and success \u2014 performed with proper Vedic procedure." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/homams` })] }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Homams", url: "/homams" },
                ]) }), _jsx(PageHero, { eyebrow: "Sacred Fire Rituals", title: "15 Vedic Homams", subtitle: "Book authentic Vedic fire rituals for prosperity, peace, protection, health, and success.", breadcrumbs: [{ name: "Home", href: "/" }, { name: "Homams" }], seed: 17 }), _jsx(Section, { children: loading ? (_jsx("p", { className: "text-muted", children: "Loading\u2026" })) : (_jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: homams.map((homam, i) => (_jsx(Reveal, { delay: (i % 3) * 0.05, className: "h-full", children: _jsx(HomamCard, { homam: homam }) }, homam.slug))) })) }), _jsx(ContactCta, { title: "Need Help Choosing a Homam?", subtitle: "Message Guruji and he will recommend the right ritual for your need and an auspicious date." })] }));
}
