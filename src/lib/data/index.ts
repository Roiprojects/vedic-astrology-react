import { serviceCategories } from "./categories";
import { testimonials } from "./testimonials";
import { homeFaqs } from "./faqs";
import { services as seedServices } from "./services";
import { homams as seedHomams } from "./homams";
import { birthChartReportIncludes } from "./content";
import { birthChartFaqs, chatFaqs } from "./faqs";
import type { Faq, Homam, PageContent, PageId, Service, ServiceCategory, Testimonial } from "./types";

export type { Faq, Homam, PageContent, PageId, Service, ServiceCategory, Testimonial } from "./types";

const DEFAULTS: Record<PageId, PageContent> = {
  "birth-chart-pdf": { eyebrow: "Vedic Kundli Report", title: "Birth Chart PDF", subtitle: "Get a detailed Vedic kundli report prepared with your birth details.", price: 500, priceNote: "Delivered in 24–48 hours", includes: birthChartReportIncludes, faqs: birthChartFaqs },
  "chat-with-guruji": { eyebrow: "Live Guidance", title: "Chat with Guruji", subtitle: "Get live Vedic guidance directly from Guruji.", price: null, priceNote: "", includes: [], faqs: chatFaqs },
  "palm-reading": { eyebrow: "Instant Analysis", title: "Instant Palm Reader", subtitle: "Upload a photo of your palm and receive an instant Vedic palmistry reading.", price: null, priceNote: "", includes: [], faqs: [] },
};

export function isPageId(id: string): id is PageId { return id in DEFAULTS; }
export function allPageIds(): PageId[] { return Object.keys(DEFAULTS) as PageId[]; }
export function pageDefaults(id: PageId): PageContent { return DEFAULTS[id]; }

export function getPageContent(id: PageId): PageContent { return DEFAULTS[id]; }
export function getServiceCategories(): ServiceCategory[] { return [...serviceCategories].sort((a, b) => a.order - b.order); }
export function getServices(): Service[] { return [...seedServices].filter(s => s.active).sort((a, b) => a.order - b.order); }
export function getFeaturedServices(limit = 6): Service[] { const list = [...seedServices].filter(s => s.active && s.featured).sort((a, b) => a.order - b.order); return (list.length ? list : seedServices).slice(0, limit); }
export function getServiceBySlug(slug: string): Service | undefined { return seedServices.find(s => s.slug === slug && s.active); }
export function getAllServiceSlugs(): string[] { return seedServices.filter(s => s.active).map(s => s.slug); }
export function getServicesForAdmin(): Service[] { return [...seedServices].sort((a, b) => a.order - b.order); }
export function getServiceForAdmin(slug: string): Service | undefined { return seedServices.find(s => s.slug === slug); }
export function getHomams(): Homam[] { return [...seedHomams].filter(h => h.active).sort((a, b) => a.order - b.order); }
export function getFeaturedHomams(limit = 6): Homam[] { const list = [...seedHomams].filter(h => h.active && h.featured).sort((a, b) => a.order - b.order); return (list.length ? list : seedHomams).slice(0, limit); }
export function getHomamBySlug(slug: string): Homam | undefined { return seedHomams.find(h => h.slug === slug && h.active); }
export function getAllHomamSlugs(): string[] { return seedHomams.filter(h => h.active).map(h => h.slug); }
export function getHomamsForAdmin(): Homam[] { return [...seedHomams].sort((a, b) => a.order - b.order); }
export function getHomamForAdmin(slug: string): Homam | undefined { return seedHomams.find(h => h.slug === slug); }
export function getTestimonials(): Testimonial[] { return [...testimonials].sort((a, b) => (a.date < b.date ? 1 : -1)); }
export function getFeaturedTestimonials(limit = 6): Testimonial[] { const list = testimonials.filter(t => t.featured); return (list.length ? list : testimonials).slice(0, limit); }
export function getHomeFaqs(): Faq[] { return [...homeFaqs]; }
