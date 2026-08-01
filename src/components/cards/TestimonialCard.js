import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StarRating } from "@/components/ui/StarRating";
import { Quote } from "lucide-react";
const serviceLabels = {
    love: "Love & Relationship",
    marriage: "Marriage",
    career: "Career",
    finance: "Finance",
    homam: "Homam",
    "birth-chart": "Birth Chart",
    chat: "Chat Consultation",
};
export function TestimonialCard({ t }) {
    return (_jsxs("figure", { className: "relative flex h-full flex-col rounded-3xl border border-gold/20 bg-surface/60 p-6", children: [_jsx(Quote, { className: "absolute right-5 top-5 h-8 w-8 text-gold/15" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-saffron-deep font-serif text-lg font-semibold text-ink", children: t.avatarInitial }), _jsxs("div", { children: [_jsx("figcaption", { className: "font-medium text-ink", children: t.name }), _jsx("p", { className: "text-xs text-faint", children: t.location })] })] }), _jsxs("div", { className: "mt-4 flex items-center gap-2", children: [_jsx(StarRating, { rating: t.rating }), _jsx("span", { className: "rounded-full border border-gold/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-gold-light/80", children: serviceLabels[t.serviceType] ?? t.serviceType })] }), _jsxs("blockquote", { className: "mt-4 flex-1 text-sm leading-relaxed text-muted", children: ["\u201C", t.text, "\u201D"] })] }));
}
