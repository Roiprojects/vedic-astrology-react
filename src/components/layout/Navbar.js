import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Phone } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/Button";
import { mainNav, siteConfig } from "@/lib/site";
import { cn, whatsappLink } from "@/lib/utils";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
export function Navbar() {
    const { pathname } = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "fixed inset-x-0 top-0 z-50", children: _jsx("div", { className: cn("container-x transition-all duration-300", scrolled ? "pt-2" : "pt-3 sm:pt-4"), children: _jsxs("nav", { className: cn("flex h-14 items-center justify-between gap-4 rounded-2xl px-3 transition-all duration-300 sm:px-5 lg:h-16", scrolled
                            ? "border border-gold/30 bg-overlay/90 backdrop-blur-xl shadow-[0_18px_44px_-26px_rgba(74,15,26,0.28)]"
                            : "border border-gold/20 bg-overlay/70 backdrop-blur-lg shadow-[0_14px_40px_-28px_rgba(74,15,26,0.20)]"), children: [_jsx(BrandLogo, { compact: true }), _jsx("ul", { className: "hidden items-center gap-1 lg:flex", children: mainNav.map((item) => (_jsxs("li", { className: "group relative", children: [_jsxs(NavLink, { to: item.href, className: ({ isActive: active }) => cn("flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors", (active || isActive(item.href))
                                                ? "text-gold-light"
                                                : "text-muted hover:text-ink"), children: [item.label, item.children && (_jsx(ChevronDown, { className: "h-3.5 w-3.5 transition-transform group-hover:rotate-180" }))] }), item.children && (_jsx("div", { className: "invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100", children: _jsx("div", { className: "glass-card overflow-hidden rounded-2xl p-2", children: item.children.map((child) => (_jsxs(NavLink, { to: child.href, className: ({ isActive: active }) => cn("block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#b67a1b]/[0.04]", active && "text-gold-light"), children: [_jsx("span", { className: "block text-sm font-medium text-ink", children: child.label }), child.description && (_jsx("span", { className: "mt-0.5 block text-xs text-faint", children: child.description }))] }, child.href))) }) }))] }, item.href))) }), _jsxs("div", { className: "hidden items-center gap-2 lg:flex", children: [_jsxs(Button, { href: whatsappLink(siteConfig.whatsapp, "Namaste Guruji, I would like astrology guidance."), external: true, variant: "whatsapp", size: "sm", children: [_jsx(WhatsAppIcon, { className: "h-4 w-4" }), "WhatsApp"] }), _jsx(Button, { href: "/contact-us", variant: "primary", size: "sm", children: "Book Now" })] }), _jsxs("div", { className: "flex items-center gap-2 lg:hidden", children: [_jsx("a", { href: siteConfig.phoneHref, "aria-label": "Call now", className: "grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold-light", children: _jsx(Phone, { className: "h-4.5 w-4.5" }) }), _jsx("button", { type: "button", "aria-label": "Open menu", onClick: () => setOpen(true), className: "grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold-light", children: _jsx(Menu, { className: "h-5 w-5" }) })] })] }) }) }), _jsx(MobileDrawer, { open: open, onClose: () => setOpen(false) })] }));
}
