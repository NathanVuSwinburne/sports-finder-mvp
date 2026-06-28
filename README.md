# 🏸 Sports Finder MVP

**Find beginner-friendly badminton sessions near you — with clear price, location, skill level, and people who actually show up.**

A reliability-first social sports web app for Melbourne international students and newcomers. Facebook groups are messy and people RSVP but don't show. Sports Finder fixes that with clear skill levels, transparent pricing, confirmed spots, beginner-friendly tagging, and a host/player **show-up score**.

> **v1 focuses on badminton.** The data model is built to add basketball, soccer, pickleball, volleyball and futsal later — without a rewrite.

---

## ✨ MVP features

- Landing page explaining the product and why it beats Facebook groups
- Email/password authentication (Supabase) with protected pages
- Browse & filter sessions (suburb, skill level, date, price, beginner-friendly)
- Event detail pages with venue, host reliability, players, waitlist, map link, directions & add-to-calendar
- Create events (badminton-first, generalizable) with a public-venue safety prompt
- Join / waitlist / leave flow with capacity rules, no duplicate joins, and automatic waitlist promotion
- Per-event message board (host + joined players only)
- **Reliability system**: show-up score, "New player" / "Reliable host" badges, host marks attendance
- Post-event reviews (rating + tags + comment)
- Safety: report user/event, block placeholder, community guidelines, public-venue warnings
- Seed data so the app never looks empty

## 🧱 Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — Postgres + Auth + Row Level Security
- **Leaflet / react-leaflet** for an optional venue map (OSM demo tiles)
- Mobile-first responsive UI

## 🗺️ Maps & location (no paid APIs)

- Suburb-based filtering is the **primary** location feature.
- Venue lat/lng are stored manually in seed/create data — **no geocoding, no Nominatim calls**.
- Optional Leaflet map for a venue — **OSM demo tiles only**; production should use a proper or self-hosted tile provider.
- Directions = a generated **Google Maps search URL** from venue + suburb (a plain link, not the Maps API).

## 🚀 Setup

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local       # then fill in your Supabase keys (see below)

# 3. Set up the database (see "Database setup")

# 4. Run
npm run dev                      # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm run start` (serve build), `npm run lint`.

## 🔑 Environment variables

Copy [`.env.example`](./.env.example) → `.env.local` and fill in:

| Variable | Required | Where to find it |
|----------|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase → Project Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase → Project Settings → API Keys → anon / publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | Supabase → Project Settings → API Keys → service_role |
| `NEXT_PUBLIC_SITE_URL` | optional | App base URL (default `http://localhost:3000`) |

**Never commit `.env.local` or real keys.** It's already gitignored.

## 🗄️ Database setup

All SQL lives in [`supabase/`](./supabase). Apply it via the **Supabase SQL Editor** (simplest) or the CLI — full instructions in [`supabase/README.md`](./supabase/README.md).

Run **in order**:

1. `supabase/migrations/20260628000001_schema.sql` — tables, enums, indexes
2. `supabase/migrations/20260628000002_functions_triggers.sql` — profile auto-create, reliability counters, membership helper
3. `supabase/migrations/20260628000003_rls.sql` — Row Level Security policies
4. `supabase/migrations/20260628000004_waitlist.sql` — waitlist promotion + open/full sync
5. `supabase/migrations/20260628000005_grants.sql` — API role grants (fixes "permission denied")
6. `supabase/seed.sql` — demo data (or run `npm run seed`)

## 🌱 Seed data

`supabase/seed.sql` creates **8 demo users** (password **`password123`**), 6 sports, 7 Melbourne venues and **7 badminton events**, including:

- beginner-friendly free and paid sessions (CBD, Clayton, Footscray …)
- a **full** Box Hill event **with a waitlist**
- a **completed** Hawthorn event **with attendance + reviews** (drives Grace's 92% show-up rate and Tom's no-show)
- a cancelled event

> Seeding `auth.users` is the only version-sensitive part. If it errors on your Supabase project, create users in the dashboard instead and run the rest — the app stays fully browsable. See `supabase/README.md`.

## 🧭 Demo checklist

A quick path to show the product end-to-end:

1. **Landing** (`/`) — read the pitch and "why better than Facebook" section.
2. **Browse** (`/events`) — filter by suburb / skill / price / beginner-friendly.
3. **Event detail** — open the **Box Hill** event to see a full event + waitlist; open the **Hawthorn** event to see reviews.
4. **Sign in** as `grace@demo.test` / `password123`.
5. **Join** an open event → see your confirmed spot; **Leave** → watch the waitlist promote (on a full event).
6. **Host** a game (`/events/new`) — note the public-venue warning.
7. **Chat** on an event you've joined.
8. **My events** (`/my-events`) — see joined + hosting.
9. As a **host** of a past event, mark attendance; as a **joined player** on the completed event, leave a review.
10. **Profile** (`/profile`) — edit your details; visit a public profile and try **Report**.

## 🧩 Pages / routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/events` | Browse + filter events |
| `/events/[id]` | Event detail (join/waitlist/leave, chat, reviews, attendance, map) |
| `/events/new` | Create an event (auth) |
| `/profile` | Your editable profile (auth) |
| `/profile/[id]` | Public profile |
| `/my-events` | Your joined + hosted events (auth) |
| `/auth/sign-in`, `/auth/sign-up` | Authentication |
| `/guidelines` | Community guidelines |

## 🗃️ Schema notes

Tables: `profiles`, `sports`, `venues`, `events`, `event_participants`, `event_messages`, `reviews`, `reports`. Highlights:

- `profiles.id` references `auth.users(id)`; a trigger auto-creates a profile on sign-up.
- Reliability counters (`attendance_count`, `no_show_count`, `hosted_events_count`) are kept in sync by triggers.
- A `security definer` trigger promotes the next waitlisted player and syncs `open`/`full` when someone leaves — RLS-safe for non-host leavers.
- RLS: public read where it powers browsing; writes scoped to the owner (and the host for attendance); chat limited to host + joined players.

## ⚠️ Known limitations

- OSM map tiles are **demo-only** — move to a proper/self-hosted tile provider for production.
- Chat and lists are **not real-time** (refresh/revalidate on action).
- **Block** is a client-side placeholder (not persisted).
- Reports are stored but there's no admin moderation dashboard.
- Email confirmation depends on your Supabase Auth settings; disable it for the smoothest demo.
- `seed.sql` targets a fresh database; re-running won't cleanly reset reliability counters.

## 🛣️ Roadmap

- More sports (basketball, soccer, pickleball, volleyball, futsal)
- Real-time chat & notifications
- Payments & paid-session support
- Full Google Calendar OAuth
- Recommendations and an admin/moderation dashboard
- Native mobile app
