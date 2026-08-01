import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from "react-helmet-async";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { StarField } from "@/components/effects/StarField";
import { siteConfig } from "@/lib/site";
export default function NotFound() {
    return (_jsxs("main", { className: "relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center", children: [_jsx(StarField, { count: 60, seed: 99 }), _jsxs("div", { className: "relative", children: [_jsx(BrandLogo, { showText: false, size: 72 }), _jsxs(Helmet, { children: [_jsxs("title", { children: ["404 \u2014 ", siteConfig.name] }), _jsx("meta", { name: "description", content: "Page not found." })] }), _jsx("p", { className: "mt-8 font-serif text-7xl text-gold-gradient", children: "404" }), _jsx("h1", { className: "mt-2 font-serif text-2xl text-ink sm:text-3xl", children: "This Path Isn't Written in the Stars" }), _jsx("p", { className: "mx-auto mt-3 max-w-md text-muted", children: "The page you're looking for could not be found. Let us guide you back." }), _jsxs("div", { className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row", children: [_jsx(Button, { href: "/", variant: "primary", size: "lg", children: "Return Home" }), _jsx(Button, { href: "/services", variant: "gold", size: "lg", children: "Explore Services" })] }), _jsx("a", { href: "/contact-us", className: "mt-6 inline-block text-sm text-faint underline-offset-4 hover:text-gold-light hover:underline", children: "Or contact Guruji for guidance \u2192" })] })] }));
}
