-- ============================================================================
-- Sports Finder MVP — schema
-- Tables: profiles, sports, venues, events, event_participants,
--         event_messages, reviews, reports
-- Designed badminton-first but generalizable to other sports.
-- ============================================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type skill_level as enum ('beginner', 'casual', 'intermediate', 'competitive');
create type event_status as enum ('open', 'full', 'cancelled', 'completed');
create type participant_status as enum ('joined', 'waitlisted', 'cancelled', 'attended', 'no_show');
create type report_target as enum ('user', 'event');

-- ---------------------------------------------------------------------------
-- profiles  (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                   uuid primary key references auth.users (id) on delete cascade,
  display_name         text not null,
  avatar_url           text,
  bio                  text,
  suburb               text,
  university           text,
  skill_level          skill_level not null default 'beginner',
  preferred_sports     text[] not null default array['badminton'],
  attendance_count     integer not null default 0,
  no_show_count        integer not null default 0,
  hosted_events_count  integer not null default 0,
  created_at           timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- sports
-- ---------------------------------------------------------------------------
create table public.sports (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,
  slug  text not null unique
);

-- ---------------------------------------------------------------------------
-- venues  (lat/lng stored manually — no geocoding in v1)
-- ---------------------------------------------------------------------------
create table public.venues (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  address          text,
  suburb           text not null,
  latitude         double precision,
  longitude        double precision,
  google_maps_url  text,
  price_hint       text,
  created_at       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table public.events (
  id                 uuid primary key default gen_random_uuid(),
  host_id            uuid not null references public.profiles (id) on delete cascade,
  sport_id           uuid not null references public.sports (id),
  venue_id           uuid references public.venues (id),
  title              text not null,
  description        text,
  start_at           timestamptz not null,
  end_at             timestamptz,
  price_cents        integer not null default 0 check (price_cents >= 0),
  capacity           integer not null check (capacity > 0),
  min_players        integer not null default 1 check (min_players > 0),
  skill_level        skill_level not null default 'casual',
  beginner_friendly  boolean not null default false,
  rules              text,
  status             event_status not null default 'open',
  created_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- event_participants
-- ---------------------------------------------------------------------------
create table public.event_participants (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references public.events (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  status     participant_status not null default 'joined',
  joined_at  timestamptz not null default now(),
  unique (event_id, user_id) -- prevents duplicate joins
);

-- ---------------------------------------------------------------------------
-- event_messages
-- ---------------------------------------------------------------------------
create table public.event_messages (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.events (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  body        text not null check (length(trim(body)) > 0),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- reviews  (event/host focused in v1)
-- ---------------------------------------------------------------------------
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events (id) on delete cascade,
  reviewer_id  uuid not null references public.profiles (id) on delete cascade,
  reviewee_id  uuid not null references public.profiles (id) on delete cascade,
  rating       integer not null check (rating between 1 and 5),
  tags         text[] not null default '{}',
  comment      text,
  created_at   timestamptz not null default now(),
  unique (event_id, reviewer_id, reviewee_id)
);

-- ---------------------------------------------------------------------------
-- reports
-- ---------------------------------------------------------------------------
create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references public.profiles (id) on delete cascade,
  target_type  report_target not null,
  target_id    uuid not null,
  reason       text not null,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index idx_events_status            on public.events (status);
create index idx_events_start_at          on public.events (start_at);
create index idx_events_venue             on public.events (venue_id);
create index idx_events_host              on public.events (host_id);
create index idx_participants_event       on public.event_participants (event_id);
create index idx_participants_user        on public.event_participants (user_id);
create index idx_messages_event           on public.event_messages (event_id);
create index idx_reviews_event            on public.reviews (event_id);
create index idx_reviews_reviewee         on public.reviews (reviewee_id);
create index idx_venues_suburb            on public.venues (suburb);
