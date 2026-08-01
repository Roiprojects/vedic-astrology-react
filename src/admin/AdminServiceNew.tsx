import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { getServicesForAdmin } from "@/lib/data";
import { ServiceForm } from "@/components/admin/ServiceForm";
import type { Service } from "@/lib/data/types";

export default async function AdminServiceNew() {
  const services = await getServicesForAdmin();
  const nextOrder = services.reduce((max, s) => Math.max(max, s.order), 0) + 1;

  const blank: Service = {
    slug: "",
    title: "",
    categorySlug: "astrology-consultations",
    icon: "\uD83D\uDD2E",
    shortDescription: "",
    fullDescription: "",
    problem: "",
    price: 0,
    discountPrice: null,
    duration: "20\u201330 min consultation",
    gradient: "from-amber-500/30 to-orange-600/30",
    analysis: [],
    receive: [],
    benefits: [],
    remedies: [],
    faqs: [],
    featured: false,
    order: nextOrder,
    active: true,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Helmet>
        <title>New Service \u2014 Vedic Astrology Admin</title>
      </Helmet>
      <Link
        to="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to services
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">New service</h1>
      <p className="mt-1 text-sm text-muted">Add a new astrology service to the site.</p>

      <ServiceForm mode="create" initial={blank} />
    </div>
  );
}
