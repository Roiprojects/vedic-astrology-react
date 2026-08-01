import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { PAGE_CONFIG, allPageIds } from "@/lib/data";
import { getAdminHomams, getAdminServices } from "@/lib/supabase/admin-data";
import type { Homam, Service } from "@/lib/data/types";
import { Link } from "react-router-dom";
import { siteConfig } from "@/lib/site";

export default function AdminDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [homams, setHomams] = useState<Homam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminServices(), getAdminHomams()])
      .then(([nextServices, nextHomams]) => {
        setServices(nextServices);
        setHomams(nextHomams);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      href: "/admin/services",
      icon: "🔮",
      title: "Astrology Consultations",
      desc: loading ? "…" : `${services.length} services — full content, pricing, FAQs`,
    },
    {
      href: "/admin/homams",
      icon: "🔥",
      title: "Homam Bookings",
      desc: loading ? "…" : `${homams.length} homams — full content, pricing, FAQs`,
    },
    ...allPageIds().map((id) => ({
      href: `/admin/pages/${id}`,
      icon: id === "birth-chart-pdf" ? "📜" : id === "chat-with-guruji" ? "💬" : "✋",
      title: PAGE_CONFIG[id].label,
      desc: "Hero copy, content & FAQs",
    })),
  ];

  return (
    <div>
      <Helmet>
        <title>Dashboard — Admin — {siteConfig.name}</title>
      </Helmet>
      <h1 className="font-serif text-3xl text-ink">Services Admin</h1>
      <p className="mt-1 text-sm text-muted">
        Manage every section under the site&apos;s Services menu.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            to={c.href}
            className="group relative flex flex-col rounded-3xl border border-gold/20 bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-glow-gold)]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/20 bg-[#b67a1b]/[0.03] text-2xl">
              {c.icon}
            </span>
            <h2 className="mt-4 font-serif text-xl text-ink">{c.title}</h2>
            <p className="mt-1.5 flex-1 text-sm text-muted">{c.desc}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-light">
              Manage
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
