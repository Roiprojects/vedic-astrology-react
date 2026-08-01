export type NavLink = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export type Service = {
  id?: string;
  title: string;
  slug: string;
  eyebrow?: string;
  description?: string;
  price: number | null;
  priceNote?: string;
  includes?: string[];
  icon: string;
  order: number;
  active: boolean;
  featured: boolean;
  categorySlug?: string;
  shortDescription?: string;
  fullDescription?: string;
  problem?: string;
  duration?: string;
  gradient?: string;
  analysis?: string[];
  receive?: string[];
  benefits?: string[];
  remedies?: string[];
  faqs?: Faq[];
  discountPrice?: number | null;
};

export type Homam = {
  id: string;
  title: string;
  slug: string;
  eyebrow: string;
  description: string;
  price: number | null;
  priceNote: string;
  includes: string[];
  duration: string;
  order: number;
  active: boolean;
  featured: boolean;
  icon?: string;
  shortBenefit?: string;
  fullDescription?: string;
  gradient?: string;
  benefits?: string[];
  suitableFor?: string[];
  poojaItems?: string[];
  bookingInstructions?: string;
  faqs?: Faq[];
  discountPrice?: number | null;
  name?: string;
};

export type ServiceCategory = {
  id?: string;
  slug: string;
  label?: string;
  name: string;
  description?: string;
  icon?: string;
  href: string;
  order: number;
};

export type Faq = {
  id?: string;
  question: string;
  answer: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  text: string;
  serviceType: string;
  rating: number;
  date: string;
  featured: boolean;
  avatarInitial?: string;
};

export type PageContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  price: number | null;
  priceNote: string;
  includes: string[];
  faqs: Faq[];
};

export type PageId = "birth-chart-pdf" | "chat-with-guruji" | "palm-reading";

export type TrustHighlight = {
  icon: string;
  title: string;
  description: string;
};

export type Offering = {
  title: string;
  description: string;
  icon: string;
  cta: string;
  href: string;
  gradient: string;
  price?: string;
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
  icon: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type ValueCard = {
  icon: string;
  title: string;
  description: string;
};
