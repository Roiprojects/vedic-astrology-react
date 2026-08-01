import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { LegalContent } from "@/components/layout/LegalContent";
import { legalLastUpdated, refundPolicy } from "@/lib/data/legal";
import { siteConfig } from "@/lib/site";
export default function RefundCancellationPage() {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Refund & Cancellation \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Refund and cancellation policy for Vedic Astrology services, consultations, and homam bookings." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/refund-cancellation` })] }), _jsx(PageHero, { eyebrow: "Legal", title: "Refund & Cancellation", breadcrumbs: [
                    { name: "Home", href: "/" },
                    { name: "Refund & Cancellation" },
                ], seed: 44 }), _jsx(LegalContent, { sections: refundPolicy, lastUpdated: legalLastUpdated })] }));
}
