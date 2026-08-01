import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/effects/Reveal";
import { StarField } from "@/components/effects/StarField";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";
export function PageHero({ eyebrow, title, subtitle, breadcrumbs, children, className, seed = 13, }) {
    return (_jsxs("section", { className: cn("warm-band relative isolate overflow-hidden border-b border-gold/30 text-white", className), children: [_jsx(StarField, { count: 45, seed: seed }), _jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 mix-blend-soft-light [background:radial-gradient(70%_55%_at_50%_-5%,rgba(255,220,140,0.5),transparent_60%)]" }), _jsxs(Container, { className: "relative py-16 text-center sm:py-20", children: [breadcrumbs && (_jsx("div", { className: "mb-5 [&_a]:text-[#f8ddad]/80 [&_a:hover]:text-white [&_span]:text-[#f8ddad]/55 [&_svg]:text-[#e6bd64]", children: _jsx(Breadcrumbs, { items: breadcrumbs }) })), eyebrow && (_jsx(Reveal, { children: _jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.28em] text-[#ffd777]", children: eyebrow }) })), _jsx(Reveal, { delay: 0.06, children: _jsx("h1", { className: "mx-auto mt-3 max-w-3xl font-serif text-4xl leading-tight text-[#fff8e8] sm:text-5xl", children: title }) }), subtitle && (_jsx(Reveal, { delay: 0.12, children: _jsx("p", { className: "mx-auto mt-4 max-w-2xl text-[#fff2d0]/85", children: subtitle }) })), children && (_jsx(Reveal, { delay: 0.18, children: _jsx("div", { className: "mt-8", children: children }) }))] })] }));
}
