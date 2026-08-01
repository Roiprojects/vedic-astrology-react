import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Camera, Hand, ScanLine, Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { PalmReader } from "@/components/ai/PalmReader";
import { ContactCta } from "@/components/sections/ContactCta";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { getPageContent } from "@/lib/data";
import { siteConfig } from "@/lib/site";
const steps = [
    { icon: Camera, title: "Take a Photo", text: "Snap a clear, well-lit photo of your open palm." },
    { icon: ScanLine, title: "Line Analysis", text: "Our reader studies your heart, head, life & fate lines." },
    { icon: Sparkles, title: "Get Your Reading", text: "Receive guidance on love, career, health & fortune." },
];
export default function PalmReadingPage() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setContent(getPageContent("palm-reading"));
        setLoading(false);
    }, []);
    if (loading || !content) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsx("p", { className: "text-muted", children: "Loading\u2026" }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Instant Palm Reader \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Upload a photo of your palm and receive an instant Vedic palmistry reading covering love, career, vitality, and fortune." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/palm-reading` })] }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Instant Palm Reader", url: "/palm-reading" },
                ]) }), _jsx(PageHero, { eyebrow: content.eyebrow, title: content.title, subtitle: content.subtitle, breadcrumbs: [{ name: "Home", href: "/" }, { name: "Instant Palm Reader" }], seed: 33, children: _jsx("div", { className: "flex items-center justify-center gap-2", children: _jsxs(Badge, { children: [_jsx(Hand, { className: "h-3.5 w-3.5" }), " Instant \u00B7 Private \u00B7 Free"] }) }) }), _jsx(Section, { className: "pb-0", children: _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-3", children: steps.map((s, i) => (_jsx(Reveal, { delay: i * 0.06, children: _jsxs("div", { className: "flex items-center gap-3 rounded-2xl border border-gold/15 bg-surface/50 p-5", children: [_jsx("span", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 ring-1 ring-gold/25", children: _jsx(s.icon, { className: "h-5 w-5 text-gold-light" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-ink", children: s.title }), _jsx("p", { className: "text-xs text-faint", children: s.text })] })] }) }, s.title))) }) }), _jsx(Section, { children: _jsx(PalmReader, {}) }), _jsx(ContactCta, { title: "Want a Deeper Reading?", subtitle: "Book a personal consultation with Guruji for a complete Vedic analysis." })] }));
}
