import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LogoutButton } from "@/components/admin/LogoutButton";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-overlay/85 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo href="/admin/dashboard" compact size={40} />
            <span className="hidden rounded-full border border-gold/25 px-2.5 py-0.5 text-[0.7rem] font-medium uppercase tracking-wide text-gold-light sm:inline">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <Link
              to="/admin/dashboard"
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/services"
              className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink sm:inline"
            >
              Services
            </Link>
            <Link
              to="/admin/homams"
              className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink sm:inline"
            >
              Homams
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink md:inline"
            >
              View site
            </a>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </>
  );
}
