import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { PageTransition } from "@/components/layout/PageTransition";
import { ServiceAiChat } from "@/components/ai/ServiceAiChat";
import AdminLayout from "@/admin/AdminLayout";

// Pages
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

// Admin
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

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 lg:pt-24">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ServiceAiChat />
    </>
  );
}

function AdminLayoutRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export function App() {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <meta name="theme-color" content="#faf4e8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminLayoutRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/services/new" element={<AdminServiceNew />} />
          <Route path="/admin/services/:slug" element={<AdminServiceEdit />} />
          <Route path="/admin/homams" element={<AdminHomams />} />
          <Route path="/admin/homams/new" element={<AdminHomamNew />} />
          <Route path="/admin/homams/:slug" element={<AdminHomamEdit />} />
          <Route path="/admin/pages/:page" element={<AdminPages />} />
          <Route path="/admin" element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/astrology-consultations" element={<AstrologyConsultations />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="homams" element={<HomamsPage />} />
          <Route path="homams/:slug" element={<HomamDetail />} />
          <Route path="birth-chart-pdf" element={<BirthChartPdf />} />
          <Route path="chat-with-guruji" element={<ChatWithGuruji />} />
          <Route path="palm-reading" element={<PalmReading />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="refund-cancellation" element={<RefundCancellation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
