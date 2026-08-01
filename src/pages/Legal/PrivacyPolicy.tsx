"use client";

import { Helmet } from "react-helmet-async";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/effects/Reveal";
import { privacyPolicy } from "@/lib/data/legal";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — Vedic Astrology</title>
        <meta name="description" content="How Sampath Kumara Astrology handles your personal data, birth details, and privacy." />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy-policy" },
        ])}
      />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Your privacy is important to us."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy" },
        ]}
        seed={45}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-5 text-sm leading-relaxed text-muted">
          {privacyPolicy.map((section, i) => (
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
