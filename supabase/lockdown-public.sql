-- Run once in the Supabase SQL editor for the live project.
-- Removes public/anonymous access to CRM tables. Safe to run more than once.
-- The website form still saves through the server service role.

revoke all on table public.admin_profiles from anon, public;
revoke all on table public.inquiries from anon, public;
revoke all on table public.contacts from anon, public;
revoke all on table public.deals from anon, public;
revoke all on table public.bookings from anon, public;
