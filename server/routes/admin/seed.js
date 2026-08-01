/**
 * Admin Seed route — Express port of app/api/admin/seed/route.ts
 *
 * One-shot seeder: pushes typed seed content into Supabase.
 * Admin-only (protected by adminAuthMiddleware).
 */
import { createClient } from "@supabase/supabase-js";
import { readServicesRaw } from "$lib/data/services-store";
import { homams } from "$lib/data/homams";
import { testimonials } from "$lib/data/testimonials";
import { serviceCategories } from "$lib/data/categories";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
function getAdminSupabase() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        throw new Error("Set SUPABASE_SERVICE_ROLE_KEY in .env.local before seeding.");
    }
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
        auth: { persistSession: false },
    });
}
export async function POST(_req, res) {
    let supabase;
    try {
        supabase = getAdminSupabase();
    }
    catch (err) {
        return res.status(500).json({
            error: "Set SUPABASE_SERVICE_ROLE_KEY in .env.local before seeding.",
        });
    }
    const services = await readServicesRaw();
    const categoryRows = serviceCategories.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        icon: c.icon,
        href: c.href,
        display_order: c.order,
    }));
    const serviceRows = services.map((s) => ({
        slug: s.slug,
        title: s.title,
        category_slug: s.categorySlug,
        icon: s.icon,
        short_description: s.shortDescription,
        full_description: s.fullDescription,
        problem: s.problem,
        price: s.price,
        discount_price: s.discountPrice ?? null,
        duration: s.duration,
        gradient: s.gradient,
        analysis: s.analysis,
        receive: s.receive,
        benefits: s.benefits,
        remedies: s.remedies,
        faqs: s.faqs,
        featured: s.featured,
        display_order: s.order,
        active: s.active,
    }));
    const homamRows = homams.map((h) => ({
        slug: h.slug,
        name: h.name,
        icon: h.icon,
        short_benefit: h.shortBenefit,
        full_description: h.fullDescription,
        price: h.price,
        discount_price: h.discountPrice ?? null,
        duration: h.duration,
        gradient: h.gradient,
        benefits: h.benefits,
        suitable_for: h.suitableFor,
        pooja_items: h.poojaItems,
        booking_instructions: h.bookingInstructions,
        faqs: h.faqs,
        featured: h.featured,
        display_order: h.order,
        active: h.active,
    }));
    const testimonialRows = testimonials.map((t, i) => ({
        name: t.name,
        location: t.location,
        rating: t.rating,
        service_type: t.serviceType,
        text: t.text,
        date: t.date,
        avatar_initial: t.avatarInitial,
        featured: t.featured,
        active: true,
        display_order: i,
    }));
    const cat = await supabase.from("service_categories").upsert(categoryRows, { onConflict: "slug" });
    if (cat.error) {
        return res.status(500).json({ step: "service_categories", error: cat.error.message });
    }
    const svc = await supabase.from("services").upsert(serviceRows, { onConflict: "slug" });
    if (svc.error) {
        return res.status(500).json({ step: "services", error: svc.error.message });
    }
    const hom = await supabase.from("homams").upsert(homamRows, { onConflict: "slug" });
    if (hom.error) {
        return res.status(500).json({ step: "homams", error: hom.error.message });
    }
    const { count } = await supabase.from("testimonials").select("*", { count: "exact", head: true });
    let testimonialsSeeded = "skipped (already present)";
    if (!count) {
        const tst = await supabase.from("testimonials").insert(testimonialRows);
        if (tst.error) {
            return res.status(500).json({ step: "testimonials", error: tst.error.message });
        }
        testimonialsSeeded = testimonialRows.length;
    }
    return res.json({
        ok: true,
        seeded: {
            categories: categoryRows.length,
            services: serviceRows.length,
            homams: homamRows.length,
            testimonials: testimonialsSeeded,
        },
    });
}
