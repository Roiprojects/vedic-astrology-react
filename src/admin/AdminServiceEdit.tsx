import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getServiceForAdmin } from "@/lib/data";
import { ServiceForm } from "@/components/admin/ServiceForm";

"use client";

export default function AdminServiceEdit() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (slug) {
      getServiceForAdmin(slug).then((s) => {
        setService(s || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="container-x py-20 text-center">Loading…</div>;
  if (!service) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <Helmet>
        <title>Edit \u00B7 {service.title} \u2014 Vedic Astrology Admin</title>
      </Helmet>
      <Link
        to="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to services
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">Edit service</h1>
      <p className="mt-1 text-sm text-muted">
        Editing <span className="font-medium text-ink">{service.title}</span>
      </p>

      <ServiceForm mode="edit" initial={service} />
    </div>
  );
}
