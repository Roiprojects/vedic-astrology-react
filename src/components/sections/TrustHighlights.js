import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { trustHighlights } from "@/lib/data/content";
export function TrustHighlights() {
    return (_jsx(Section, { className: "py-14 sm:py-16", children: _jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6", children: trustHighlights.map((item, i) => (_jsx(Reveal, { delay: i * 0.05, children: _jsxs("div", { className: "group flex h-full flex-col items-center rounded-2xl border border-gold/15 bg-surface/50 p-5 text-center transition-colors hover:border-gold/40", children: [_jsx("span", { className: "text-3xl transition-transform duration-300 group-hover:scale-110", children: item.icon }), _jsx("h3", { className: "mt-3 text-sm font-semibold text-gold-light", children: item.title }), _jsx("p", { className: "mt-1 text-xs leading-relaxed text-faint", children: item.description })] }) }, item.title))) }) }));
}
