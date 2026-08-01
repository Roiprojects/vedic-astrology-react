import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
export function FloatingWhatsApp() {
    return (_jsxs("a", { href: whatsappLink(siteConfig.whatsapp, "Namaste Guruji, I would like astrology guidance."), target: "_blank", rel: "noopener noreferrer", "aria-label": "Chat with Guruji on WhatsApp", className: "group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-[#052e16] shadow-[0_12px_40px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6", children: [_jsx("span", { className: "absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" }), _jsx(WhatsAppIcon, { className: "relative h-6 w-6" }), _jsx("span", { className: "relative hidden pr-1 text-sm font-semibold sm:group-hover:block", children: "Chat with Guruji" })] }));
}
