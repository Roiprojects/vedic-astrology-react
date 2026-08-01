import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VedicSymbol } from "@/components/icons/VedicSymbol";
import { getRemedySymbol } from "@/lib/presentation/vedic-symbols";
import { cn } from "@/lib/utils";
export function RemedyList({ items, className, columns = 1, }) {
    return (_jsx("ul", { className: cn("grid gap-3", columns === 2 && "sm:grid-cols-2", className), children: items.map((item) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/30 bg-saffron/10 text-gold-light", children: _jsx(VedicSymbol, { kind: getRemedySymbol(item), size: "sm" }) }), _jsx("span", { className: "pt-1 text-sm leading-relaxed text-muted", children: item })] }, item))) }));
}
