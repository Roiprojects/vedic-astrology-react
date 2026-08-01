import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { LegalContent } from "@/components/layout/LegalContent";
import { legalLastUpdated, termsAndConditions } from "@/lib/data/legal";
import { siteConfig } from "@/lib/site";
export default function TermsAndConditionsPage() {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Terms & Conditions \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "The terms and conditions governing the use of Vedic Astrology services, bookings, and payments." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/terms-and-conditions` })] }), _jsx(PageHero, { eyebrow: "Legal", title: "Terms & Conditions", breadcrumbs: [{ name: "Home", href: "/" }, { name: "Terms & Conditions" }], seed: 43 }), _jsx(LegalContent, { sections: termsAndConditions, lastUpdated: legalLastUpdated })] }));
}
