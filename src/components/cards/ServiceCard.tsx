import { ArrowRight, MessageCircleMore } from "lucide-react";
import type { Service } from "@/lib/data/types";
import { Button } from "@/components/ui/Button";
import { AskGurujiButton } from "@/components/ai/AskGurujiButton";
import { PriceBadge } from "@/components/ui/Badge";
import { VedicSymbol } from "@/components/icons/VedicSymbol";
import { getServiceSymbol } from "@/lib/presentation/vedic-symbols";
import { cn } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gold/20 bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[var(--shadow-glow-gold)]">
      {/* accent glow */}
      <div
        className={cn(
          "pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br opacity-40 blur-3xl transition-opacity duration-300 group-hover:opacity-70",
          service.gradient
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gradient-to-br text-gold-deep shadow-[inset_0_0_0_5px_rgba(193,145,47,0.08)]",
            service.gradient
          )}
          title={service.icon}
        >
          <VedicSymbol kind={getServiceSymbol(service.slug)} size="lg" strokeWidth={1.6} />
        </div>
        <PriceBadge price={service.price} discountPrice={service.discountPrice} />
      </div>

      <h3 className="relative mt-5 font-serif text-xl text-ink">
        <a
          href={`/services/${service.slug}`}
          className="after:absolute after:inset-0"
        >
          {service.title}
        </a>
      </h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">
        {service.shortDescription}
      </p>

      <div className="relative z-10 mt-6 grid gap-2 grid-cols-2">
        <Button href={`/services/${service.slug}`} variant="primary" size="md" className="w-full">
          Book
          <ArrowRight className="h-4 w-4" />
        </Button>
        <AskGurujiButton
          serviceTitle={service.title}
          className="w-full justify-center rounded-xl border border-gold/40 bg-[#3d1822]/80 text-[#ffe2a1] text-xs h-10 px-3 hover:bg-[#52202f]"
        >
          <MessageCircleMore className="h-3.5 w-3.5" /> Ask Guruji
        </AskGurujiButton>
      </div>

      {/* hover shine */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
    </article>
  );
}
