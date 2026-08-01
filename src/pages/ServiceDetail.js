import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, MessageCircleMore, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AskGurujiButton } from "@/components/ai/AskGurujiButton";
import { PriceBadge } from "@/components/ui/Badge";
import { IconList } from "@/components/ui/IconList";
import { Reveal } from "@/components/effects/Reveal";
import { StarField } from "@/components/effects/StarField";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingForm } from "@/components/forms/BookingForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ContactCta } from "@/components/sections/ContactCta";
import { getServiceBySlug } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { whatsappLink, cn } from "@/lib/utils";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema, } from "@/components/seo/JsonLd";
export default function ServiceDetailPage() {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!slug)
                return;
            const data = await getServiceBySlug(slug);
            if (!cancelled) {
                setService(data ?? null);
                setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [slug]);
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsx("p", { className: "text-muted", children: "Loading\u2026" }) }));
    }
    if (!service) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "font-serif text-4xl text-gold-gradient", children: "404" }), _jsx("p", { className: "mt-4 text-muted", children: "Service not found." }), _jsx("a", { href: "/services", className: "mt-6 inline-block text-gold-light underline", children: "Back to services" })] }) }));
    }
    const url = `${siteConfig.url}/services/${service.slug}`;
    const wa = whatsappLink(siteConfig.whatsapp, `Namaste Guruji, I would like a consultation for ${service.title}.`);
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [service.title, " \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: service.shortDescription }), _jsx("link", { rel: "canonical", href: url })] }), _jsx(JsonLd, { data: serviceSchema({
                    name: service.title,
                    description: service.shortDescription,
                    price: service.price,
                    url,
                }) }), _jsx(JsonLd, { data: faqSchema(service.faqs) }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Services", url: "/services" },
                    { name: "Consultations", url: "/services/astrology-consultations" },
                    { name: service.title, url: `/services/${service.slug}` },
                ]) }), _jsxs("section", { className: "warm-band relative isolate overflow-hidden border-b border-gold/30 text-white", children: [_jsx(StarField, { count: 45, seed: service.order + 3 }), _jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 mix-blend-soft-light [background:radial-gradient(70%_55%_at_50%_-5%,rgba(255,220,140,0.5),transparent_60%)]" }), _jsxs(Container, { className: "relative grid items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20", children: [_jsxs("div", { children: [_jsx("div", { className: "[&_a]:text-[#f8ddad]/80 [&_a:hover]:text-white [&_span]:text-[#f8ddad]/55 [&_svg]:text-[#e6bd64]", children: _jsx(Breadcrumbs, { items: [
                                                { name: "Home", href: "/" },
                                                { name: "Services", href: "/services" },
                                                { name: service.title },
                                            ] }) }), _jsx(Reveal, { children: _jsxs("div", { className: "mt-5 flex items-center gap-3", children: [_jsx("span", { className: cn("grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-2xl ring-1 ring-gold/40", service.gradient), children: service.icon }), _jsx(PriceBadge, { price: service.price, discountPrice: service.discountPrice })] }) }), _jsx(Reveal, { delay: 0.06, children: _jsx("h1", { className: "mt-5 font-serif text-4xl leading-tight text-[#fff8e8] sm:text-5xl", children: service.title }) }), _jsx(Reveal, { delay: 0.12, children: _jsx("p", { className: "mt-4 max-w-xl leading-relaxed text-[#fff2d0]/85", children: service.shortDescription }) }), _jsx(Reveal, { delay: 0.16, children: _jsxs("div", { className: "mt-4 inline-flex items-center gap-2 text-sm text-[#ffd777]", children: [_jsx(Clock, { className: "h-4 w-4" }), " ", service.duration] }) }), _jsx(Reveal, { delay: 0.22, children: _jsxs("div", { className: "mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap", children: [_jsx(Button, { href: "#book", variant: "primary", size: "lg", className: "w-full sm:w-auto", children: "Book Consultation" }), _jsxs(AskGurujiButton, { serviceTitle: service.title, className: "w-full justify-center border border-[#f2c55e]/60 bg-[#8a2c12]/70 text-[#fff1c7] hover:bg-[#a4381a] sm:w-auto", children: [_jsx(MessageCircleMore, { className: "h-5 w-5" }), " Ask Guruji"] }), _jsxs(Button, { href: wa, external: true, variant: "whatsapp", size: "lg", className: "w-full sm:w-auto", children: [_jsx(WhatsAppIcon, { className: "h-5 w-5" }), " WhatsApp Now"] }), _jsxs(Button, { href: siteConfig.phoneHref, variant: "gold", size: "lg", className: "w-full border-[#f2c55e]/50 bg-[#5c1f12]/60 text-[#fff1c7] hover:bg-[#7a2a17] sm:w-auto", children: [_jsx(Phone, { className: "h-5 w-5" }), " Call Now"] })] }) })] }), _jsx(Reveal, { delay: 0.2, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "divine-glow absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-saffron/25 to-gold/15 blur-2xl" }), _jsxs("div", { className: "relative rounded-[2rem] border border-gold/25 bg-[#3a151f]/75 p-8 text-center backdrop-blur-md", children: [_jsx("div", { className: cn("mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br text-5xl ring-2 ring-gold/40", service.gradient), children: service.icon }), _jsx("p", { className: "mt-6 text-sm leading-relaxed text-[#fff2d0]/80", children: service.fullDescription })] })] }) })] })] }), _jsx(Section, { children: _jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx(SectionHeading, { align: "left", eyebrow: "Understanding the Problem", title: "Are You Facing This?" }), _jsx("p", { className: "mt-5 leading-relaxed text-muted", children: service.problem })] }) }), _jsxs(Section, { className: "pt-0", children: [_jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-2xl text-ink", children: "Astrology Analysis Included" }), _jsx("p", { className: "mt-2 text-sm text-faint", children: "What Guruji examines in your birth chart for this concern." }), _jsx(IconList, { className: "mt-6", items: service.analysis })] }), _jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-2xl text-ink", children: "What You Will Receive" }), _jsx("p", { className: "mt-2 text-sm text-faint", children: "Everything included with your consultation." }), _jsx(IconList, { className: "mt-6", items: service.receive })] })] }), _jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-xl text-ink", children: "Key Benefits" }), _jsx(IconList, { className: "mt-5", items: service.benefits })] }), _jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-xl text-ink", children: "Remedies & Support" }), _jsx(IconList, { className: "mt-5", items: service.remedies })] })] })] }), _jsx(Section, { id: "book", className: "scroll-mt-24 pt-0", children: _jsx("div", { className: "mx-auto max-w-3xl rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-9", children: _jsx(BookingForm, { variant: "consultation", subject: service.title }) }) }), _jsxs(Section, { className: "pt-0", children: [_jsx(SectionHeading, { eyebrow: "FAQ", title: "Questions About This Service" }), _jsx("div", { className: "mt-10", children: _jsx(FaqAccordion, { items: service.faqs }) })] }), _jsx(ContactCta, {})] }));
}
