import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { LegalContent } from "@/components/layout/LegalContent";
import { disclaimerContent, legalLastUpdated } from "@/lib/data/legal";
import { siteConfig } from "@/lib/site";
export default function DisclaimerPage() {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Disclaimer \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Astrology provides spiritual guidance and indicative insights. Results are not guaranteed \u2014 please consult qualified professionals for medical, legal, or financial decisions." }), _jsx("link", { rel: "canonical", href: `${siteConfig.url}/disclaimer` })] }), _jsx(PageHero, { eyebrow: "Legal", title: "Disclaimer", breadcrumbs: [{ name: "Home", href: "/" }, { name: "Disclaimer" }], seed: 45 }), _jsx(LegalContent, { sections: disclaimerContent, lastUpdated: legalLastUpdated })] }));
}
