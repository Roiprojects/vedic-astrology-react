-- ============================================================================
-- Vedic Astrology — storage buckets, storage policies, and config seed
-- Run AFTER 0001_init.sql.
-- Full services/homams/testimonials seed is loaded separately from the app's
-- typed seed data (POST /api/admin/seed) to stay in sync with the codebase.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Storage buckets (5 public, 2 private, 1 general)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('logos',               'logos',               true),
  ('service-images',      'service-images',      true),
  ('homam-images',        'homam-images',        true),
  ('guruji-images',       'guruji-images',       true),
  ('testimonial-images',  'testimonial-images',  true),
  ('birth-chart-pdfs',    'birth-chart-pdfs',    false),
  ('payment-screenshots', 'payment-screenshots', false),
  ('general-media',       'general-media',       true)
on conflict (id) do nothing;

-- Public read for public buckets; admins manage everything.
-- (Private buckets — birth-chart-pdfs, payment-screenshots — are served via
--  signed URLs from the server using the service_role key.)
create policy "storage_public_read" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id in (
      'logos','service-images','homam-images',
      'guruji-images','testimonial-images','general-media'
    )
  );

create policy "storage_admin_manage" on storage.objects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed: admin roles
-- ---------------------------------------------------------------------------
insert into public.admin_roles (key, name, description, permissions) values
  ('super_admin','Super Admin','Full access to all admin features and data.', '{"all": true}'::jsonb),
  ('editor','Editor','Manage content: services, homams, testimonials, pages, FAQs.', '{"content": true}'::jsonb),
  ('viewer','Viewer','Read-only access to bookings, enquiries and payments.', '{"read": true}'::jsonb)
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Seed: site settings
-- ---------------------------------------------------------------------------
insert into public.settings (key, value, description) values
  ('contact',
   jsonb_build_object(
     'phone','+91 98861 00565',
     'phoneHref','tel:+919886100565',
     'whatsapp','919886100565',
     'email','guruji@vedicastrology.com'
   ),
   'Primary contact details shown across the site'),
  ('brand',
   jsonb_build_object(
     'name','Vedic Astrology',
     'tagline','Ancient Wisdom • Cosmic Guidance',
     'guruji','Sampath Kumara'
   ),
   'Brand identity'),
  ('social',
   jsonb_build_object('youtube','#','instagram','#','facebook','#'),
   'Social profile links')
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Seed: service categories
-- ---------------------------------------------------------------------------
insert into public.service_categories (slug, name, description, icon, href, display_order) values
  ('astrology-consultations','Premium Astrology Consultations',
   'Personalized Vedic guidance for love, marriage, career, finance, health, and life decisions.',
   '🔮','/services/astrology-consultations',1),
  ('homam-bookings','Sacred Homam Bookings',
   'Book authentic Vedic fire rituals for prosperity, peace, protection, health, and success.',
   '🔥','/homams',2),
  ('birth-chart-pdf','Birth Chart PDF Reports',
   'A detailed Vedic kundli report prepared from your exact birth details.',
   '📜','/birth-chart-pdf',3),
  ('chat-with-guruji','Live Chat with Guruji',
   'Get live Vedic guidance directly from Guruji — first few messages free.',
   '💬','/chat-with-guruji',4)
on conflict (slug) do nothing;
