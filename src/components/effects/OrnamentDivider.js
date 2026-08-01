import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
/**
 * Small ornamental gold flourish — a hairline rule with a central diamond
 * motif. Colour via currentColor (default gold). Used under section eyebrows
 * and between sections for a temple/luxury feel.
 */
export function OrnamentDivider({ className, width = "w-14", }) {
    return (_jsxs("div", { className: cn("flex items-center justify-center gap-2.5 text-gold", className), "aria-hidden": true, children: [_jsx("span", { className: cn("h-px bg-gradient-to-r from-transparent to-current opacity-60", width) }), _jsxs("svg", { viewBox: "0 0 24 24", className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.4", children: [_jsx("path", { d: "M12 2l3.2 6.8L22 12l-6.8 3.2L12 22l-3.2-6.8L2 12l6.8-3.2Z" }), _jsx("circle", { cx: "12", cy: "12", r: "1.4", fill: "currentColor", stroke: "none" })] }), _jsx("span", { className: cn("h-px bg-gradient-to-l from-transparent to-current opacity-60", width) })] }));
}
