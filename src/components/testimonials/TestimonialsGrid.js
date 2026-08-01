import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { testimonialFilters } from "@/lib/data/testimonials";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { cn } from "@/lib/utils";
export function TestimonialsGrid({ items }) {
    const [active, setActive] = useState("all");
    const prefersReducedMotion = useReducedMotion();
    const filtered = active === "all" ? items : items.filter((t) => t.serviceType === active);
    return (_jsxs("div", { children: [_jsx("div", { className: "flex flex-wrap justify-center gap-2", children: testimonialFilters.map((f) => (_jsx("button", { type: "button", onClick: () => setActive(f.key), className: cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors", active === f.key
                        ? "border-gold bg-gold/15 text-gold-light"
                        : "border-gold/20 text-muted hover:border-gold/40 hover:text-ink"), children: f.label }, f.key))) }), filtered.length ? (_jsx("div", { className: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((t) => (_jsx(motion.div, { layout: true, initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, transition: { duration: prefersReducedMotion ? 0 : 0.4 }, children: _jsx(TestimonialCard, { t: t }) }, t.id))) })) : (_jsx("p", { className: "mt-12 text-center text-muted", children: "No testimonials in this category yet." }))] }));
}
