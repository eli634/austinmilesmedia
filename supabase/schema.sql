-- Austin Miles Media Admin CRM MVP
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create type public.inquiry_status as enum (
  'new',
  'reviewed',
  'promoted',
  'archived'
);

create type public.deal_status as enum (
  'new_inquiry',
  'contacted',
  'call_booked',
  'proposal_sent',
  'won',
  'lost'
);

create type public.booking_status as enum (
  'scheduled',
  'completed',
  'cancelled'
);

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status public.inquiry_status not null default 'new',
  business_type text,
  goal text,
  name text not null,
  business text,
  handle text,
  email text not null,
  phone text,
  message text,
  source text not null default 'get-started',
  raw_payload jsonb not null default '{}'::jsonb
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  inquiry_id uuid references public.inquiries(id) on delete set null,
  name text not null,
  business text,
  email text not null,
  phone text,
  handle text,
  business_type text,
  notes text
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contact_id uuid references public.contacts(id) on delete set null,
  inquiry_id uuid references public.inquiries(id) on delete set null,
  title text not null,
  status public.deal_status not null default 'new_inquiry',
  value numeric(12, 2),
  next_follow_up date,
  notes text
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deal_id uuid references public.deals(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status public.booking_status not null default 'scheduled',
  location text,
  notes text
);

create index inquiries_created_at_idx on public.inquiries(created_at desc);
create index inquiries_status_idx on public.inquiries(status);
create index contacts_email_idx on public.contacts(email);
create index deals_status_idx on public.deals(status);
create index deals_next_follow_up_idx on public.deals(next_follow_up);
create index bookings_starts_at_idx on public.bookings(starts_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

create trigger deals_set_updated_at
before update on public.deals
for each row execute function public.set_updated_at();

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = auth.uid()
  );
$$;

alter table public.admin_profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.contacts enable row level security;
alter table public.deals enable row level security;
alter table public.bookings enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.admin_profiles to authenticated;
grant all on public.admin_profiles to service_role;
grant all on public.inquiries to authenticated, service_role;
grant all on public.contacts to authenticated, service_role;
grant all on public.deals to authenticated, service_role;
grant all on public.bookings to authenticated, service_role;

create policy "Admins can view admin profiles"
on public.admin_profiles
for select
to authenticated
using (public.is_admin());

create policy "Admins can manage inquiries"
on public.inquiries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage contacts"
on public.contacts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage deals"
on public.deals
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage bookings"
on public.bookings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- After creating Austin's Supabase Auth user, run:
-- insert into public.admin_profiles (id, email, name)
-- values ('AUTH_USER_UUID_HERE', 'austin@example.com', 'Austin Miles');
