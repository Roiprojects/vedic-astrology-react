import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { pageDefaults } from "@/lib/data/pages-store";
function mapService(row) {
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
function toServiceRow(service) {
    return {
        slug: service.slug,
        title: service.title,
        category_slug: service.categorySlug,
        icon: service.icon,
        short_description: service.shortDescription,
        full_description: service.fullDescription,
        problem: service.problem,
        price: service.price,
        discount_price: service.discountPrice ?? null,
        duration: service.duration,
        gradient: service.gradient,
        analysis: service.analysis,
        receive: service.receive,
        benefits: service.benefits,
        remedies: service.remedies,
        faqs: service.faqs,
        featured: service.featured,
        display_order: service.order,
        active: service.active,
    };
}
function mapHomam(row) {
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
function toHomamRow(homam) {
    return {
        slug: homam.slug,
        name: homam.name,
        icon: homam.icon,
        short_benefit: homam.shortBenefit,
        full_description: homam.fullDescription,
        price: homam.price,
        discount_price: homam.discountPrice ?? null,
        duration: homam.duration,
        gradient: homam.gradient,
        benefits: homam.benefits,
        suitable_for: homam.suitableFor,
        pooja_items: homam.poojaItems,
        booking_instructions: homam.bookingInstructions,
        faqs: homam.faqs,
        featured: homam.featured,
        display_order: homam.order,
        active: homam.active,
    };
}
export async function getAdminServices() {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true })
        .order("title", { ascending: true });
    if (error)
        throw error;
    return data.map(mapService);
}
export async function getAdminService(slug) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
    if (error)
        throw error;
    return data ? mapService(data) : null;
}
export async function saveAdminService(service) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("services").upsert(toServiceRow(service), { onConflict: "slug" });
    if (error)
        throw error;
}
export async function deleteAdminService(slug) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("services").delete().eq("slug", slug);
    if (error)
        throw error;
}
export async function getAdminHomams() {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
        .from("homams")
        .select("*")
        .order("display_order", { ascending: true })
        .order("name", { ascending: true });
    if (error)
        throw error;
    return data.map(mapHomam);
}
export async function getAdminHomam(slug) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.from("homams").select("*").eq("slug", slug).maybeSingle();
    if (error)
        throw error;
    return data ? mapHomam(data) : null;
}
export async function saveAdminHomam(homam) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("homams").upsert(toHomamRow(homam), { onConflict: "slug" });
    if (error)
        throw error;
}
export async function deleteAdminHomam(slug) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("homams").delete().eq("slug", slug);
    if (error)
        throw error;
}
export async function getAdminPageContent(pageId) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.from("pages").select("content").eq("slug", pageId).maybeSingle();
    if (error)
        throw error;
    const content = data?.content && typeof data.content === "object" ? data.content : {};
    return { ...pageDefaults(pageId), ...content };
}
export async function saveAdminPageContent(pageId, content) {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("pages").upsert({
        slug: pageId,
        title: content.title,
        content,
        active: true,
    }, { onConflict: "slug" });
    if (error)
        throw error;
}
