# Supabase setup

Database schema, RLS policies and seed data for Sports Finder MVP.

```
supabase/
├── migrations/
│   ├── 20260628000001_schema.sql            # tables, enums, indexes
│   ├── 20260628000002_functions_triggers.sql # profile auto-create, reliability counters, membership helper
│   └── 20260628000003_rls.sql                # Row Level Security policies
└── seed.sql                                  # demo users, venues, events, reviews
```

## Apply it

### Option A — Supabase Dashboard (simplest, no CLI)

1. Create a project at <https://supabase.com>.
2. Open **SQL Editor** and run the three migration files **in order**, then `seed.sql`.
3. Copy your keys from **Project Settings → API** into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # optional
   ```

### Option B — Supabase CLI

```bash
supabase db push          # applies migrations/
supabase db execute --file supabase/seed.sql
```

## Demo accounts

All seeded users share the password **`password123`**:

| Email | Name | Note |
|-------|------|------|
| grace@demo.test | Grace Liu | Reliable host (92% show-up), hosts the CBD session |
| minh@demo.test  | Minh Tran | 100% show-up |
| sara@demo.test  | Sara Khan | Hosts the full Box Hill session |
| aria@demo.test  | Aria Wong | Hosted the completed session with reviews |
| tom@demo.test   | Tom Nguyen | Has a no-show on record |

> ⚠️ Seeding `auth.users` directly is sensitive to the GoTrue version. If the
> first block of `seed.sql` errors, create users via the dashboard instead and
> run the rest — the app stays fully browsable on profiles + events.

## Notes

- `seed.sql` is written for a **fresh** database. Re-running is best-effort
  (`on conflict do nothing`); it won't cleanly reset reliability counters.
- Venue lat/lng are entered by hand — there is **no geocoding** in v1.
