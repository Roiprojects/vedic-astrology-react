import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getPageContent } from "@/lib/data";
import { isPageId, PAGE_CONFIG } from "@/lib/data/pages-store";
import { PageContentForm } from "@/components/admin/PageContentForm";

"use client";

export default function AdminPages() {
  const { page } = useParams<{ page: string }>();
  const [content, setContent] = React.useState<any>(null);
  const [config, setConfig] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!page || !isPageId(page)) {
      setLoading(false);
      return;
    }
    getPageContent(page).then((c) => {
      setContent(c);
      setConfig(PAGE_CONFIG[page]);
      setLoading(false);
    });
  }, [page]);

  if (loading) return <div className="container-x py-20 text-center">Loading…</div>;
  if (!content || !config || !isPageId(page || "")) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <Helmet>
        <title>Edit \u00B7 {config.label} \u2014 Vedic Astrology Admin</title>
      </Helmet>
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-ink">{config.label}</h1>
        <a href={config.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gold-light hover:text-gold">
          View page <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <p className="mt-1 text-sm text-muted">Edit the hero and content shown on this page.</p>

      <PageContentForm pageId={page} initial={content} config={config} />
    </div>
  );
}
