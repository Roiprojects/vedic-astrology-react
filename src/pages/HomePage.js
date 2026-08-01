import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { TempleHome } from "@/components/sections/TempleHome";
import { siteConfig } from "@/lib/site";
export default function HomePage() {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: siteConfig.name }), _jsx("meta", { name: "description", content: siteConfig.description }), _jsx("link", { rel: "canonical", href: siteConfig.url })] }), _jsx(TempleHome, {})] }));
}
