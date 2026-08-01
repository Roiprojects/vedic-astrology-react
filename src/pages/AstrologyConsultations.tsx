"use client";

import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { getServices } from "@/lib/data";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export default function AstrologyConsultations() {
  const services = getServices();

  return (
    <>
      <Helmet>
        <title>Premium Astrology Consultations — Vedic Astrology</title>
        <meta name="description" content="10 premium Vedic astrology consultation services for love, marriage, career, finance, family, health, education, business, and legal matters." />
        <link rel="canonical" href="/services/astrology-consultations" />
      </Helmet>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Astrology Consultations", url: "/services/astrology-consultations" },
        ])}
      />
      <PageHero
        eyebrow="Premium Consultations"
        title="Vedic Astrology Consultations"
        subtitle="Personalized, confidential guidance for every important area of your life — rooted in authentic Vedic wisdom."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Astrology Consultations" },
        ]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 0.05}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ContactCta
        title="Ready for Clarity?"
        subtitle="Book a consultation or chat with Guruji for personalized Vedic guidance."
      />
    </>
  );
}
