"use client";

import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { termsAndConditions } from "@/lib/data/legal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export default function TermsAndConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions — Vedic Astrology</title>
        <meta name="description" content="Read the terms and conditions for Vedic astrology consultations, homam bookings, and kundli PDF reports at Sampath Kumara Astrology." />
        <link rel="canonical" href="/terms-and-conditions" />
      </Helmet>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Terms & Conditions", url: "/terms-and-conditions" },
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Rules that govern our consultations, bookings, and services."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Terms & Conditions" },
        ]}
        seed={43}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-sm leading-relaxed text-muted">
          {termsAndConditions.map((section, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <div>
                <h3 className="font-semibold text-ink">{section.heading}</h3>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="mt-2">{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
