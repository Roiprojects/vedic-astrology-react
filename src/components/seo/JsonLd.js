import { jsx as _jsx } from "react/jsx-runtime";
import { siteConfig } from "@/lib/site";
/** Renders a JSON-LD <script> block. */
export function JsonLd({ data }) {
    return (_jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: { __html: JSON.stringify(data) } }));
}
export function localBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        image: `${siteConfig.url}/logo.jpg`,
        priceRange: "₹₹",
        areaServed: "IN",
        slogan: siteConfig.tagline,
    };
}
export function faqSchema(faqs) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
    };
}
export function serviceSchema({ name, description, price, url, }) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: name,
        name,
        description,
        url,
        provider: {
            "@type": "LocalBusiness",
            name: siteConfig.name,
            url: siteConfig.url,
        },
        areaServed: "IN",
        ...(price != null
            ? {
                offers: {
                    "@type": "Offer",
                    price,
                    priceCurrency: "INR",
                },
            }
            : {}),
    };
}
export function breadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.name,
            item: `${siteConfig.url}${it.url}`,
        })),
    };
}
