import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { getServices } from "@/lib/data";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
export default function AstrologyConsultationsPage() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getServices()
            .then(setServices)
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Premium Astrology Consultations \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "10 premium Vedic astrology consultation services for love, marriage, career, finance, family, health, education, business, and legal matters." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/services/astrology-consultations` })] }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Services", url: "/services" },
                    { name: "Astrology Consultations", url: "/services/astrology-consultations" },
                ]) }), _jsx(PageHero, { eyebrow: "Premium Consultations", title: "Vedic Astrology Consultations", subtitle: "Personalized, confidential guidance for every important area of your life \u2014 rooted in authentic Vedic wisdom.", breadcrumbs: [
                    { name: "Home", href: "/" },
                    { name: "Services", href: "/services" },
                    { name: "Astrology Consultations" },
                ] }), _jsx(Section, { children: loading ? (_jsx("p", { className: "text-muted", children: "Loading\u2026" })) : (_jsx("div", { className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: services.map((service, i) => (_jsx(Reveal, { delay: (i % 3) * 0.05, children: _jsx(ServiceCard, { service: service }) }, service.slug))) })) }), _jsx(ContactCta, { title: "Ready for Clarity?", subtitle: "Book a consultation or chat with Guruji for personalized Vedic guidance." })] }));
}
