import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
export function BrandLogo({ showText = true, size = 50, href = "/", className, compact = false, }) {
    const emblem = (_jsxs("span", { className: "relative shrink-0 overflow-hidden rounded-full ring-2 ring-gold/70 shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_8px_22px_-6px_rgba(189,71,29,0.55)]", style: { width: size, height: size }, children: [_jsx("img", { src: "/logo-mark.png", alt: `${siteConfig.name} logo`, className: "absolute inset-0 w-full h-full object-cover object-center" }), _jsx("span", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-gold/40" })] }));
    const text = showText && (_jsxs("span", { className: "flex flex-col leading-none", children: [_jsx("span", { className: "font-display text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-gold-light sm:text-base", children: "Vedic Astrology" }), !compact && (_jsx("span", { className: "mt-1 text-[0.6rem] uppercase tracking-[0.32em] text-muted/80", children: siteConfig.tagline }))] }));
    const content = (_jsxs("span", { className: cn("inline-flex items-center gap-3", className), children: [emblem, text] }));
    if (href) {
        return (_jsx("a", { href: href, "aria-label": `${siteConfig.name} home`, className: "inline-flex", children: content }));
    }
    return content;
}
