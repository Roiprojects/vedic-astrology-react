import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/effects/Reveal";
import { StarField } from "@/components/effects/StarField";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
export function ContactCta({ title = "Need Guidance Today?", subtitle = "Speak with Guruji for personalized Vedic astrology guidance.", }) {
    return (_jsx("section", { className: "relative py-16 sm:py-20", children: _jsx(Container, { children: _jsxs("div", { className: "relative overflow-hidden rounded-[2.5rem] border border-gold/25 bg-gradient-to-br from-saffron/15 via-gold/10 to-surface p-10 text-center sm:p-14", children: [_jsx(StarField, { count: 40, seed: 21 }), _jsxs("div", { className: "relative", children: [_jsx(Reveal, { children: _jsx("h2", { className: "font-serif text-3xl text-ink sm:text-4xl md:text-5xl", children: title }) }), _jsx(Reveal, { delay: 0.08, children: _jsx("p", { className: "mx-auto mt-4 max-w-xl text-muted", children: subtitle }) }), _jsx(Reveal, { delay: 0.16, children: _jsxs("div", { className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap", children: [_jsxs(Button, { href: whatsappLink(siteConfig.whatsapp, "Namaste Guruji, I would like astrology guidance."), external: true, variant: "whatsapp", size: "lg", className: "w-full sm:w-auto", children: [_jsx(WhatsAppIcon, { className: "h-5 w-5" }), "WhatsApp Now"] }), _jsxs(Button, { href: siteConfig.phoneHref, variant: "gold", size: "lg", className: "w-full sm:w-auto", children: [_jsx(Phone, { className: "h-5 w-5" }), "Call Now"] }), _jsx(Button, { href: "/contact-us", variant: "primary", size: "lg", className: "w-full sm:w-auto", children: "Book Consultation" })] }) })] })] }) }) }));
}
