import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { TestimonialsGrid } from "@/components/testimonials/TestimonialsGrid";
import { ContactCta } from "@/components/sections/ContactCta";
import { getTestimonials } from "@/lib/data";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getTestimonials()
            .then(setTestimonials)
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Client Testimonials \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Real experiences from people who received Vedic astrology guidance, homams, and spiritual remedies from Sampath Kumara." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/testimonials` })] }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Testimonials", url: "/testimonials" },
                ]) }), _jsx(PageHero, { eyebrow: "Testimonials", title: "Client Testimonials", subtitle: "Real experiences from people who received astrology guidance and spiritual remedies.", breadcrumbs: [{ name: "Home", href: "/" }, { name: "Testimonials" }], seed: 27 }), _jsx(Section, { children: loading ? (_jsx("p", { className: "text-muted", children: "Loading\u2026" })) : (_jsx(TestimonialsGrid, { items: testimonials })) }), _jsx(ContactCta, { title: "Need Guidance Like Them?", subtitle: "Book a consultation or chat with Guruji for your own spiritual guidance." })] }));
}
