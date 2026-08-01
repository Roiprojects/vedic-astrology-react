"use client";

import { Helmet } from "react-helmet-async";
import { TempleHome } from "@/components/sections/TempleHome";
import { getHomeFaqs } from "@/lib/data";
import { JsonLd, localBusinessSchema, faqSchema } from "@/components/seo/JsonLd";

export default function HomePage() {
  const homeFaqs = getHomeFaqs();

  return (
    <>
      <Helmet>
        <title>Vedic Astrology — Sampath Kumara | Authentic Guidance</title>
        <meta name="description" content="Authentic Vedic astrology consultations, birth chart analysis, sacred homams, and spiritual remedies by Sampath Kumara." />
        <link rel="canonical" href="/" />
      </Helmet>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={faqSchema(homeFaqs)} />
      <TempleHome />
    </>
  );
}
