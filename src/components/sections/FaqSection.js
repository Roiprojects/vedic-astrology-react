import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
export function FaqSection({ items, eyebrow = "FAQ", title = "Frequently Asked Questions", subtitle, }) {
    return (_jsxs(Section, { children: [_jsx(SectionHeading, { eyebrow: eyebrow, title: title, subtitle: subtitle }), _jsx("div", { className: "mt-12", children: _jsx(FaqAccordion, { items: items }) })] }));
}
