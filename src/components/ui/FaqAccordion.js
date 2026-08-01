import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
export function FaqAccordion({ items, className, }) {
    const [open, setOpen] = useState(0);
    return (_jsx("div", { className: cn("mx-auto max-w-3xl space-y-3", className), children: items.map((item, i) => {
            const isOpen = open === i;
            return (_jsxs("div", { className: cn("overflow-hidden rounded-2xl border transition-colors", isOpen ? "border-gold/40 bg-surface/70" : "border-gold/15 bg-surface/40"), children: [_jsxs("button", { type: "button", onClick: () => setOpen(isOpen ? null : i), className: "flex w-full items-center justify-between gap-4 px-5 py-4 text-left", "aria-expanded": isOpen, children: [_jsx("span", { className: "font-medium text-ink", children: item.question }), _jsx(Plus, { className: cn("h-5 w-5 shrink-0 text-gold transition-transform duration-300", isOpen && "rotate-45") })] }), _jsx(AnimatePresence, { initial: false, children: isOpen && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }, children: _jsx("p", { className: "px-5 pb-5 text-sm leading-relaxed text-muted", children: item.answer }) })) })] }, i));
        }) }));
}
