import Image from "next/image";
import { Sparkles, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/effects/Reveal";
import { StarField } from "@/components/effects/StarField";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { heroContent, homeStats } from "@/lib/data/content";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <StarField count={70} seed={11} />

      {/* Rotating brand zodiac wheel */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 hidden -translate-y-1/2 opacity-[0.14] lg:block"
      >
        <div className="relative h-[42rem] w-[42rem] animate-spin-slow">
          <img
            src="/logo.jpg"
            alt=""
            width={672}
            height={672}
            loading="eager"
            className="rounded-full object-cover mix-blend-luminosity"
          />
        </div>
      </div>

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        {/* Left */}
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-[#b67a1b]/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-gold-light">
              <Sparkles className="h-3.5 w-3.5" />
              {siteConfig.tagline}
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
              Authentic <span className="text-gold-gradient">Vedic Astrology</span>{" "}
              Guidance for Every Soul
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted lg:mx-0 lg:text-lg">
              {heroContent.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start">
              <Button href="/contact-us" variant="primary" size="lg" className="w-full sm:w-auto">
                Book Consultation
              </Button>
              <Button
                href={whatsappLink(
                  siteConfig.whatsapp,
                  "Namaste Guruji, I would like astrology guidance."
                )}
                external
                variant="whatsapp"
                size="lg"
                className="w-full sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </Button>
              <Button href="/services" variant="gold" size="lg" className="w-full sm:w-auto">
                View Services
              </Button>
            </div>
          </Reveal>

          {/* mini stats */}
          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-start">
              {homeStats.slice(0, 3).map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="font-serif text-2xl text-gold-light">{s.value}</div>
                  <div className="text-xs uppercase tracking-wide text-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right — floating Guruji card */}
        <Reveal delay={0.2} className="mx-auto w-full max-w-sm">
          <div className="relative animate-float">
            <div className="divine-glow absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-saffron/25 to-gold/18 blur-2xl" />
            <div className="glass-card relative rounded-[2rem] p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-saffron-deep text-3xl ring-1 ring-gold/40">
                    🕉️
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex items-center gap-1 rounded-full bg-overlay px-2 py-0.5 text-[0.6rem] font-medium text-online ring-1 ring-online/40">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-online opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-online" />
                    </span>
                    Online
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gold">
                    Your Astrologer
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-ink">
                    {heroContent.gurujiName}
                  </h3>
                  <p className="text-sm text-online">{heroContent.gurujiStatus}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-gold/20 bg-[#b67a1b]/[0.035] px-4 py-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-sm text-muted">Trusted by 50,000+ souls</span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3">
                {homeStats.slice(0, 2).map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-gold/15 bg-[#b67a1b]/[0.025] px-4 py-3 text-center"
                  >
                    <dt className="font-serif text-xl text-gold-light">{s.value}</dt>
                    <dd className="text-[0.7rem] uppercase tracking-wide text-faint">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </dl>

              <Button
                href="/chat-with-guruji"
                variant="primary"
                size="md"
                className="mt-5 w-full"
              >
                Start Free Chat
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
