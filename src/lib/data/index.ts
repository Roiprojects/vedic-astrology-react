/**
 * Data-access layer. Pages/components call ONLY these functions — never the raw
 * seed arrays. Today they return local seed data; when Supabase is connected,
 * swap each body for a Supabase query and every page keeps working unchanged.
 */
import { serviceCategories } from "./categories";
import { testimonials } from "./testimonials";
import { homeFaqs } from "./faqs";
import { services as seedServices } from "./services";
import { homams as seedHomams } from "./homams";
import {
  type PageContent,
  type PageId,
  PAGE_CONFIG,
} from "./pages-store";
import { birthChartReportIncludes } from "./content";
import { birthChartFaqs, chatFaqs } from "./faqs";
import type { Homam, Service, ServiceCategory, Testimonial } from "./types";

// ---- Re-export page types/constants for admin components ----
export { PAGE_CONFIG, isPageId, allPageIds, pageDefaults } from "./pages-store";
export type { PageId, PageContent } from "./pages-store";

// ---- Informational service pages (birth-chart / chat / palm) ----
const PAGE_DEFAULTS: Record<PageId, PageContent> = {
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
    subtitle:
      "Upload a photo of your palm and receive an instant Vedic palmistry reading — then go deeper with Guruji.",
    price: null,
    priceNote: "",
    includes: [],
    faqs: [],
  },
};

export function getPageContent(id: PageId): PageContent {
  return PAGE_DEFAULTS[id];
}

// ---- Service categories ----
export function getServiceCategories(): ServiceCategory[] {
  return [...serviceCategories].sort((a, b) => a.order - b.order);
}

// ---- Astrology services ----
// Reads seed data directly; swap for Supabase queries when ready.
export function getServices(): Service[] {
  return [...seedServices].filter((s) => s.active).sort((a, b) => a.order - b.order);
}

export function getFeaturedServices(limit = 6): Service[] {
  const list = seedServices
    .filter((s) => s.active && s.featured)
    .sort((a, b) => a.order - b.order);
  return (list.length ? list : seedServices).slice(0, limit);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return seedServices.find((s) => s.slug === slug && s.active);
}

export function getAllServiceSlugs(): string[] {
  return seedServices.map((s) => s.slug);
}

// ---- Astrology services (admin — includes inactive, unsorted by active) ----
export function getServicesForAdmin(): Service[] {
  return [...seedServices].sort((a, b) => a.order - b.order);
}

export function getServiceForAdmin(slug: string): Service | undefined {
  return seedServices.find((s) => s.slug === slug);
}

// ---- Homams ----
export function getHomams(): Homam[] {
  return [...seedHomams].filter((h) => h.active).sort((a, b) => a.order - b.order);
}

export function getFeaturedHomams(limit = 6): Homam[] {
  const list = seedHomams
    .filter((h) => h.active && h.featured)
    .sort((a, b) => a.order - b.order);
  return (list.length ? list : seedHomams).slice(0, limit);
}

export function getHomamBySlug(slug: string): Homam | undefined {
  return seedHomams.find((h) => h.slug === slug && h.active);
}

export function getAllHomamSlugs(): string[] {
  return seedHomams.map((h) => h.slug);
}

// ---- Homams (admin — includes inactive) ----
export function getHomamsForAdmin(): Homam[] {
  return [...seedHomams].sort((a, b) => a.order - b.order);
}

export function getHomamForAdmin(slug: string): Homam | undefined {
  return seedHomams.find((h) => h.slug === slug);
}

// ---- Testimonials ----
export function getTestimonials(): Testimonial[] {
  return [...testimonials].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedTestimonials(limit = 6): Testimonial[] {
  const list = testimonials.filter((t) => t.featured);
  return (list.length ? list : testimonials).slice(0, limit);
}

export function getHomeFaqs() {
  return [...homeFaqs];
}
