-- ============================================================================
-- Row Level Security policies
-- Read access is public where it powers browsing; writes are scoped to the
-- owning user (and the event host for attendance marking).
-- ============================================================================

alter table public.profiles            enable row level security;
alter table public.sports              enable row level security;
alter table public.venues              enable row level security;
alter table public.events              enable row level security;
alter table public.event_participants  enable row level security;
alter table public.event_messages      enable row level security;
alter table public.reviews             enable row level security;
alter table public.reports             enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "profiles_select_all"
  on public.profiles for select using (true);

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- sports (read-only to clients; managed via seed / service role)
-- ---------------------------------------------------------------------------
create policy "sports_select_all"
  on public.sports for select using (true);

-- ---------------------------------------------------------------------------
-- venues (readable by all; authenticated users may add a venue when creating
-- an event, since v1 has no separate venue-admin flow)
-- ---------------------------------------------------------------------------
create policy "venues_select_all"
  on public.venues for select using (true);

create policy "venues_insert_authenticated"
  on public.venues for insert to authenticated with check (auth.uid() is not null);

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create policy "events_select_all"
  on public.events for select using (true);

create policy "events_insert_host"
  on public.events for insert to authenticated with check (auth.uid() = host_id);

create policy "events_update_host"
  on public.events for update to authenticated using (auth.uid() = host_id);

create policy "events_delete_host"
  on public.events for delete to authenticated using (auth.uid() = host_id);

-- ---------------------------------------------------------------------------
-- event_participants
--  - anyone can read (powers "x/y joined" counts and player lists)
--  - a user manages their own row; the event host may update rows to mark
--    attendance / no-show
-- ---------------------------------------------------------------------------
create policy "participants_select_all"
  on public.event_participants for select using (true);

create policy "participants_insert_own"
  on public.event_participants for insert to authenticated
  with check (auth.uid() = user_id);

create policy "participants_update_self_or_host"
  on public.event_participants for update to authenticated
  using (
    auth.uid() = user_id
    or auth.uid() = (select host_id from public.events where id = event_id)
  );

create policy "participants_delete_own"
  on public.event_participants for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- event_messages (joined users + host only)
-- ---------------------------------------------------------------------------
create policy "messages_select_members"
  on public.event_messages for select to authenticated
  using (public.is_event_member(event_id, auth.uid()));

create policy "messages_insert_members"
  on public.event_messages for insert to authenticated
  with check (auth.uid() = user_id and public.is_event_member(event_id, auth.uid()));

-- ---------------------------------------------------------------------------
-- reviews (public read; author-only write)
-- ---------------------------------------------------------------------------
create policy "reviews_select_all"
  on public.reviews for select using (true);

create policy "reviews_insert_own"
  on public.reviews for insert to authenticated
  with check (auth.uid() = reviewer_id);

-- ---------------------------------------------------------------------------
-- reports (author may create and read their own; no public read)
-- ---------------------------------------------------------------------------
create policy "reports_insert_own"
  on public.reports for insert to authenticated
  with check (auth.uid() = reporter_id);

create policy "reports_select_own"
  on public.reports for select to authenticated
  using (auth.uid() = reporter_id);
