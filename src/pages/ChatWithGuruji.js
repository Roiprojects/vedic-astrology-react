import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Gift, Lock, MessagesSquare, Sparkles } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/effects/Reveal";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { BookingForm } from "@/components/forms/BookingForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ContactCta } from "@/components/sections/ContactCta";
import { getPageContent } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/seo/JsonLd";
const features = [
    { icon: Gift, title: "3 Free Questions", text: "Ask three introductory questions about services, homams, remedies, or birth charts." },
    { icon: MessagesSquare, title: "Automated Service Guide", text: "Get concise automated guidance before choosing a personal consultation." },
    { icon: Lock, title: "Confidential", text: "Your conversation stays completely private." },
    { icon: Sparkles, title: "Continue with Guruji", text: "Move from automated guidance to a personal session via WhatsApp, UPI, or Razorpay." },
];
export default function ChatWithGurujiPage() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getPageContent("chat-with-guruji")
            .then(setContent)
            .finally(() => setLoading(false));
    }, []);
    if (loading || !content) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsx("p", { className: "text-muted", children: "Loading\u2026" }) }));
    }
    const wa = whatsappLink(siteConfig.whatsapp, "Namaste Guruji, I would like to start a chat consultation.");
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Chat with Guruji \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Get live Vedic guidance directly from Sampath Kumara. First few messages free, then continue with a paid consultation. Confidential and convenient." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/chat-with-guruji` })] }), _jsx(JsonLd, { data: faqSchema(content.faqs) }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Chat with Guruji", url: "/chat-with-guruji" },
                ]) }), _jsx(PageHero, { eyebrow: content.eyebrow, title: content.title, subtitle: content.subtitle, breadcrumbs: [{ name: "Home", href: "/" }, { name: "Chat with Guruji" }], seed: 23, children: _jsxs("div", { className: "flex flex-col items-center justify-center gap-3 sm:flex-row", children: [_jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-online/40 bg-online/10 px-4 py-1.5 text-sm text-online", children: [_jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [_jsx("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-online opacity-75" }), _jsx("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full bg-online" })] }), "Guruji is Available Now"] }), _jsxs(Button, { href: wa, external: true, variant: "whatsapp", size: "lg", children: [_jsx(WhatsAppIcon, { className: "h-5 w-5" }), " Start Chat on WhatsApp"] })] }) }), _jsx(Section, { children: _jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: features.map((f, i) => (_jsx(Reveal, { delay: i * 0.06, children: _jsxs("div", { className: "h-full rounded-2xl border border-gold/15 bg-surface/50 p-6", children: [_jsx("span", { className: "grid h-11 w-11 place-items-center rounded-xl bg-gold/10 ring-1 ring-gold/25", children: _jsx(f.icon, { className: "h-5 w-5 text-gold-light" }) }), _jsx("h3", { className: "mt-4 font-serif text-lg text-ink", children: f.title }), _jsx("p", { className: "mt-1.5 text-sm leading-relaxed text-muted", children: f.text })] }) }, f.title))) }) }), _jsx(Section, { className: "pt-0", children: _jsx("div", { className: "mx-auto max-w-3xl rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-9", children: _jsx(BookingForm, { variant: "chat", subject: "Chat with Guruji" }) }) }), _jsxs(Section, { className: "pt-0", children: [_jsx(SectionHeading, { eyebrow: "FAQ", title: "Chat Consultation Questions" }), _jsx("div", { className: "mt-10", children: _jsx(FaqAccordion, { items: content.faqs }) })] }), _jsx(ContactCta, { title: "Ready to Chat with Guruji?", subtitle: "Ask three free questions, then continue personally with Sampath Kumara." })] }));
}
