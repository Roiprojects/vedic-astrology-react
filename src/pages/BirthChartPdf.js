import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Clock, FileText, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconList } from "@/components/ui/IconList";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { BookingForm } from "@/components/forms/BookingForm";
import { ContactCta } from "@/components/sections/ContactCta";
import { getPageContent } from "@/lib/data";
import { PriceBadge } from "@/components/ui/Badge";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
const highlights = [
    { icon: FileText, title: "Detailed Report", text: "A comprehensive Vedic kundli PDF." },
    { icon: Clock, title: "24–48 Hours", text: "Delivered to your email / WhatsApp." },
    { icon: ShieldCheck, title: "100% Private", text: "Your details stay confidential." },
];
export default function BirthChartPdfPage() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getPageContent("birth-chart-pdf")
            .then(setContent)
            .finally(() => setLoading(false));
    }, []);
    if (loading || !content) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsx("p", { className: "text-muted", children: "Loading\u2026" }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Birth Chart PDF \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Get a detailed Vedic kundli (birth chart) PDF report prepared from your exact birth details \u2014 including Lagna chart, doshas, remedies, and life guidance." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/birth-chart-pdf` })] }), _jsx(JsonLd, { data: serviceSchema({
                    name: "Birth Chart PDF Report",
                    description: "A detailed Vedic kundli report prepared from your birth details.",
                    price: content.price ?? 500,
                    url: `${siteConfig.url}/birth-chart-pdf`,
                }) }), _jsx(JsonLd, { data: faqSchema(content.faqs) }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Birth Chart PDF", url: "/birth-chart-pdf" },
                ]) }), _jsx(PageHero, { eyebrow: content.eyebrow, title: content.title, subtitle: content.subtitle, breadcrumbs: [{ name: "Home", href: "/" }, { name: "Birth Chart PDF" }], seed: 19, children: _jsxs("div", { className: "flex items-center justify-center gap-3", children: [content.price != null && _jsx(PriceBadge, { price: content.price }), content.priceNote && _jsx("span", { className: "text-sm text-faint", children: content.priceNote })] }) }), _jsxs(Section, { children: [_jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: highlights.map((h) => (_jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-gold/15 bg-surface/50 p-5", children: [_jsx("span", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 ring-1 ring-gold/25", children: _jsx(h.icon, { className: "h-5 w-5 text-gold-light" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-ink", children: h.title }), _jsx("p", { className: "text-xs text-faint", children: h.text })] })] }, h.title))) }), _jsxs("div", { className: "mt-10 grid items-start gap-8 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx(SectionHeading, { align: "left", eyebrow: "Included", title: "Your Report Includes" }), _jsx(IconList, { className: "mt-6", items: content.includes, columns: 2 })] }), _jsx("div", { className: "rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-8", children: _jsx(BookingForm, { variant: "birth-chart", subject: "Birth Chart PDF" }) })] })] }), _jsxs(Section, { className: "pt-0", children: [_jsx(SectionHeading, { eyebrow: "FAQ", title: "Birth Chart Questions" }), _jsx("div", { className: "mt-10", children: _jsx(FaqAccordion, { items: content.faqs }) })] }), _jsx(ContactCta, {})] }));
}
