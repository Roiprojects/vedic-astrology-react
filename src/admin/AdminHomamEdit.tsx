import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getHomamForAdmin } from "@/lib/data";
import { HomamForm } from "@/components/admin/HomamForm";

"use client";

export default function AdminHomamEdit() {
  const { slug } = useParams<{ slug: string }>();
  const [homam, setHomam] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (slug) {
      getHomamForAdmin(slug).then((h) => {
        setHomam(h || null);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="container-x py-20 text-center">Loading…</div>;
  if (!homam) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <Helmet>
        <title>Edit \u00B7 {homam.name} \u2014 Vedic Astrology Admin</title>
      </Helmet>
      <Link to="/admin/homams" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        Back to homams
      </Link>
      <h1 className="mt-4 font-serif text-3xl text-ink">Edit homam</h1>
      <p className="mt-1 text-sm text-muted">
        Editing <span className="font-medium text-ink">{homam.name}</span>
      </p>
      <HomamForm mode="edit" initial={homam} />
    </div>
  );
}
