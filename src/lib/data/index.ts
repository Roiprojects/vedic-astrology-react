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
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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

function mapServiceRow(row: Record<string, any>): Service {
  return {
    slug: row.slug,
    title: row.title,
    categorySlug: row.category_slug ?? "",
    icon: row.icon ?? "🔮",
    shortDescription: row.short_description ?? "",
    fullDescription: row.full_description ?? "",
    problem: row.problem ?? "",
    price: row.price ?? 0,
    discountPrice: row.discount_price,
    duration: row.duration ?? "",
    gradient: row.gradient ?? "",
    analysis: row.analysis ?? [],
    receive: row.receive ?? [],
    benefits: row.benefits ?? [],
    remedies: row.remedies ?? [],
    faqs: row.faqs ?? [],
    featured: row.featured ?? false,
    order: row.display_order ?? 0,
    active: row.active ?? true,
  };
}

function mapHomamRow(row: Record<string, any>): Homam {
  return {
    slug: row.slug,
    name: row.name,
    icon: row.icon ?? "🔥",
    shortBenefit: row.short_benefit ?? "",
    fullDescription: row.full_description ?? "",
    price: row.price ?? 0,
    discountPrice: row.discount_price,
    duration: row.duration ?? "",
    gradient: row.gradient ?? "",
    benefits: row.benefits ?? [],
    suitableFor: row.suitable_for ?? [],
    poojaItems: row.pooja_items ?? [],
    bookingInstructions: row.booking_instructions ?? "",
    faqs: row.faqs ?? [],
    featured: row.featured ?? false,
    order: row.display_order ?? 0,
    active: row.active ?? true,
  };
}

function mapCategoryRow(row: Record<string, any>): ServiceCategory {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    icon: row.icon ?? "🔮",
    href: row.href ?? `/services/${row.slug}`,
    order: row.display_order ?? 0,
  };
}

function mapTestimonialRow(row: Record<string, any>): Testimonial {
  return {
    id: row.id,
    name: row.name,
    location: row.location ?? "",
    rating: row.rating ?? 5,
    serviceType: row.service_type ?? "all",
    text: row.text,
    date: row.date ?? "",
    avatarInitial: row.avatar_initial ?? row.name?.[0] ?? "G",
    featured: row.featured ?? false,
  };
}

function canUseSupabase() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export async function getPageContent(id: PageId): Promise<PageContent> {
  if (!canUseSupabase()) return PAGE_DEFAULTS[id];
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.from("pages").select("content").eq("slug", id).maybeSingle();
    if (error) throw error;
    const content = data?.content && typeof data.content === "object" ? data.content : {};
    return { ...PAGE_DEFAULTS[id], ...content } as PageContent;
  } catch {
    return PAGE_DEFAULTS[id];
  }
}

// ---- Service categories ----
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  if (!canUseSupabase()) return [...serviceCategories].sort((a, b) => a.order - b.order);
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapCategoryRow);
  } catch {
    return [...serviceCategories].sort((a, b) => a.order - b.order);
  }
}

// ---- Astrology services ----
export async function getServices(): Promise<Service[]> {
  if (!canUseSupabase()) return [...seedServices].filter((s) => s.active).sort((a, b) => a.order - b.order);
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapServiceRow);
  } catch {
    return [...seedServices].filter((s) => s.active).sort((a, b) => a.order - b.order);
  }
}

export async function getFeaturedServices(limit = 6): Promise<Service[]> {
  if (canUseSupabase()) {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .limit(limit);
      if (error) throw error;
      if (data?.length) return data.map(mapServiceRow);
    } catch {
      // Fall through to seed data.
    }
  }
  const list = seedServices
    .filter((s) => s.active && s.featured)
    .sort((a, b) => a.order - b.order);
  return (list.length ? list : seedServices).slice(0, limit);
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  if (canUseSupabase()) {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.from("services").select("*").eq("slug", slug).eq("active", true).maybeSingle();
      if (error) throw error;
      if (data) return mapServiceRow(data);
    } catch {
      // Fall through to seed data.
    }
  }
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
export async function getHomams(): Promise<Homam[]> {
  if (!canUseSupabase()) return [...seedHomams].filter((h) => h.active).sort((a, b) => a.order - b.order);
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("homams")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapHomamRow);
  } catch {
    return [...seedHomams].filter((h) => h.active).sort((a, b) => a.order - b.order);
  }
}

export async function getFeaturedHomams(limit = 6): Promise<Homam[]> {
  if (canUseSupabase()) {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("homams")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .limit(limit);
      if (error) throw error;
      if (data?.length) return data.map(mapHomamRow);
    } catch {
      // Fall through to seed data.
    }
  }
  const list = seedHomams
    .filter((h) => h.active && h.featured)
    .sort((a, b) => a.order - b.order);
  return (list.length ? list : seedHomams).slice(0, limit);
}

export async function getHomamBySlug(slug: string): Promise<Homam | undefined> {
  if (canUseSupabase()) {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.from("homams").select("*").eq("slug", slug).eq("active", true).maybeSingle();
      if (error) throw error;
      if (data) return mapHomamRow(data);
    } catch {
      // Fall through to seed data.
    }
  }
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
export async function getTestimonials(): Promise<Testimonial[]> {
  if (!canUseSupabase()) return [...testimonials].sort((a, b) => (a.date < b.date ? 1 : -1));
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("active", true)
      .order("date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapTestimonialRow);
  } catch {
    return [...testimonials].sort((a, b) => (a.date < b.date ? 1 : -1));
  }
}

export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  if (canUseSupabase()) {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("active", true)
        .eq("featured", true)
        .order("display_order", { ascending: true })
        .limit(limit);
      if (error) throw error;
      if (data?.length) return data.map(mapTestimonialRow);
    } catch {
      // Fall through to seed data.
    }
  }
  const list = testimonials.filter((t) => t.featured);
  return (list.length ? list : testimonials).slice(0, limit);
}

export function getHomeFaqs() {
  return [...homeFaqs];
}
