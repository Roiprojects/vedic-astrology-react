import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { PageTransition } from "@/components/layout/PageTransition";
import { ServiceAiChat } from "@/components/ai/ServiceAiChat";
import AdminLayout from "@/admin/AdminLayout";
// ── Pages ──────────────────────────────────────────────────
import HomePage from "@/pages/HomePage";
import AboutUs from "@/pages/AboutUs";
import ServicesPage from "@/pages/ServicesPage";
import AstrologyConsultations from "@/pages/AstrologyConsultations";
import ServiceDetail from "@/pages/ServiceDetail";
import HomamsPage from "@/pages/HomamsPage";
import HomamDetail from "@/pages/HomamDetail";
import BirthChartPdf from "@/pages/BirthChartPdf";
import ChatWithGuruji from "@/pages/ChatWithGuruji";
import PalmReading from "@/pages/PalmReading";
import Testimonials from "@/pages/Testimonials";
import ContactUs from "@/pages/ContactUs";
import Disclaimer from "@/pages/Legal/Disclaimer";
import TermsAndConditions from "@/pages/Legal/TermsAndConditions";
import PrivacyPolicy from "@/pages/Legal/PrivacyPolicy";
import RefundCancellation from "@/pages/Legal/RefundCancellation";
import NotFound from "@/pages/NotFound";
// ── Admin pages ────────────────────────────────────────────
import AdminLogin from "@/admin/AdminLogin";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminServices from "@/admin/AdminServices";
import AdminServiceNew from "@/admin/AdminServiceNew";
import AdminServiceEdit from "@/admin/AdminServiceEdit";
import AdminHomams from "@/admin/AdminHomams";
import AdminHomamNew from "@/admin/AdminHomamNew";
import AdminHomamEdit from "@/admin/AdminHomamEdit";
import AdminPages from "@/admin/AdminPages";
function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}
// ── Admin layout wrapper (renders AdminLayout + child route) ──
function AdminLayoutRoute() {
    return (_jsx(AdminLayout, { children: _jsx(Outlet, {}) }));
}
export function App() {
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("html", { lang: "en" }), _jsx("meta", { name: "theme-color", content: "#faf4e8" }), _jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), _jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }), _jsx("link", { href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap", rel: "stylesheet" })] }), _jsx(ScrollToTop, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/admin/login", element: _jsx(AdminLogin, {}) }), _jsxs(Route, { element: _jsx(AdminLayoutRoute, {}), children: [_jsx(Route, { path: "/admin/dashboard", element: _jsx(AdminDashboard, {}) }), _jsx(Route, { path: "/admin/services", element: _jsx(AdminServices, {}) }), _jsx(Route, { path: "/admin/services/new", element: _jsx(AdminServiceNew, {}) }), _jsx(Route, { path: "/admin/services/:slug", element: _jsx(AdminServiceEdit, {}) }), _jsx(Route, { path: "/admin/homams", element: _jsx(AdminHomams, {}) }), _jsx(Route, { path: "/admin/homams/new", element: _jsx(AdminHomamNew, {}) }), _jsx(Route, { path: "/admin/homams/:slug", element: _jsx(AdminHomamEdit, {}) }), _jsx(Route, { path: "/admin/pages/:page", element: _jsx(AdminPages, {}) }), _jsx(Route, { path: "/admin", element: _jsx(Navigate, { to: "dashboard", replace: true }) })] }), _jsxs(Route, { element: _jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx("main", { className: "flex-1 pt-20 lg:pt-24", children: _jsx(PageTransition, { children: _jsx(Outlet, {}) }) }), _jsx(Footer, {}), _jsx(FloatingWhatsApp, {}), _jsx(ServiceAiChat, {})] }), children: [_jsx(Route, { index: true, element: _jsx(HomePage, {}) }), _jsx(Route, { path: "about-us", element: _jsx(AboutUs, {}) }), _jsx(Route, { path: "services", element: _jsx(ServicesPage, {}) }), _jsx(Route, { path: "services/astrology-consultations", element: _jsx(AstrologyConsultations, {}) }), _jsx(Route, { path: "services/:slug", element: _jsx(ServiceDetail, {}) }), _jsx(Route, { path: "homams", element: _jsx(HomamsPage, {}) }), _jsx(Route, { path: "homams/:slug", element: _jsx(HomamDetail, {}) }), _jsx(Route, { path: "birth-chart-pdf", element: _jsx(BirthChartPdf, {}) }), _jsx(Route, { path: "chat-with-guruji", element: _jsx(ChatWithGuruji, {}) }), _jsx(Route, { path: "palm-reading", element: _jsx(PalmReading, {}) }), _jsx(Route, { path: "testimonials", element: _jsx(Testimonials, {}) }), _jsx(Route, { path: "contact-us", element: _jsx(ContactUs, {}) }), _jsx(Route, { path: "disclaimer", element: _jsx(Disclaimer, {}) }), _jsx(Route, { path: "terms-and-conditions", element: _jsx(TermsAndConditions, {}) }), _jsx(Route, { path: "privacy-policy", element: _jsx(PrivacyPolicy, {}) }), _jsx(Route, { path: "refund-cancellation", element: _jsx(RefundCancellation, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] })] })] }));
}
