import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Clock, MessageCircleMore, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AskGurujiButton } from "@/components/ai/AskGurujiButton";
import { IconList } from "@/components/ui/IconList";
import { Reveal } from "@/components/effects/Reveal";
import { StarField } from "@/components/effects/StarField";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingForm } from "@/components/forms/BookingForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ContactCta } from "@/components/sections/ContactCta";
import { getHomamBySlug } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { whatsappLink, cn } from "@/lib/utils";
import { JsonLd, breadcrumbSchema, faqSchema, serviceSchema, } from "@/components/seo/JsonLd";
export default function HomamDetailPage() {
    const { slug } = useParams();
    const [homam, setHomam] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (!slug)
                return;
            const data = await getHomamBySlug(slug);
            if (!cancelled) {
                setHomam(data ?? null);
                setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [slug]);
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsx("p", { className: "text-muted", children: "Loading\u2026" }) }));
    }
    if (!homam) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "font-serif text-4xl text-gold-gradient", children: "404" }), _jsx("p", { className: "mt-4 text-muted", children: "Homam not found." }), _jsx("a", { href: "/homams", className: "mt-6 inline-block text-gold-light underline", children: "Back to homams" })] }) }));
    }
    const url = `${siteConfig.url}/homams/${homam.slug}`;
    const wa = whatsappLink(siteConfig.whatsapp, `Namaste Guruji, I would like to book the ${homam.name}.`);
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: [homam.name, " \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: homam.shortBenefit }), _jsx("link", { rel: "canonical", href: url })] }), _jsx(JsonLd, { data: serviceSchema({
                    name: homam.name,
                    description: homam.shortBenefit,
                    price: homam.price,
                    url,
                }) }), _jsx(JsonLd, { data: faqSchema(homam.faqs) }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Homams", url: "/homams" },
                    { name: homam.name, url: `/homams/${homam.slug}` },
                ]) }), _jsxs("section", { className: "warm-band relative isolate overflow-hidden border-b border-gold/30 text-white", children: [_jsx(StarField, { count: 45, seed: homam.order + 4 }), _jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 mix-blend-soft-light [background:radial-gradient(70%_55%_at_50%_-5%,rgba(255,220,140,0.5),transparent_60%)]" }), _jsxs(Container, { className: "relative grid items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20", children: [_jsxs("div", { children: [_jsx("div", { className: "[&_a]:text-[#f8ddad]/80 [&_a:hover]:text-white [&_span]:text-[#f8ddad]/55 [&_svg]:text-[#e6bd64]", children: _jsx(Breadcrumbs, { items: [
                                                { name: "Home", href: "/" },
                                                { name: "Homams", href: "/homams" },
                                                { name: homam.name },
                                            ] }) }), _jsx(Reveal, { children: _jsx("div", { className: "mt-5 flex items-center gap-3", children: _jsx("span", { className: cn("grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-2xl ring-1 ring-gold/40", homam.gradient), children: homam.icon }) }) }), _jsx(Reveal, { delay: 0.06, children: _jsx("h1", { className: "mt-5 font-serif text-4xl leading-tight text-[#fff8e8] sm:text-5xl", children: homam.name }) }), _jsx(Reveal, { delay: 0.12, children: _jsx("p", { className: "mt-4 max-w-xl leading-relaxed text-[#ffe6ad]", children: homam.shortBenefit }) }), _jsx(Reveal, { delay: 0.16, children: _jsxs("div", { className: "mt-4 inline-flex items-center gap-2 text-sm text-[#ffd777]", children: [_jsx(Clock, { className: "h-4 w-4" }), " ", homam.duration] }) }), _jsx(Reveal, { delay: 0.22, children: _jsxs("div", { className: "mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap", children: [_jsx(Button, { href: "#book", variant: "primary", size: "lg", className: "w-full sm:w-auto", children: "Book Homam" }), _jsxs(AskGurujiButton, { serviceTitle: homam.name, className: "w-full justify-center border border-[#f2c55e]/60 bg-[#8a2c12]/70 text-[#fff1c7] hover:bg-[#a4381a] sm:w-auto", children: [_jsx(MessageCircleMore, { className: "h-5 w-5" }), " Ask Guruji"] }), _jsxs(Button, { href: wa, external: true, variant: "whatsapp", size: "lg", className: "w-full sm:w-auto", children: [_jsx(WhatsAppIcon, { className: "h-5 w-5" }), " WhatsApp Now"] }), _jsxs(Button, { href: siteConfig.phoneHref, variant: "gold", size: "lg", className: "w-full border-[#f2c55e]/50 bg-[#381523]/70 text-[#fff1c7] hover:bg-[#481c2e] sm:w-auto", children: [_jsx(Phone, { className: "h-5 w-5" }), " Call Now"] })] }) })] }), _jsx(Reveal, { delay: 0.2, children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "divine-glow absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-700/30 to-saffron-deep/20 blur-2xl" }), _jsxs("div", { className: "relative rounded-[2rem] border border-gold/25 bg-[#3a151f]/75 p-8 text-center backdrop-blur-md", children: [_jsx("div", { className: cn("mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br text-5xl ring-2 ring-gold/40", homam.gradient), children: homam.icon }), _jsx("p", { className: "mt-6 text-sm leading-relaxed text-[#fff2d0]/80", children: homam.fullDescription })] })] }) })] })] }), _jsxs(Section, { children: [_jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-2xl text-ink", children: "Benefits" }), _jsx(IconList, { className: "mt-6", items: homam.benefits })] }), _jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-2xl text-ink", children: "Suitable For" }), _jsx(IconList, { className: "mt-6", items: homam.suitableFor })] })] }), _jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-xl text-ink", children: "Pooja Items Included" }), _jsx(IconList, { className: "mt-5", items: homam.poojaItems })] }), _jsxs("div", { className: "rounded-3xl border border-gold/20 bg-surface/50 p-7", children: [_jsx("h3", { className: "font-serif text-xl text-ink", children: "How Booking Works" }), _jsx("p", { className: "mt-4 text-sm leading-relaxed text-muted", children: homam.bookingInstructions })] })] })] }), _jsx(Section, { id: "book", className: "scroll-mt-24 pt-0", children: _jsx("div", { className: "mx-auto max-w-3xl rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-9", children: _jsx(BookingForm, { variant: "homam", subject: homam.name }) }) }), _jsxs(Section, { className: "pt-0", children: [_jsx(SectionHeading, { eyebrow: "FAQ", title: "Questions About This Homam" }), _jsx("div", { className: "mt-10", children: _jsx(FaqAccordion, { items: homam.faqs }) })] }), _jsx(ContactCta, {})] }));
}
