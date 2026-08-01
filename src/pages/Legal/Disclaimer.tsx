"use client";

import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustHighlights } from "@/components/sections/TrustHighlights";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { ContactCta } from "@/components/sections/ContactCta";
import { disclaimerContent } from "@/lib/data/legal";
import { getHomeFaqs } from "@/lib/data";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export default function DisclaimerPage() {
  const homeFaqs = getHomeFaqs();
  return (
    <>
      <Helmet>
        <title>Disclaimer — Vedic Astrology</title>
        <meta name="description" content="Read the disclaimer for Vedic astrology consultations, homam bookings, kundli reports, and palm readings at Sampath Kumara Astrology." />
        <link rel="canonical" href="/disclaimer" />
      </Helmet>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Disclaimer", url: "/disclaimer" },
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Disclaimer"
        subtitle="Important information about our astrology services."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Disclaimer" },
        ]}
        seed={41}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-sm leading-relaxed text-muted">
          {disclaimerContent.map((section, i) => (
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

      <TrustHighlights />

      <ContactCta
        title="Questions? Reach Out"
        subtitle="Contact Guruji for any queries before booking a consultation or homam."
      />
    </>
  );
}
