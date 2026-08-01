-- ============================================================================
-- Vedic Astrology — core schema (18 tables + RLS)
-- Apply order: run this file first, then 0002_storage_and_seed.sql
-- Safe to run once on a fresh project. All tables use UUID PKs + timestamps.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type booking_status as enum ('new','contacted','confirmed','completed','cancelled');
create type payment_status as enum ('pending','submitted','verified','failed','refunded');
create type payment_method as enum ('razorpay','upi','manual_screenshot','cash');
create type enquiry_status as enum ('new','read','responded','archived');
create type birth_chart_status as enum ('new','processing','delivered','cancelled');

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- 1. admin_roles
create table public.admin_roles (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  description text,
  permissions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. admin_users
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role_id uuid references public.admin_roles(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. users (site customers)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. pages (static/legal/marketing pages)
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text,
  meta jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. home_sections (editable homepage blocks)
create table public.home_sections (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  title text,
  subtitle text,
  content jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. service_categories
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  icon text,
  href text,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category_id uuid references public.service_categories(id) on delete set null,
  category_slug text,
  icon text,
  short_description text,
  full_description text,
  problem text,
  price integer not null default 0,
  discount_price integer,
  duration text,
  gradient text,
  analysis text[] not null default '{}',
  receive text[] not null default '{}',
  benefits text[] not null default '{}',
  remedies text[] not null default '{}',
  faqs jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. homams
create table public.homams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  short_benefit text,
  full_description text,
  price integer not null default 0,
  discount_price integer,
  duration text,
  gradient text,
  benefits text[] not null default '{}',
  suitable_for text[] not null default '{}',
  pooja_items text[] not null default '{}',
  booking_instructions text,
  faqs jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. birth_chart_requests
create table public.birth_chart_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  dob date,
  tob time,
  pob text,
  gender text,
  notes text,
  status birth_chart_status not null default 'new',
  pdf_path text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null
    default ('BK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  variant text not null default 'consultation',
  service_id uuid references public.services(id) on delete set null,
  homam_id uuid references public.homams(id) on delete set null,
  subject text,
  customer_name text not null,
  phone text not null,
  email text,
  dob date,
  tob time,
  pob text,
  gender text,
  preferred_date text,
  preferred_mode text,
  message text,
  amount integer,
  status booking_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. payments
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  amount integer not null default 0,
  currency text not null default 'INR',
  method payment_method,
  status payment_status not null default 'pending',
  provider_reference text,
  screenshot_path text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  rating integer not null default 5 check (rating between 1 and 5),
  service_type text,
  text text not null,
  date date not null default current_date,
  avatar_initial text,
  image_path text,
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 13. contact_enquiries
create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  subject text,
  message text,
  service_interested text,
  status enquiry_status not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 14. faqs
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'general',
  question text not null,
  answer text not null,
  service_id uuid references public.services(id) on delete cascade,
  homam_id uuid references public.homams(id) on delete cascade,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 15. media_library
create table public.media_library (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  filename text,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  uploaded_by uuid references public.admin_users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- 16. settings
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_at timestamptz not null default now()
);

-- 17. seo_settings
create table public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  path text unique not null,
  title text,
  description text,
  keywords text[] not null default '{}',
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 18. audit_logs
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.admin_users(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  changes jsonb,
  ip text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'admin_roles','admin_users','users','pages','home_sections','service_categories',
    'services','homams','birth_chart_requests','bookings','payments','testimonials',
    'contact_enquiries','faqs','settings','seo_settings'
  ] loop
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Admin check helper (security definer so it can read admin_users under RLS)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql security definer stable
set search_path = public as $$
  select exists (
    select 1 from public.admin_users au
    where au.user_id = auth.uid() and au.active
  );
$$;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index on public.services (active, display_order);
create index on public.services (category_slug);
create index on public.services (featured);
create index on public.homams (active, display_order);
create index on public.homams (featured);
create index on public.testimonials (active, featured, display_order);
create index on public.bookings (status, created_at desc);
create index on public.bookings (service_id);
create index on public.bookings (homam_id);
create index on public.payments (booking_id, status);
create index on public.contact_enquiries (status, created_at desc);
create index on public.birth_chart_requests (status, created_at desc);
create index on public.faqs (category, active);
create index on public.faqs (service_id);
create index on public.faqs (homam_id);
create index on public.audit_logs (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
--   * anon/authenticated: read active public content only
--   * admins (in admin_users): full access via is_admin()
--   * service_role bypasses RLS entirely (used by server API routes)
-- ---------------------------------------------------------------------------
alter table public.admin_roles           enable row level security;
alter table public.admin_users           enable row level security;
alter table public.users                 enable row level security;
alter table public.pages                 enable row level security;
alter table public.home_sections         enable row level security;
alter table public.service_categories    enable row level security;
alter table public.services              enable row level security;
alter table public.homams                enable row level security;
alter table public.birth_chart_requests  enable row level security;
alter table public.bookings              enable row level security;
alter table public.payments              enable row level security;
alter table public.testimonials          enable row level security;
alter table public.contact_enquiries     enable row level security;
alter table public.faqs                  enable row level security;
alter table public.media_library         enable row level security;
alter table public.settings              enable row level security;
alter table public.seo_settings          enable row level security;
alter table public.audit_logs            enable row level security;

-- Public-readable content (active rows) + full admin management.
do $$
declare t text;
begin
  foreach t in array array[
    'service_categories','services','homams','testimonials','faqs','pages','home_sections'
  ] loop
    execute format(
      'create policy "%1$s_public_read" on public.%1$I
         for select to anon, authenticated using (active = true);', t);
    execute format(
      'create policy "%1$s_admin_all" on public.%1$I
         for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;

-- Public config (settings, seo) — readable by everyone, writable by admins.
create policy "settings_public_read" on public.settings
  for select to anon, authenticated using (true);
create policy "settings_admin_all" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "seo_public_read" on public.seo_settings
  for select to anon, authenticated using (true);
create policy "seo_admin_all" on public.seo_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Admin-only tables (no public access; writes from server use service_role).
do $$
declare t text;
begin
  foreach t in array array[
    'admin_roles','admin_users','users','birth_chart_requests','bookings',
    'payments','contact_enquiries','media_library','audit_logs'
  ] loop
    execute format(
      'create policy "%1$s_admin_all" on public.%1$I
         for all to authenticated using (public.is_admin()) with check (public.is_admin());', t);
  end loop;
end $$;
