import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { getHomamsForAdmin } from "@/lib/data";
import { HomamForm } from "@/components/admin/HomamForm";
import type { Homam } from "@/lib/data/types";

export default async function AdminHomamNew() {
  const homams = await getHomamsForAdmin();
  const nextOrder = homams.reduce((max, h) => Math.max(max, h.order), 0) + 1;

  const blank: Homam = {
    slug: "",
    name: "",
    icon: "\uD83D\uDD25",
    shortBenefit: "",
    fullDescription: "",
    price: 0,
    discountPrice: null,
    duration: "2\u20133 hours",
    gradient: "from-orange-500/30 to-red-600/30",
    benefits: [],
    suitableFor: [],
    poojaItems: [],
    bookingInstructions: "",
    faqs: [],
    featured: false,
    order: nextOrder,
    active: true,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Helmet>
        <title>New Homam \u2014 Vedic Astrology Admin</title>
      </Helmet>
      <Link to="/admin/homams" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        Back to homams
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">New homam</h1>
      <p className="mt-1 text-sm text-muted">Add a new sacred fire ritual to the site.</p>
      <HomamForm mode="create" initial={blank} />
    </div>
  );
}
