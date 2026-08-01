/**
 * Type definitions and static defaults for the three informational "service" pages
 * (Birth Chart PDF, Chat with Guruji, AI Palm Reader).
 *
 * The mutable, file-backed read/write functions live in
 * `server/lib/data/pages-store.ts` (uses node:fs — server-only).
 */
import { birthChartReportIncludes } from "./content";
import { birthChartFaqs, chatFaqs } from "./faqs";
export const PAGE_CONFIG = {
    "birth-chart-pdf": { label: "Birth Chart PDF", href: "/birth-chart-pdf", pricing: true, includes: true, faqs: true },
    "chat-with-guruji": { label: "Chat with Guruji", href: "/chat-with-guruji", pricing: false, includes: false, faqs: true },
    "palm-reading": { label: "Palm Reader", href: "/palm-reading", pricing: false, includes: false, faqs: false },
};
const DEFAULTS = {
    "birth-chart-pdf": {
        eyebrow: "Vedic Kundli Report",
        title: "Birth Chart PDF",
        subtitle: "Get a detailed Vedic kundli report prepared with your birth details.",
        price: 500,
        priceNote: "Delivered in 24–48 hours",
        includes: birthChartReportIncludes,
        faqs: birthChartFaqs,
    },
    "chat-with-guruji": {
        eyebrow: "Live Guidance",
        title: "Chat with Guruji",
        subtitle: "Get live Vedic guidance directly from Guruji.",
        price: null,
        priceNote: "",
        includes: [],
        faqs: chatFaqs,
    },
    "palm-reading": {
        eyebrow: "Instant Analysis",
        title: "Instant Palm Reader",
        subtitle: "Upload a photo of your palm and receive an instant Vedic palmistry reading — then go deeper with Guruji.",
        price: null,
        priceNote: "",
        includes: [],
        faqs: [],
    },
};
export function isPageId(id) {
    return id in PAGE_CONFIG;
}
export function allPageIds() {
    return Object.keys(PAGE_CONFIG);
}
export function pageDefaults(id) {
    return DEFAULTS[id];
}
