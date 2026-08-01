import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
export function IconList({ items, className, columns = 1, }) {
    return (_jsx("ul", { className: cn("grid gap-3", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1", className), children: items.map((item) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/30", children: _jsx(Check, { className: "h-3.5 w-3.5 text-gold-light" }) }), _jsx("span", { className: "text-sm leading-relaxed text-muted", children: item })] }, item))) }));
}
