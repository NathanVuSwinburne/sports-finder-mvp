-- ============================================================================
-- Grant the Supabase API roles access to the public schema.
--
-- Supabase usually applies these grants automatically, but on some projects
-- new tables end up with no privileges for anon/authenticated/service_role,
-- which surfaces as "permission denied for table ..." (SQLSTATE 42501) from
-- both the app and any service-role script.
--
-- Row Level Security still restricts what anon/authenticated can see/do;
-- service_role bypasses RLS. So granting broadly here is safe.
-- ============================================================================

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines  in schema public to anon, authenticated, service_role;

-- Make sure anything created later is granted too.
alter default privileges in schema public grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on routines  to anon, authenticated, service_role;

-- Nudge PostgREST to refresh its schema cache.
notify pgrst, 'reload schema';
