-- ============================================================================
-- Sports Finder MVP — seed data
-- Run AFTER the migrations, on a FRESH database (re-running is best-effort only).
--
-- Creates 8 demo auth users (password: password123), 6 sports, 7 venues and
-- 7 badminton events across Melbourne — including a FULL event with a waitlist
-- and a COMPLETED event with attendance + reviews.
--
-- NOTE: Inserting into auth.users/auth.identities is the part most sensitive to
-- Supabase/GoTrue versions. If it errors, you can instead create users via the
-- dashboard and keep the rest of this file — the app is fully browsable with
-- profiles + events regardless of demo login.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Demo auth users (email/password)  — password for all: password123
-- ---------------------------------------------------------------------------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, last_sign_in_at,
  confirmation_token, recovery_token, email_change, email_change_token_new
)
select
  '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated',
  u.email, crypt('password123', gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('display_name', u.display_name),
  now(), now(), now(), '', '', '', ''
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'grace@demo.test', 'Grace Liu'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'minh@demo.test',  'Minh Tran'),
  ('a0000000-0000-4000-8000-000000000003'::uuid, 'sara@demo.test',  'Sara Khan'),
  ('a0000000-0000-4000-8000-000000000004'::uuid, 'leo@demo.test',   'Leo Costa'),
  ('a0000000-0000-4000-8000-000000000005'::uuid, 'aria@demo.test',  'Aria Wong'),
  ('a0000000-0000-4000-8000-000000000006'::uuid, 'kenji@demo.test', 'Kenji Sato'),
  ('a0000000-0000-4000-8000-000000000007'::uuid, 'priya@demo.test', 'Priya Patel'),
  ('a0000000-0000-4000-8000-000000000008'::uuid, 'tom@demo.test',   'Tom Nguyen')
) as u(id, email, display_name)
on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), u.id, u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email', now(), now(), now()
from (values
  ('a0000000-0000-4000-8000-000000000001'::uuid, 'grace@demo.test'),
  ('a0000000-0000-4000-8000-000000000002'::uuid, 'minh@demo.test'),
  ('a0000000-0000-4000-8000-000000000003'::uuid, 'sara@demo.test'),
  ('a0000000-0000-4000-8000-000000000004'::uuid, 'leo@demo.test'),
  ('a0000000-0000-4000-8000-000000000005'::uuid, 'aria@demo.test'),
  ('a0000000-0000-4000-8000-000000000006'::uuid, 'kenji@demo.test'),
  ('a0000000-0000-4000-8000-000000000007'::uuid, 'priya@demo.test'),
  ('a0000000-0000-4000-8000-000000000008'::uuid, 'tom@demo.test')
) as u(id, email)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- 2. Profiles (rich data + baseline reliability history).
--    handle_new_user() already created bare rows above; we upsert details here.
--    attendance/no_show baselines represent PAST history; the completed seed
--    event below adds to them via triggers.
-- ---------------------------------------------------------------------------
insert into public.profiles (
  id, display_name, bio, suburb, university, skill_level, preferred_sports,
  attendance_count, no_show_count, hosted_events_count
) values
  ('a0000000-0000-4000-8000-000000000001', 'Grace Liu',  'Organiser of friendly CBD sessions. Beginners always welcome.', 'Carlton',        'University of Melbourne', 'intermediate', array['badminton'],              11, 1, 4),
  ('a0000000-0000-4000-8000-000000000002', 'Minh Tran',  'Monash student, love a casual rally after class.',             'Clayton',        'Monash University',       'casual',       array['badminton'],               7, 0, 0),
  ('a0000000-0000-4000-8000-000000000003', 'Sara Khan',  'Competitive-ish but patient with newcomers.',                 'Box Hill',       'Deakin University',       'intermediate', array['badminton'],               5, 1, 1),
  ('a0000000-0000-4000-8000-000000000004', 'Leo Costa',  'New to Melbourne, here to meet people through sport.',         'Footscray',      'Victoria University',     'casual',       array['badminton'],               2, 0, 0),
  ('a0000000-0000-4000-8000-000000000005', 'Aria Wong',  'Weekend badminton + bubble tea enthusiast.',                  'Hawthorn',       'Swinburne University',    'casual',       array['badminton','volleyball'],  3, 0, 2),
  ('a0000000-0000-4000-8000-000000000006', 'Kenji Sato', 'Looking for higher-intensity games.',                         'Carlton',        'RMIT University',         'competitive',  array['badminton','basketball'],  0, 0, 0),
  ('a0000000-0000-4000-8000-000000000007', 'Priya Patel','Total beginner, excited to learn!',                           'Glen Waverley',  'Monash University',       'beginner',     array['badminton'],               1, 0, 0),
  ('a0000000-0000-4000-8000-000000000008', 'Tom Nguyen', 'Casual player, still figuring out my schedule.',              'Footscray',      'not a student',           'beginner',     array['badminton'],               1, 2, 0)
on conflict (id) do update set
  display_name        = excluded.display_name,
  bio                 = excluded.bio,
  suburb              = excluded.suburb,
  university          = excluded.university,
  skill_level         = excluded.skill_level,
  preferred_sports    = excluded.preferred_sports,
  attendance_count    = excluded.attendance_count,
  no_show_count       = excluded.no_show_count,
  hosted_events_count = excluded.hosted_events_count;

-- ---------------------------------------------------------------------------
-- 3. Sports (badminton-first; others ready for future)
-- ---------------------------------------------------------------------------
insert into public.sports (id, name, slug) values
  ('bd000000-0000-4000-8000-000000000001', 'Badminton',  'badminton'),
  ('bd000000-0000-4000-8000-000000000002', 'Basketball', 'basketball'),
  ('bd000000-0000-4000-8000-000000000003', 'Soccer',     'soccer'),
  ('bd000000-0000-4000-8000-000000000004', 'Pickleball', 'pickleball'),
  ('bd000000-0000-4000-8000-000000000005', 'Volleyball', 'volleyball'),
  ('bd000000-0000-4000-8000-000000000006', 'Futsal',     'futsal')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. Venues (lat/lng entered manually; google_maps_url is a plain search link)
-- ---------------------------------------------------------------------------
insert into public.venues (id, name, address, suburb, latitude, longitude, google_maps_url, price_hint) values
  ('be000000-0000-4000-8000-000000000001', 'Melbourne City Badminton Centre', '120 Spencer St', 'Melbourne',     -37.8170, 144.9540, 'https://www.google.com/maps/search/?api=1&query=Melbourne+City+Badminton+Centre+Melbourne+VIC', '$10–15/session'),
  ('be000000-0000-4000-8000-000000000002', 'Clayton Badminton Stadium',       '7 Dunstan St',   'Clayton',       -37.9249, 145.1186, 'https://www.google.com/maps/search/?api=1&query=Clayton+Badminton+Stadium+Clayton+VIC',          'Free–$10'),
  ('be000000-0000-4000-8000-000000000003', 'Box Hill Badminton Centre',       '2 Wellington Rd','Box Hill',      -37.8195, 145.1228, 'https://www.google.com/maps/search/?api=1&query=Box+Hill+Badminton+Centre+Box+Hill+VIC',         '$12–18/session'),
  ('be000000-0000-4000-8000-000000000004', 'Footscray Community Sports Hub',  '80 Hyde St',     'Footscray',     -37.8006, 144.8997, 'https://www.google.com/maps/search/?api=1&query=Footscray+Community+Sports+Hub+Footscray+VIC',   '$8–12/session'),
  ('be000000-0000-4000-8000-000000000005', 'Hawthorn Recreation Centre',      '30 William St',  'Hawthorn',      -37.8210, 145.0300, 'https://www.google.com/maps/search/?api=1&query=Hawthorn+Recreation+Centre+Hawthorn+VIC',        '$10/session'),
  ('be000000-0000-4000-8000-000000000006', 'Carlton Sports Hall',             '215 Rathdowne St','Carlton',      -37.7990, 144.9690, 'https://www.google.com/maps/search/?api=1&query=Carlton+Sports+Hall+Carlton+VIC',                '$15/session'),
  ('be000000-0000-4000-8000-000000000007', 'Glen Waverley Badminton Arena',   '5 Euneva Ave',   'Glen Waverley', -37.8800, 145.1650, 'https://www.google.com/maps/search/?api=1&query=Glen+Waverley+Badminton+Arena+Glen+Waverley+VIC','$10–14/session')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 5. Events (times are Melbourne AEST, UTC+10 in July)
-- ---------------------------------------------------------------------------
insert into public.events (
  id, host_id, sport_id, venue_id, title, description, start_at, end_at,
  price_cents, capacity, min_players, skill_level, beginner_friendly, rules, status
) values
  -- e1: open, beginner-friendly, CBD
  ('ce000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'bd000000-0000-4000-8000-000000000001', 'be000000-0000-4000-8000-000000000001',
   'Friday CBD Beginner Badminton', 'Relaxed after-work doubles in the city. Perfect if you are new or rusty — we rotate everyone in and keep it friendly.',
   '2026-07-03 18:00:00+10', '2026-07-03 20:00:00+10', 1200, 8, 4, 'casual', true,
   'Non-marking shoes required. Bring water. Rackets can be shared.', 'open'),

  -- e2: open, free, beginner, Clayton
  ('ce000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'bd000000-0000-4000-8000-000000000001', 'be000000-0000-4000-8000-000000000002',
   'Sunday Morning Social Hit (Free)', 'Free casual session for students. Great way to meet people on the weekend. All gear provided for first-timers.',
   '2026-07-05 10:00:00+10', '2026-07-05 12:00:00+10', 0, 12, 6, 'beginner', true,
   'Be on time so we can sort courts. Friendly play only.', 'open'),

  -- e3: FULL with waitlist, Box Hill, intermediate
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000003', 'bd000000-0000-4000-8000-000000000001', 'be000000-0000-4000-8000-000000000003',
   'Box Hill Intermediate Doubles', 'Faster-paced doubles for players who can rally consistently. Limited spots, waitlist available.',
   '2026-07-04 19:00:00+10', '2026-07-04 21:00:00+10', 1500, 6, 4, 'intermediate', false,
   'Intermediate level — please be comfortable serving and rallying. No-shows lose waitlist priority.', 'full'),

  -- e4: open, beginner-friendly, Footscray
  ('ce000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000004', 'bd000000-0000-4000-8000-000000000001', 'be000000-0000-4000-8000-000000000004',
   'Footscray Newcomers Night', 'Brand new to Melbourne? This one is for you. Low-pressure, lots of introductions, stick around for food after.',
   '2026-07-08 17:30:00+10', '2026-07-08 19:30:00+10', 1000, 10, 4, 'casual', true,
   'Beginners encouraged. Public venue — meet at the main entrance.', 'open'),

  -- e5: COMPLETED with reviews, Hawthorn
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000005', 'bd000000-0000-4000-8000-000000000001', 'be000000-0000-4000-8000-000000000005',
   'Hawthorn Weekend Warmup', 'A friendly Saturday session — beginners and casual players welcome.',
   '2026-06-20 14:00:00+10', '2026-06-20 16:00:00+10', 1000, 8, 4, 'casual', true,
   'Non-marking shoes. Be kind and rotate partners.', 'completed'),

  -- e6: open, competitive, Carlton
  ('ce000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000006', 'bd000000-0000-4000-8000-000000000001', 'be000000-0000-4000-8000-000000000006',
   'Carlton Competitive Singles', 'Higher-intensity singles and doubles for stronger players. Bring your A game.',
   '2026-07-10 18:00:00+10', '2026-07-10 20:00:00+10', 1800, 8, 4, 'competitive', false,
   'Competitive level. Keep score, play fair, shake hands.', 'open'),

  -- e7: cancelled, Glen Waverley
  ('ce000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000007', 'bd000000-0000-4000-8000-000000000001', 'be000000-0000-4000-8000-000000000007',
   'Glen Waverley Late Doubles', 'Evening doubles — CANCELLED due to venue double-booking. Rescheduling soon!',
   '2026-07-02 20:00:00+10', '2026-07-02 22:00:00+10', 1200, 10, 6, 'casual', false,
   'Sorry for the change — keep an eye out for the new date.', 'cancelled')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 6. Participants
--    (attendance triggers fire on the 'attended'/'no_show' rows in e5)
-- ---------------------------------------------------------------------------
insert into public.event_participants (event_id, user_id, status) values
  -- e1 (cap 8) — 2 joined
  ('ce000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'joined'),
  ('ce000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003', 'joined'),

  -- e2 (cap 12) — 3 joined
  ('ce000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000004', 'joined'),
  ('ce000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000007', 'joined'),
  ('ce000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000008', 'joined'),

  -- e3 (cap 6) — FULL: 6 joined + 1 waitlisted
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'joined'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002', 'joined'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000004', 'joined'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000005', 'joined'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000006', 'joined'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000007', 'joined'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000008', 'waitlisted'),

  -- e4 (cap 10) — 1 joined
  ('ce000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'joined'),

  -- e5 COMPLETED — attendance recorded by host (drives reliability counts)
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'attended'),
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002', 'attended'),
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000003', 'attended'),
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000004', 'attended'),
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000008', 'no_show'),

  -- e6 (cap 8) — 1 joined
  ('ce000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000005', 'joined'),

  -- e7 cancelled — had one interested player
  ('ce000000-0000-4000-8000-000000000007', 'a0000000-0000-4000-8000-000000000002', 'joined')
on conflict (event_id, user_id) do nothing;

-- ---------------------------------------------------------------------------
-- 7. Event messages (only members/host post)
-- ---------------------------------------------------------------------------
insert into public.event_messages (event_id, user_id, body) values
  ('ce000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Hey all! Bring water and non-marking shoes. We have a couple of spare rackets 🙌'),
  ('ce000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'Awesome, first time playing in a while — see you Friday!'),
  ('ce000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003', 'Count me in 👍'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000003', 'We are full — waitlist will be promoted if someone drops out.'),
  ('ce000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000008', 'Fingers crossed for a spot, happy to be on the waitlist!');

-- ---------------------------------------------------------------------------
-- 8. Reviews for the completed event (host = Aria; one no-show flagged on Tom)
-- ---------------------------------------------------------------------------
insert into public.reviews (event_id, reviewer_id, reviewee_id, rating, tags, comment) values
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000005', 5, array['well-organised','good-vibe'],    'Super welcoming and explained things for the beginners. Will join again!'),
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000005', 5, array['beginner-friendly','good-vibe'], 'Great vibe, everyone got plenty of court time.'),
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000005', 4, array['well-organised'],               'Well run and started right on time.'),
  ('ce000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000008', 2, array['no-show-issue'],                'Booked a spot but did not turn up and no message — held up a court.')
on conflict (event_id, reviewer_id, reviewee_id) do nothing;
