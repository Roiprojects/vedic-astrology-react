import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils";
export function Badge({ className, children, }) {
    return (_jsx("span", { className: cn("inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-[#b67a1b]/[0.04] px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-gold-light", className), children: children }));
}
export function PriceBadge({ price, discountPrice, className, }) {
    const hasDiscount = discountPrice != null && price != null && discountPrice < price;
    return (_jsx("span", { className: cn("inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-deep/90 to-saffron-deep/90 px-3 py-1 text-sm font-semibold text-[#1a0a04] shadow-[0_6px_18px_-8px_rgba(217,178,95,0.7)]", className), children: hasDiscount ? (_jsxs(_Fragment, { children: [_jsx("span", { children: formatINR(discountPrice ?? 0) }), _jsx("span", { className: "text-[#3a1c07]/70 line-through decoration-1", children: formatINR(price ?? 0) })] })) : (_jsx("span", { children: formatINR(price ?? 0) })) }));
}
