import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cn } from "@/lib/utils";
const fieldBase = "w-full rounded-xl border border-gold/20 bg-overlay/60 px-4 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/20";
export function Label({ children, htmlFor, required, }) {
    return (_jsxs("label", { htmlFor: htmlFor, className: "mb-1.5 block text-sm font-medium text-muted", children: [children, required && _jsx("span", { className: "ml-0.5 text-saffron", children: "*" })] }));
}
export const Input = React.forwardRef(function Input({ className, ...props }, ref) {
    return _jsx("input", { ref: ref, className: cn(fieldBase, className), ...props });
});
export const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
    return (_jsx("textarea", { ref: ref, className: cn(fieldBase, "min-h-28 resize-y", className), ...props }));
});
export const Select = React.forwardRef(function Select({ className, children, ...props }, ref) {
    return (_jsx("select", { ref: ref, className: cn(fieldBase, "appearance-none", className), ...props, children: children }));
});
export function FieldError({ message }) {
    if (!message)
        return null;
    return _jsx("p", { className: "mt-1 text-xs text-danger", children: message });
}
