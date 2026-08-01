"use client";

import React from "react";
import { Helmet } from "react-helmet-async";
import { Clock, MessageCircleMore, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AskGurujiButton } from "@/components/ai/AskGurujiButton";
import { IconList } from "@/components/ui/IconList";
import { Reveal } from "@/components/effects/Reveal";
import { StarField } from "@/components/effects/StarField";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookingForm } from "@/components/forms/BookingForm";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { ContactCta } from "@/components/sections/ContactCta";
import { getHomamBySlug } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import { whatsappLink, cn } from "@/lib/utils";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/components/seo/JsonLd";

import { useParams, Navigate } from "react-router-dom";

export default function HomamDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [homam, setHomam] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (slug) {
      const h = getHomamBySlug(slug);
      setHomam(h || null);
      setLoading(false);
    }
  }, [slug]);

  if (loading) return <div className="container-x py-20 text-center">Loading...</div>;
  if (!homam) return <Navigate to="/not-found" replace />;

  const url = `${siteConfig.url}/homams/${homam.slug}`;
  const wa = whatsappLink(
    siteConfig.whatsapp,
    `Namaste Guruji, I would like to book the ${homam.title}.`
  );

  return (
    <>
      <Helmet>
        <title>{homam.title} — Vedic Astrology</title>
        <meta name="description" content={homam.shortBenefit} />
        <link rel="canonical" href={url} />
      </Helmet>
      <JsonLd
        data={serviceSchema({
          name: homam.title,
          description: homam.shortBenefit,
          price: homam.price,
          url,
        })}
      />
      <JsonLd data={faqSchema(homam.faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Homams", url: "/homams" },
          { name: homam.title, url: `/homams/${homam.slug}` },
        ])}
      />

      {/* Hero */}
      <section className="warm-band relative isolate overflow-hidden border-b border-gold/30 text-white">
        <StarField count={45} seed={homam.order + 4} />
        <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light [background:radial-gradient(70%_55%_at_50%_-5%,rgba(255,220,140,0.5),transparent_60%)]" />
        <Container className="relative grid items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <div className="[&_a]:text-[#f8ddad]/80 [&_a:hover]:text-white [&_span]:text-[#f8ddad]/55 [&_svg]:text-[#e6bd64]">
              <Breadcrumbs
                items={[
                  { name: "Home", href: "/" },
                  { name: "Homams", href: "/homams" },
                  { name: homam.title },
                ]}
              />
            </div>
            <Reveal>
              <div className="mt-5 flex items-center gap-3">
                <span
                  className={cn(
                    "grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-2xl ring-1 ring-gold/40",
                    homam.gradient
                  )}
                >
                  {homam.icon}
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="mt-5 font-serif text-4xl leading-tight text-[#fff8e8] sm:text-5xl">
                {homam.title}
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 max-w-xl leading-relaxed text-[#ffe6ad]">
                {homam.shortBenefit}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#ffd777]">
                <Clock className="h-4 w-4" /> {homam.duration}
              </div>
            </Reveal>
            <Reveal delay={0.22}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="#book" variant="primary" size="lg" className="w-full sm:w-auto">
                  Book Homam
                </Button>
                <AskGurujiButton serviceTitle={homam.title} className="w-full justify-center border border-[#f2c55e]/60 bg-[#8a2c12]/70 text-[#fff1c7] hover:bg-[#a4381a] sm:w-auto">
                  <MessageCircleMore className="h-5 w-5" /> Ask Guruji
                </AskGurujiButton>
                <Button href={wa} external variant="whatsapp" size="lg" className="w-full sm:w-auto">
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp Now
                </Button>
                <Button href={siteConfig.phoneHref} variant="gold" size="lg" className="w-full border-[#f2c55e]/50 bg-[#381523]/70 text-[#fff1c7] hover:bg-[#481c2e] sm:w-auto">
                  <Phone className="h-5 w-5" /> Call Now
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="relative">
              <div className="divine-glow absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-700/30 to-saffron-deep/20 blur-2xl" />
              <div className="relative rounded-[2rem] border border-gold/25 bg-[#3a151f]/75 p-8 text-center backdrop-blur-md">
                <div
                  className={cn(
                    "mx-auto grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br text-5xl ring-2 ring-gold/40",
                    homam.gradient
                  )}
                >
                  {homam.icon}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-[#fff2d0]/80">
                  {homam.fullDescription}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Benefits + Suitable for */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gold/20 bg-surface/50 p-7">
            <h3 className="font-serif text-2xl text-ink">Benefits</h3>
            <IconList className="mt-6" items={homam.benefits} />
          </div>
          <div className="rounded-3xl border border-gold/20 bg-surface/50 p-7">
            <h3 className="font-serif text-2xl text-ink">Suitable For</h3>
            <IconList className="mt-6" items={homam.suitableFor} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gold/20 bg-surface/50 p-7">
            <h3 className="font-serif text-xl text-ink">Pooja Items Included</h3>
            <IconList className="mt-5" items={homam.poojaItems} />
          </div>
          <div className="rounded-3xl border border-gold/20 bg-surface/50 p-7">
            <h3 className="font-serif text-xl text-ink">How Booking Works</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {homam.bookingInstructions}
            </p>
          </div>
        </div>
      </Section>

      {/* Booking form */}
      <Section id="book" className="scroll-mt-24 pt-0">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-9">
          <BookingForm variant="homam" subject={homam.title} />
        </div>
      </Section>

      {/* FAQ */}
      <Section className="pt-0">
        <SectionHeading eyebrow="FAQ" title="Questions About This Homam" />
        <div className="mt-10">
          <FaqAccordion items={homam.faqs} />
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
