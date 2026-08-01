"use client";

import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { refundPolicy } from "@/lib/data/legal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export default function RefundCancellation() {
  return (
    <>
      <Helmet>
        <title>Refund & Cancellation — Vedic Astrology</title>
        <meta name="description" content="Refund and cancellation policy for Vedic astrology consultations, homams, and kundli reports." />
        <link rel="canonical" href="/refund-cancellation" />
      </Helmet>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Refund & Cancellation", url: "/refund-cancellation" },
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Refund & Cancellation Policy"
        subtitle="Understand our fair policy for services and consultations."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Refund & Cancellation" },
        ]}
        seed={47}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-sm leading-relaxed text-muted">
          {refundPolicy.map((section, i) => (
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
