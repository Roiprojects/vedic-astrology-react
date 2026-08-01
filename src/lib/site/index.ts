/**
 * Central site configuration.
 * Safe public defaults. Real values come from env vars or the admin
 * `settings` table once Supabase is connected.
 */
import type { NavLink } from "./types";

const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "") || "919886100565";

export const siteConfig = {
  name: "Vedic Astrology",
  shortName: "Vedic Astrology",
  tagline: "Ancient Wisdom • Cosmic Guidance",
  guruji: "Sampath Kumara",
  gurujiPortrait: "/images/sampanth-guruji.png",
  description:
    "Authentic Vedic astrology consultations, birth chart analysis, sacred homams, and spiritual remedies by experienced Vedic astrologer Sampath Kumara.",
  url: import.meta.env.VITE_SITE_URL || "https://vedicastrology.example.com",
  phone: "+91 98861 00565",
  phoneHref: "tel:+919886100565",
  whatsapp: WHATSAPP_NUMBER,
  email: "guruji@vedicastrology.com",
  location:
    "No 100 21 st main 8thCross Rajarajeshwari nagar Bengaluru - 560098",
  workingHours: "Mon – Sun · 8:00 AM – 9:00 PM IST",
  mapQuery:
    "No 100 21 st main 8thCross Rajarajeshwari nagar Bengaluru - 560098",
  social: {
    facebook: "https://www.facebook.com/share/1EZYk4SBBW/",
    instagram: "https://www.instagram.com/sampathkumarakm?igsh=MXg5MThicWtxcG1vdQ==",
  },
  disclaimer:
    "Astrology provides spiritual guidance and indicative insights. Predictions are not guaranteed. For medical, legal, or financial decisions, please consult qualified professionals.",
} as const;

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Astrology Consultations",
        href: "/services/astrology-consultations",
        description: "Guidance for love, career, marriage & more",
      },
      {
        label: "Homam Bookings",
        href: "/homams",
        description: "15 sacred Vedic fire rituals",
      },
      {
        label: "Birth Chart PDF",
        href: "/birth-chart-pdf",
        description: "Detailed Vedic kundli report",
      },
      {
        label: "Chat with Guruji",
        href: "/chat-with-guruji",
        description: "Live Vedic guidance, first messages free",
      },
      {
        label: "Instant Palm Reader",
        href: "/palm-reading",
        description: "Instant reading from your palm photo",
      },
    ],
  },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact Us", href: "/contact-us" },
];

export const footerLinks = {
  quick: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact Us", href: "/contact-us" },
  ],
  services: [
    { label: "Astrology Consultations", href: "/services/astrology-consultations" },
    { label: "Sacred Homams", href: "/homams" },
    { label: "Birth Chart PDF", href: "/birth-chart-pdf" },
    { label: "Chat with Guruji", href: "/chat-with-guruji" },
    { label: "Instant Palm Reader", href: "/palm-reading" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Refund & Cancellation", href: "/refund-cancellation" },
  ],
};
