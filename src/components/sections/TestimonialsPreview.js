import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/effects/Reveal";
import { Button } from "@/components/ui/Button";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { getFeaturedTestimonials } from "@/lib/data";
export function TestimonialsPreview() {
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => {
        getFeaturedTestimonials(6).then(setTestimonials);
    }, []);
    return (_jsxs(Section, { children: [_jsx(SectionHeading, { eyebrow: "Testimonials", title: "Blessings From Those We've Guided", subtitle: "Real experiences from people who received astrology guidance and spiritual remedies." }), _jsx("div", { className: "mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3", children: testimonials.map((t, i) => (_jsx(Reveal, { delay: (i % 3) * 0.06, children: _jsx(TestimonialCard, { t: t }) }, t.id))) }), _jsx("div", { className: "mt-10 text-center", children: _jsx(Button, { href: "/testimonials", variant: "gold", size: "lg", children: "Read All Testimonials" }) })] }));
}
