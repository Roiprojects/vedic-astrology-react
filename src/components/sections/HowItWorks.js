import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/effects/Reveal";
import { processSteps } from "@/lib/data/content";
export function HowItWorks() {
    return (_jsxs(Section, { className: "relative", children: [_jsx(SectionHeading, { eyebrow: "How It Works", title: "Your Path to Guidance in 6 Simple Steps", subtitle: "From choosing a service to receiving your personalized guidance \u2014 a smooth, guided journey." }), _jsx("div", { className: "mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: processSteps.map((step, i) => (_jsx(Reveal, { delay: (i % 3) * 0.06, children: _jsxs("div", { className: "relative h-full rounded-3xl border border-gold/20 bg-surface/50 p-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-purple-700/60 to-saffron-deep/50 text-2xl ring-1 ring-gold/25", children: step.icon }), _jsx("span", { className: "font-serif text-4xl text-gold/25", children: String(step.step).padStart(2, "0") })] }), _jsx("h3", { className: "mt-5 font-serif text-lg text-ink", children: step.title }), _jsx("p", { className: "mt-2 text-sm leading-relaxed text-muted", children: step.description })] }) }, step.step))) })] }));
}
