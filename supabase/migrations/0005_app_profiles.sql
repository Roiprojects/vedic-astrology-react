-- App user profiles, saved insights, conversation archive, and push tokens.
-- Linked to Supabase Auth. RLS restricts each user to their own rows.

create table if not exists public.app_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  phone text,
  birth_name text,
  dob date,
  tob text,
  pob text,
  gender text,
  language text,
  intention text,
  sun_sign text,
  moon_sign text,
  ascendant text,
  nakshatra text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_insights (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_conversations (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.device_push_tokens (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null,
  platform text not null,
  topics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, token)
);

create index if not exists saved_insights_user_id_created_at_idx
  on public.saved_insights (user_id, created_at desc);

create index if not exists ai_conversations_user_id_updated_at_idx
  on public.ai_conversations (user_id, updated_at desc);

create index if not exists device_push_tokens_user_id_idx
  on public.device_push_tokens (user_id);

alter table public.app_profiles enable row level security;
alter table public.saved_insights enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.device_push_tokens enable row level security;

create policy "app_profiles_own_select"
  on public.app_profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "app_profiles_own_insert"
  on public.app_profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "app_profiles_own_update"
  on public.app_profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "saved_insights_own_select"
  on public.saved_insights for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "saved_insights_own_insert"
  on public.saved_insights for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "saved_insights_own_delete"
  on public.saved_insights for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "ai_conversations_own_select"
  on public.ai_conversations for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "ai_conversations_own_insert"
  on public.ai_conversations for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "ai_conversations_own_update"
  on public.ai_conversations for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "device_push_tokens_own_select"
  on public.device_push_tokens for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "device_push_tokens_own_insert"
  on public.device_push_tokens for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "device_push_tokens_own_delete"
  on public.device_push_tokens for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on table
  public.app_profiles,
  public.saved_insights,
  public.ai_conversations,
  public.device_push_tokens
to authenticated;
