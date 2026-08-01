import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { mainNav, siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
export function MobileDrawer({ open, onClose, }) {
    const { pathname } = useLocation();
    // Close on route change
    useEffect(() => {
        onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);
    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);
    const links = mainNav.flatMap((item) => item.children
        ? [{ label: item.label, href: item.href }, ...item.children]
        : [item]);
    return (_jsx(AnimatePresence, { children: open && (_jsxs(motion.div, { className: "fixed inset-0 z-[60] lg:hidden", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [_jsx("div", { className: "absolute inset-0 bg-overlay/95 backdrop-blur-xl" }), _jsxs(motion.div, { className: "relative flex h-full flex-col", initial: { y: -16, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -16, opacity: 0 }, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }, children: [_jsxs("div", { className: "container-x flex h-16 items-center justify-between gold-hairline", children: [_jsx(BrandLogo, { compact: true, size: 40 }), _jsx("button", { type: "button", "aria-label": "Close menu", onClick: onClose, className: "grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold-light", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("nav", { className: "container-x flex-1 overflow-y-auto py-6", children: _jsx("ul", { className: "space-y-1", children: links.map((link, i) => (_jsx(motion.li, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.06 * i + 0.1 }, children: _jsx("a", { href: link.href, onClick: onClose, className: "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-ink transition-colors hover:bg-[#b67a1b]/[0.04]", children: link.label }) }, link.href))) }) }), _jsxs("div", { className: "container-x grid grid-cols-1 gap-3 border-t border-gold/20 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]", children: [_jsx(Button, { href: "/contact-us", variant: "primary", size: "lg", onClick: onClose, children: "Book Consultation" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs(Button, { href: whatsappLink(siteConfig.whatsapp, "Namaste Guruji, I would like astrology guidance."), external: true, variant: "whatsapp", size: "md", children: [_jsx(WhatsAppIcon, { className: "h-4 w-4" }), "WhatsApp"] }), _jsxs(Button, { href: siteConfig.phoneHref, variant: "gold", size: "md", children: [_jsx(Phone, { className: "h-4 w-4" }), "Call Now"] })] })] })] })] })) }));
}
