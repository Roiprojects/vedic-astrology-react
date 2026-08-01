import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRight } from "lucide-react";
export function Breadcrumbs({ items, }) {
    return (_jsx("nav", { "aria-label": "Breadcrumb", className: "flex justify-center", children: _jsx("ol", { className: "flex flex-wrap items-center gap-1.5 text-xs text-faint", children: items.map((item, i) => (_jsxs("li", { className: "flex items-center gap-1.5", children: [item.href ? (_jsx("a", { href: item.href, className: "transition-colors hover:text-gold-light", children: item.name })) : (_jsx("span", { className: "text-gold-light", children: item.name })), i < items.length - 1 && _jsx(ChevronRight, { className: "h-3.5 w-3.5" })] }, i))) }) }));
}
