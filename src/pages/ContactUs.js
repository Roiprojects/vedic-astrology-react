import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { BookingForm } from "@/components/forms/BookingForm";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { contactFaqs } from "@/lib/data/faqs";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import { JsonLd, breadcrumbSchema, localBusinessSchema } from "@/components/seo/JsonLd";
const contactCards = [
    { icon: Phone, label: "Phone", value: siteConfig.phone, href: siteConfig.phoneHref },
    {
        icon: WhatsAppIcon,
        label: "WhatsApp",
        value: siteConfig.phone,
        href: whatsappLink(siteConfig.whatsapp, "Namaste Guruji"),
        external: true,
    },
    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: MapPin, label: "Location", value: siteConfig.location },
    { icon: Clock, label: "Working Hours", value: siteConfig.workingHours },
];
export default function ContactUsPage() {
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapQuery)}&output=embed`;
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Contact Us \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Contact Vedic Astrology \u2014 speak with Sampath Kumara for astrology consultation, homam booking, or a kundli report via phone, WhatsApp, or email." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/contact-us` })] }), _jsx(JsonLd, { data: localBusinessSchema() }), _jsx(JsonLd, { data: breadcrumbSchema([
                    { name: "Home", url: "/" },
                    { name: "Contact Us", url: "/contact-us" },
                ]) }), _jsx(PageHero, { eyebrow: "Get in Touch", title: "Contact Vedic Astrology", subtitle: "Speak with Guruji for astrology consultation, homam booking, or kundli report.", breadcrumbs: [{ name: "Home", href: "/" }, { name: "Contact Us" }], seed: 31, children: _jsxs("div", { className: "flex flex-col items-center justify-center gap-3 sm:flex-row", children: [_jsxs(Button, { href: whatsappLink(siteConfig.whatsapp, "Namaste Guruji, I would like guidance."), external: true, variant: "whatsapp", size: "lg", children: [_jsx(WhatsAppIcon, { className: "h-5 w-5" }), " WhatsApp Now"] }), _jsxs(Button, { href: siteConfig.phoneHref, variant: "gold", size: "lg", children: [_jsx(Phone, { className: "h-5 w-5" }), " Call Now"] })] }) }), _jsx(Section, { children: _jsxs("div", { className: "grid gap-10 lg:grid-cols-[0.9fr_1.1fr]", children: [_jsxs("div", { children: [_jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: contactCards.map((c) => {
                                        const Inner = (_jsxs("div", { className: "flex h-full items-start gap-3 rounded-2xl border border-gold/15 bg-surface/50 p-5 transition-colors hover:border-gold/40", children: [_jsx("span", { className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 ring-1 ring-gold/25", children: _jsx(c.icon, { className: "h-5 w-5 text-gold-light" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-faint", children: c.label }), _jsx("p", { className: "mt-1 text-sm text-ink", children: c.value })] })] }));
                                        return c.href ? (_jsx("a", { href: c.href, target: c.external ? "_blank" : undefined, rel: c.external ? "noopener noreferrer" : undefined, children: Inner }, c.label)) : (_jsx("div", { children: Inner }, c.label));
                                    }) }), _jsx("div", { className: "mt-4 overflow-hidden rounded-2xl border border-gold/20", children: _jsx("iframe", { title: "Location map", src: mapSrc, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade", className: "h-64 w-full grayscale-[0.3]" }) })] }), _jsx("div", { className: "rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-8", children: _jsx(BookingForm, { variant: "contact", subject: "Contact Enquiry" }) })] }) }), _jsxs(Section, { className: "pt-0", children: [_jsx(SectionHeading, { eyebrow: "FAQ", title: "Before You Reach Out" }), _jsx("div", { className: "mt-10", children: _jsx(FaqAccordion, { items: contactFaqs }) })] }), _jsx(Section, { className: "pt-0", children: _jsx("div", { className: "mx-auto max-w-3xl rounded-2xl border border-gold/15 bg-[#b67a1b]/[0.025] p-6 text-center", children: _jsxs("p", { className: "text-sm leading-relaxed text-faint", children: [_jsx("span", { className: "font-semibold text-muted", children: "Disclaimer: " }), siteConfig.disclaimer] }) }) })] }));
}
