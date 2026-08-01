import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Section } from "@/components/ui/Section";
export function LegalContent({ sections, lastUpdated, }) {
    return (_jsx(Section, { children: _jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsxs("p", { className: "text-sm text-faint", children: ["Last updated: ", lastUpdated] }), _jsx("div", { className: "mt-8 space-y-8", children: sections.map((s) => (_jsxs("div", { children: [_jsx("h2", { className: "font-serif text-2xl text-gold-light", children: s.heading }), s.paragraphs.map((p, i) => (_jsx("p", { className: "mt-3 text-sm leading-relaxed text-muted", children: p }, i)))] }, s.heading))) })] }) }));
}
