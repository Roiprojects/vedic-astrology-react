"use client";

import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { HomamCard } from "@/components/cards/HomamCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { getHomams } from "@/lib/data";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export default function HomamsPage() {
  const homams = getHomams();

  return (
    <>
      <Helmet>
        <title>15 Vedic Homams — Vedic Astrology</title>
        <meta name="description" content="Book authentic Vedic fire rituals (homams) for prosperity, peace, protection, health, and success — performed with proper Vedic procedure." />
        <link rel="canonical" href="/homams" />
      </Helmet>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Homams", url: "/homams" },
        ])}
      />
      <PageHero
        eyebrow="Sacred Fire Rituals"
        title="15 Vedic Homams"
        subtitle="Book authentic Vedic fire rituals for prosperity, peace, protection, health, and success."
        breadcrumbs={[{ name: "Home", href: "/" }, { name: "Homams" }]}
        seed={17}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {homams.map((homam, i) => (
            <Reveal key={homam.slug} delay={(i % 3) * 0.05} className="h-full">
              <HomamCard homam={homam} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ContactCta
        title="Need Help Choosing a Homam?"
        subtitle="Message Guruji and he will recommend the right ritual for your need and an auspicious date."
      />
    </>
  );
}
