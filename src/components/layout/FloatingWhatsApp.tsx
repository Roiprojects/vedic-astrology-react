import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import { isNativePlatform } from "@/lib/platform";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function FloatingWhatsApp() {
  if (isNativePlatform()) return null;
  const href = whatsappLink(
    siteConfig.whatsapp,
    "Namaste Guruji, I would like guidance from Vedic Astrology."
  );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-[#052e16] shadow-lg"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
