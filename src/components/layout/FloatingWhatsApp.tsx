import { MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function FloatingWhatsApp() {
  const waUrl = `https://wa.me/${siteConfig.whatsapp}?text=Namaste%20Guruji%2C%20I%20would%20like%20to%20book%20a%20consultation.`;

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-2.5">
      {/* Phone call button */}
      <a
        href={siteConfig.phoneHref}
        aria-label="Call Guruji"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-600/30 ring-2 ring-white/30 transition hover:scale-105 hover:bg-blue-700 active:scale-95"
      >
        <Phone className="h-5 w-5 text-white" />
      </a>
      {/* WhatsApp button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/40 ring-2 ring-white/30 transition hover:scale-105 hover:bg-[#1ebe5d] active:scale-95"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </a>
    </div>
  );
}
