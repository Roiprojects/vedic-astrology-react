import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { LegalContent } from "@/components/layout/LegalContent";
import { legalLastUpdated, privacyPolicy } from "@/lib/data/legal";
import { siteConfig } from "@/lib/site";
export default function PrivacyPolicyPage() {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Privacy Policy \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "How Vedic Astrology collects, uses, and protects your personal information and birth details." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/privacy-policy` })] }), _jsx(PageHero, { eyebrow: "Legal", title: "Privacy Policy", breadcrumbs: [{ name: "Home", href: "/" }, { name: "Privacy Policy" }], seed: 41 }), _jsx(LegalContent, { sections: privacyPolicy, lastUpdated: legalLastUpdated })] }));
}
