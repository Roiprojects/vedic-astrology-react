import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { isPageId, PAGE_CONFIG } from "@/lib/data";
import { getAdminPageContent } from "@/lib/supabase/admin-data";
import { PageContentForm } from "@/components/admin/PageContentForm";
import { Link, useParams } from "react-router-dom";
import { siteConfig } from "@/lib/site";
export default function AdminPagesPage() {
    const { page: pageParam } = useParams();
    const page = pageParam ?? "";
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!page || !isPageId(page)) {
            setContent(null);
            setLoading(false);
            return;
        }
        getAdminPageContent(page)
            .then(setContent)
            .finally(() => setLoading(false));
    }, [page]);
    if (loading) {
        return _jsx("div", { className: "mx-auto max-w-3xl", children: _jsx("p", { className: "text-muted", children: "Loading\u2026" }) });
    }
    if (!content || !isPageId(page)) {
        return (_jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx("p", { className: "text-muted", children: "Page not found." }), _jsx(Link, { to: "/admin", className: "text-gold-light underline", children: "Back to dashboard" })] }));
    }
    const config = PAGE_CONFIG[page];
    return (_jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx(Helmet, { children: _jsxs("title", { children: ["Edit \u00B7 ", config.label, " \u2014 Admin \u2014 ", siteConfig.name] }) }), _jsxs(Link, { to: "/admin", className: "inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "Back to dashboard"] }), _jsxs("div", { className: "mt-4 flex flex-wrap items-center justify-between gap-3", children: [_jsx("h1", { className: "font-serif text-3xl text-ink", children: config.label }), _jsxs(Link, { to: config.href, target: "_blank", className: "inline-flex items-center gap-1.5 text-sm text-gold-light hover:text-gold", children: ["View page ", _jsx(ExternalLink, { className: "h-3.5 w-3.5" })] })] }), _jsx("p", { className: "mt-1 text-sm text-muted", children: "Edit the hero and content shown on this page." }), _jsx(PageContentForm, { pageId: page, initial: content, config: config })] }));
}
