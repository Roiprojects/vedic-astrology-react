import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/effects/Reveal";
import { OrnamentDivider } from "@/components/effects/OrnamentDivider";
export function SectionHeading({ eyebrow, title, subtitle, align = "center", className, }) {
    return (_jsxs("div", { className: cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className), children: [eyebrow && (_jsx(Reveal, { children: _jsxs("div", { className: cn("mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold", align === "center" && "justify-center"), children: [_jsx("span", { className: "h-px w-6 bg-gradient-to-r from-transparent to-gold/60" }), eyebrow, _jsx("span", { className: "h-px w-6 bg-gradient-to-l from-transparent to-gold/60" })] }) })), _jsx(Reveal, { delay: 0.05, children: _jsx("h2", { className: "font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-[2.75rem]", children: title }) }), align === "center" && (_jsx(Reveal, { delay: 0.08, children: _jsx(OrnamentDivider, { className: "mt-5 text-gold-light/80" }) })), subtitle && (_jsx(Reveal, { delay: 0.1, children: _jsx("p", { className: cn("mt-4 text-muted leading-relaxed", align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"), children: subtitle }) }))] }));
}
