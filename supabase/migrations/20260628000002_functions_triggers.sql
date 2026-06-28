-- ============================================================================
-- Functions & triggers
--  - auto-create profile on signup
--  - keep reliability counters in sync
--  - membership helper used by message RLS
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Create a profile row whenever a new auth user signs up.
-- display_name is taken from sign-up metadata, falling back to the email local part.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, suburb, university)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'suburb',
    new.raw_user_meta_data->>'university'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Bump the host's hosted_events_count when an event is created.
-- ---------------------------------------------------------------------------
create or replace function public.handle_event_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set hosted_events_count = hosted_events_count + 1
   where id = new.host_id;
  return new;
end;
$$;

create trigger on_event_created
  after insert on public.events
  for each row execute function public.handle_event_created();

-- ---------------------------------------------------------------------------
-- Keep attendance_count / no_show_count in sync as a participant's status
-- moves into (or out of) 'attended' / 'no_show'. Fires on insert and update
-- so both the live app and the seed file populate counters correctly.
-- ---------------------------------------------------------------------------
create or replace function public.handle_participant_attendance()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_status participant_status := case when tg_op = 'UPDATE' then old.status else null end;
begin
  -- remove previous contribution (update only)
  if old_status = 'attended' then
    update public.profiles set attendance_count = greatest(attendance_count - 1, 0) where id = old.user_id;
  elsif old_status = 'no_show' then
    update public.profiles set no_show_count = greatest(no_show_count - 1, 0) where id = old.user_id;
  end if;

  -- add new contribution
  if new.status = 'attended' then
    update public.profiles set attendance_count = attendance_count + 1 where id = new.user_id;
  elsif new.status = 'no_show' then
    update public.profiles set no_show_count = no_show_count + 1 where id = new.user_id;
  end if;

  return new;
end;
$$;

create trigger on_participant_attendance
  after insert or update of status on public.event_participants
  for each row execute function public.handle_participant_attendance();

-- ---------------------------------------------------------------------------
-- Membership helper (security definer to avoid recursive RLS).
-- True if the user hosts the event OR has a non-cancelled participant row.
-- Used by event_messages RLS so only joined users + host can read/post.
-- ---------------------------------------------------------------------------
create or replace function public.is_event_member(p_event_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.events e
     where e.id = p_event_id and e.host_id = p_user_id
  ) or exists (
    select 1 from public.event_participants ep
     where ep.event_id = p_event_id
       and ep.user_id = p_user_id
       and ep.status <> 'cancelled'
  );
$$;
