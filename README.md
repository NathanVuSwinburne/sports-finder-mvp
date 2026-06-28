# 🏸 Sports Finder MVP

**Find beginner-friendly badminton sessions near you — with clear price, location, skill level, and people who actually show up.**

A reliability-first social sports web app for Melbourne international students and newcomers. Facebook groups are messy and people RSVP but don't show. Sports Finder fixes that with clear skill levels, transparent pricing, confirmed spots, beginner-friendly tagging, and a host/player **show-up score**.

> **v1 focuses on badminton.** The data model is built to add basketball, soccer, pickleball, volleyball and futsal later — without a rewrite.

---

## ✨ MVP features

- Landing page explaining the product and why it beats Facebook groups
- Email/password authentication (Supabase) with protected pages
- Browse & filter sessions (suburb, skill level, date, price, beginner-friendly)
- Event detail pages with venue, host reliability, players, waitlist, map link & add-to-calendar
- Create events (badminton-first, generalizable)
- Join / waitlist / leave flow with capacity rules and no duplicate joins
- Per-event message board (joined users + host)
- **Reliability system**: show-up score, "New player" / "Reliable host" badges, host marks attendance
- Post-event reviews (rating + tags + comment)
- Safety: report, community guidelines, public-venue recommendations
- Seed data so the app never looks empty

## 🧱 Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Supabase** — Postgres + Auth + Row Level Security
- Mobile-first responsive UI

## 🗺️ Maps & location (no paid APIs)

- Suburb-based filtering is the **primary** location feature.
- Venue lat/lng stored manually in seed data (no geocoding, no Nominatim calls).
- Optional Leaflet map for seeded venues — **OSM demo tiles only**; production should use a proper/self-hosted tile provider.
- Directions = generated **Google Maps search URL** from venue + suburb (a plain link, not the Maps API).

## 🚀 Setup

> Status: scaffolding in progress. Full steps land as milestones complete.

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev                  # http://localhost:3000
```

## 🔑 Environment variables

See [`.env.example`](./.env.example). Copy it to `.env.local` and fill in your Supabase project URL and keys. **Never commit `.env.local` or any real keys.**

## 🗄️ Database setup

_Coming in M1 — SQL migrations, RLS policies, and seed data under `supabase/`._

## 🌱 Seed data

_Coming in M1 — 5–8 Melbourne badminton events (incl. a full event with a waitlist and a completed event with reviews), plus demo hosts and players._

## 🛣️ Roadmap

- More sports (basketball, soccer, pickleball, volleyball, futsal)
- Realtime chat
- Payments & paid-session support
- Native mobile app
- Smarter recommendations
