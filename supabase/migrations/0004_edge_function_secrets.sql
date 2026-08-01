-- ============================================================================
-- Vedic Astrology - private Edge Function configuration fallback
-- Run after 0003_api_grants.sql.
--
-- This table is intentionally not granted to anon/authenticated users. Edge
-- Functions read it using SUPABASE_SERVICE_ROLE_KEY when Supabase function
-- secrets are unavailable in the hosted runtime.
-- ============================================================================

create table if not exists public.edge_function_secrets (
  name text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.edge_function_secrets enable row level security;

drop trigger if exists set_updated_at on public.edge_function_secrets;
create trigger set_updated_at
  before update on public.edge_function_secrets
  for each row execute function public.set_updated_at();

revoke all on table public.edge_function_secrets from anon, authenticated;
grant select, insert, update, delete on table public.edge_function_secrets to service_role;
