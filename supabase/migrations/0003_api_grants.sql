-- ============================================================================
-- Vedic Astrology - API grants for Supabase Data API / static hosting
-- Run after 0001_init.sql and 0002_storage_and_seed.sql.
--
-- RLS policies in 0001 still decide which rows are visible/editable. These
-- grants only expose the tables to the anon/authenticated PostgREST roles.
-- Public form writes continue to go through Edge Functions using service_role.
-- ============================================================================

grant usage on schema public to anon, authenticated;

grant select on table
  public.service_categories,
  public.services,
  public.homams,
  public.testimonials,
  public.faqs,
  public.pages,
  public.home_sections,
  public.settings,
  public.seo_settings
to anon, authenticated;

grant select, insert, update, delete on table
  public.admin_roles,
  public.admin_users,
  public.users,
  public.service_categories,
  public.services,
  public.homams,
  public.birth_chart_requests,
  public.bookings,
  public.payments,
  public.testimonials,
  public.contact_enquiries,
  public.faqs,
  public.pages,
  public.home_sections,
  public.media_library,
  public.settings,
  public.seo_settings,
  public.audit_logs
to authenticated;

grant usage on schema storage to anon, authenticated;
grant select on table storage.objects to anon, authenticated;
grant select, insert, update, delete on table storage.objects to authenticated;
