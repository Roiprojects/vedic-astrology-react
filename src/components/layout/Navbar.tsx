import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "container-x transition-all duration-300",
            scrolled ? "pt-2" : "pt-3 sm:pt-4"
          )}
        >
          <nav
            className={cn(
              "flex h-14 items-center justify-between gap-4 rounded-2xl px-3 transition-all duration-300 sm:px-5 lg:h-16",
              scrolled
                ? "border border-gold/30 bg-overlay/90 backdrop-blur-xl shadow-[0_18px_44px_-26px_rgba(74,15,26,0.28)]"
                : "border border-gold/20 bg-overlay/70 backdrop-blur-lg shadow-[0_14px_40px_-28px_rgba(74,15,26,0.20)]"
            )}
          >
          <BrandLogo compact />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => (
              <li key={item.href} className="group relative">
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-gold-light"
                      : "text-muted hover:text-ink"
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
                  )}
                </a>

                {item.children && (
                  <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="glass-card overflow-hidden rounded-2xl p-2">
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#b67a1b]/[0.04]"
                        >
                          <span className="block text-sm font-medium text-ink">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs text-faint">
                              {child.description}
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              href={whatsappLink(
                siteConfig.whatsapp,
                "Namaste Guruji, I would like astrology guidance."
              )}
              external
              variant="whatsapp"
              size="sm"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button href="/contact-us" variant="primary" size="sm">
              Book Now
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={siteConfig.phoneHref}
              aria-label="Call now"
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold-light"
            >
              <Phone className="h-4.5 w-4.5" />
            </a>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold-light"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          </nav>
        </div>
      </header>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
