/**
 * Seed the database using the service-role key.
 *
 * Creates demo auth users via the Auth Admin API (proper accounts, email
 * pre-confirmed) then inserts profiles, venues, events, participants, messages
 * and reviews. Requires the schema migrations to be applied first.
 *
 * Usage: npm run seed   (reads .env.local)
 *
 * Idempotent-ish: safe to run on a fresh database. Re-running won't duplicate
 * rows, but reliability counters are only correct on the first run (they're
 * maintained by triggers as participants are inserted).
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ---- env --------------------------------------------------------------------
const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}
const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

const DEMO_PASSWORD = "password123";

// ---- data -------------------------------------------------------------------
const SPORTS = [
  ["bd000000-0000-4000-8000-000000000001", "Badminton", "badminton"],
  ["bd000000-0000-4000-8000-000000000002", "Basketball", "basketball"],
  ["bd000000-0000-4000-8000-000000000003", "Soccer", "soccer"],
  ["bd000000-0000-4000-8000-000000000004", "Pickleball", "pickleball"],
  ["bd000000-0000-4000-8000-000000000005", "Volleyball", "volleyball"],
  ["bd000000-0000-4000-8000-000000000006", "Futsal", "futsal"],
];
const BADMINTON = SPORTS[0][0];

const V = (n) => `be000000-0000-4000-8000-00000000000${n}`;
const VENUES = [
  { id: V(1), name: "Melbourne City Badminton Centre", address: "120 Spencer St", suburb: "Melbourne", latitude: -37.817, longitude: 144.954, google_maps_url: "https://www.google.com/maps/search/?api=1&query=Melbourne+City+Badminton+Centre+Melbourne+VIC", price_hint: "$10–15/session" },
  { id: V(2), name: "Clayton Badminton Stadium", address: "7 Dunstan St", suburb: "Clayton", latitude: -37.9249, longitude: 145.1186, google_maps_url: "https://www.google.com/maps/search/?api=1&query=Clayton+Badminton+Stadium+Clayton+VIC", price_hint: "Free–$10" },
  { id: V(3), name: "Box Hill Badminton Centre", address: "2 Wellington Rd", suburb: "Box Hill", latitude: -37.8195, longitude: 145.1228, google_maps_url: "https://www.google.com/maps/search/?api=1&query=Box+Hill+Badminton+Centre+Box+Hill+VIC", price_hint: "$12–18/session" },
  { id: V(4), name: "Footscray Community Sports Hub", address: "80 Hyde St", suburb: "Footscray", latitude: -37.8006, longitude: 144.8997, google_maps_url: "https://www.google.com/maps/search/?api=1&query=Footscray+Community+Sports+Hub+Footscray+VIC", price_hint: "$8–12/session" },
  { id: V(5), name: "Hawthorn Recreation Centre", address: "30 William St", suburb: "Hawthorn", latitude: -37.821, longitude: 145.03, google_maps_url: "https://www.google.com/maps/search/?api=1&query=Hawthorn+Recreation+Centre+Hawthorn+VIC", price_hint: "$10/session" },
  { id: V(6), name: "Carlton Sports Hall", address: "215 Rathdowne St", suburb: "Carlton", latitude: -37.799, longitude: 144.969, google_maps_url: "https://www.google.com/maps/search/?api=1&query=Carlton+Sports+Hall+Carlton+VIC", price_hint: "$15/session" },
  { id: V(7), name: "Glen Waverley Badminton Arena", address: "5 Euneva Ave", suburb: "Glen Waverley", latitude: -37.88, longitude: 145.165, google_maps_url: "https://www.google.com/maps/search/?api=1&query=Glen+Waverley+Badminton+Arena+Glen+Waverley+VIC", price_hint: "$10–14/session" },
];

// key, email, display name, suburb, university, skill, preferred sports, bio, baseline counts
const USERS = [
  { key: "grace", email: "grace@demo.test", name: "Grace Liu", suburb: "Carlton", uni: "University of Melbourne", skill: "intermediate", sports: ["badminton"], bio: "Organiser of friendly CBD sessions. Beginners always welcome.", att: 11, no: 1, hosted: 4 },
  { key: "minh", email: "minh@demo.test", name: "Minh Tran", suburb: "Clayton", uni: "Monash University", skill: "casual", sports: ["badminton"], bio: "Monash student, love a casual rally after class.", att: 7, no: 0, hosted: 0 },
  { key: "sara", email: "sara@demo.test", name: "Sara Khan", suburb: "Box Hill", uni: "Deakin University", skill: "intermediate", sports: ["badminton"], bio: "Competitive-ish but patient with newcomers.", att: 5, no: 1, hosted: 1 },
  { key: "leo", email: "leo@demo.test", name: "Leo Costa", suburb: "Footscray", uni: "Victoria University", skill: "casual", sports: ["badminton"], bio: "New to Melbourne, here to meet people through sport.", att: 2, no: 0, hosted: 0 },
  { key: "aria", email: "aria@demo.test", name: "Aria Wong", suburb: "Hawthorn", uni: "Swinburne University", skill: "casual", sports: ["badminton", "volleyball"], bio: "Weekend badminton + bubble tea enthusiast.", att: 3, no: 0, hosted: 2 },
  { key: "kenji", email: "kenji@demo.test", name: "Kenji Sato", suburb: "Carlton", uni: "RMIT University", skill: "competitive", sports: ["badminton", "basketball"], bio: "Looking for higher-intensity games.", att: 0, no: 0, hosted: 0 },
  { key: "priya", email: "priya@demo.test", name: "Priya Patel", suburb: "Glen Waverley", uni: "Monash University", skill: "beginner", sports: ["badminton"], bio: "Total beginner, excited to learn!", att: 1, no: 0, hosted: 0 },
  { key: "tom", email: "tom@demo.test", name: "Tom Nguyen", suburb: "Footscray", uni: "not a student", skill: "beginner", sports: ["badminton"], bio: "Casual player, still figuring out my schedule.", att: 1, no: 2, hosted: 0 },
];

const E = (n) => `ce000000-0000-4000-8000-00000000000${n}`;
const EVENTS = [
  { id: E(1), host: "grace", venue: V(1), title: "Friday CBD Beginner Badminton", description: "Relaxed after-work doubles in the city. Perfect if you are new or rusty — we rotate everyone in and keep it friendly.", start: "2026-07-03T08:00:00Z", end: "2026-07-03T10:00:00Z", price: 1200, capacity: 8, min: 4, skill: "casual", beginner: true, rules: "Non-marking shoes required. Bring water. Rackets can be shared.", status: "open" },
  { id: E(2), host: "minh", venue: V(2), title: "Sunday Morning Social Hit (Free)", description: "Free casual session for students. Great way to meet people on the weekend. All gear provided for first-timers.", start: "2026-07-05T00:00:00Z", end: "2026-07-05T02:00:00Z", price: 0, capacity: 12, min: 6, skill: "beginner", beginner: true, rules: "Be on time so we can sort courts. Friendly play only.", status: "open" },
  { id: E(3), host: "sara", venue: V(3), title: "Box Hill Intermediate Doubles", description: "Faster-paced doubles for players who can rally consistently. Limited spots, waitlist available.", start: "2026-07-04T09:00:00Z", end: "2026-07-04T11:00:00Z", price: 1500, capacity: 6, min: 4, skill: "intermediate", beginner: false, rules: "Intermediate level — please be comfortable serving and rallying. No-shows lose waitlist priority.", status: "full" },
  { id: E(4), host: "leo", venue: V(4), title: "Footscray Newcomers Night", description: "Brand new to Melbourne? This one is for you. Low-pressure, lots of introductions, stick around for food after.", start: "2026-07-08T07:30:00Z", end: "2026-07-08T09:30:00Z", price: 1000, capacity: 10, min: 4, skill: "casual", beginner: true, rules: "Beginners encouraged. Public venue — meet at the main entrance.", status: "open" },
  { id: E(5), host: "aria", venue: V(5), title: "Hawthorn Weekend Warmup", description: "A friendly Saturday session — beginners and casual players welcome.", start: "2026-06-20T04:00:00Z", end: "2026-06-20T06:00:00Z", price: 1000, capacity: 8, min: 4, skill: "casual", beginner: true, rules: "Non-marking shoes. Be kind and rotate partners.", status: "completed" },
  { id: E(6), host: "kenji", venue: V(6), title: "Carlton Competitive Singles", description: "Higher-intensity singles and doubles for stronger players. Bring your A game.", start: "2026-07-10T08:00:00Z", end: "2026-07-10T10:00:00Z", price: 1800, capacity: 8, min: 4, skill: "competitive", beginner: false, rules: "Competitive level. Keep score, play fair, shake hands.", status: "open" },
  { id: E(7), host: "priya", venue: V(7), title: "Glen Waverley Late Doubles", description: "Evening doubles — CANCELLED due to venue double-booking. Rescheduling soon!", start: "2026-07-02T10:00:00Z", end: "2026-07-02T12:00:00Z", price: 1200, capacity: 10, min: 6, skill: "casual", beginner: false, rules: "Sorry for the change — keep an eye out for the new date.", status: "cancelled" },
];

// joined/attended/no_show listed before waitlisted so trigger ordering is correct
const PARTICIPANTS = [
  { e: E(1), u: "minh", s: "joined" }, { e: E(1), u: "sara", s: "joined" },
  { e: E(2), u: "leo", s: "joined" }, { e: E(2), u: "priya", s: "joined" }, { e: E(2), u: "tom", s: "joined" },
  { e: E(3), u: "grace", s: "joined" }, { e: E(3), u: "minh", s: "joined" }, { e: E(3), u: "leo", s: "joined" }, { e: E(3), u: "aria", s: "joined" }, { e: E(3), u: "kenji", s: "joined" }, { e: E(3), u: "priya", s: "joined" }, { e: E(3), u: "tom", s: "waitlisted" },
  { e: E(4), u: "grace", s: "joined" },
  { e: E(5), u: "grace", s: "attended" }, { e: E(5), u: "minh", s: "attended" }, { e: E(5), u: "sara", s: "attended" }, { e: E(5), u: "leo", s: "attended" }, { e: E(5), u: "tom", s: "no_show" },
  { e: E(6), u: "aria", s: "joined" },
  { e: E(7), u: "minh", s: "joined" },
];

const MESSAGES = [
  { e: E(1), u: "grace", body: "Hey all! Bring water and non-marking shoes. We have a couple of spare rackets 🙌" },
  { e: E(1), u: "minh", body: "Awesome, first time playing in a while — see you Friday!" },
  { e: E(1), u: "sara", body: "Count me in 👍" },
  { e: E(3), u: "sara", body: "We are full — waitlist will be promoted if someone drops out." },
  { e: E(3), u: "tom", body: "Fingers crossed for a spot, happy to be on the waitlist!" },
];

const REVIEWS = [
  { e: E(5), reviewer: "grace", reviewee: "aria", rating: 5, tags: ["well-organised", "good-vibe"], comment: "Super welcoming and explained things for the beginners. Will join again!" },
  { e: E(5), reviewer: "minh", reviewee: "aria", rating: 5, tags: ["beginner-friendly", "good-vibe"], comment: "Great vibe, everyone got plenty of court time." },
  { e: E(5), reviewer: "sara", reviewee: "aria", rating: 4, tags: ["well-organised"], comment: "Well run and started right on time." },
  { e: E(5), reviewer: "grace", reviewee: "tom", rating: 2, tags: ["no-show-issue"], comment: "Booked a spot but did not turn up and no message — held up a court." },
];

// ---- helpers ----------------------------------------------------------------
function die(label, error) {
  if (error) {
    console.error(`✗ ${label}:`, error.message ?? error);
    process.exit(1);
  }
}

async function ensureUsers() {
  const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 1000 });
  die("list users", error);
  const byEmail = new Map(data.users.map((u) => [u.email, u.id]));
  const map = {};
  for (const u of USERS) {
    let id = byEmail.get(u.email);
    if (!id) {
      const res = await sb.auth.admin.createUser({
        email: u.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { display_name: u.name, suburb: u.suburb, university: u.uni },
      });
      die(`create ${u.email}`, res.error);
      id = res.data.user.id;
      console.log(`  + created ${u.email}`);
    } else {
      console.log(`  · ${u.email} already exists`);
    }
    map[u.key] = id;
  }
  return map;
}

// ---- run --------------------------------------------------------------------
console.log("Seeding…");

console.log("Users:");
const uid = await ensureUsers();

console.log("Profiles (baseline)…");
die(
  "profiles",
  (
    await sb.from("profiles").upsert(
      USERS.map((u) => ({
        id: uid[u.key],
        display_name: u.name,
        bio: u.bio,
        suburb: u.suburb,
        university: u.uni,
        skill_level: u.skill,
        preferred_sports: u.sports,
        attendance_count: u.att,
        no_show_count: u.no,
        hosted_events_count: u.hosted,
      })),
      { onConflict: "id" },
    )
  ).error,
);

console.log("Sports + venues…");
die("sports", (await sb.from("sports").upsert(SPORTS.map(([id, name, slug]) => ({ id, name, slug })), { onConflict: "id" })).error);
die("venues", (await sb.from("venues").upsert(VENUES, { onConflict: "id" })).error);

console.log("Events…");
die(
  "events",
  (
    await sb.from("events").upsert(
      EVENTS.map((e) => ({
        id: e.id, host_id: uid[e.host], sport_id: BADMINTON, venue_id: e.venue,
        title: e.title, description: e.description, start_at: e.start, end_at: e.end,
        price_cents: e.price, capacity: e.capacity, min_players: e.min,
        skill_level: e.skill, beginner_friendly: e.beginner, rules: e.rules, status: e.status,
      })),
      { onConflict: "id" },
    )
  ).error,
);

console.log("Participants…");
for (const p of PARTICIPANTS) {
  const { error } = await sb
    .from("event_participants")
    .upsert({ event_id: p.e, user_id: uid[p.u], status: p.s }, { onConflict: "event_id,user_id" });
  die(`participant ${p.u}@${p.e}`, error);
}

console.log("Messages…");
await sb.from("event_messages").delete().in("event_id", [E(1), E(3)]);
die(
  "messages",
  (await sb.from("event_messages").insert(MESSAGES.map((m) => ({ event_id: m.e, user_id: uid[m.u], body: m.body })))).error,
);

console.log("Reviews…");
die(
  "reviews",
  (
    await sb.from("reviews").upsert(
      REVIEWS.map((r) => ({
        event_id: r.e, reviewer_id: uid[r.reviewer], reviewee_id: uid[r.reviewee],
        rating: r.rating, tags: r.tags, comment: r.comment,
      })),
      { onConflict: "event_id,reviewer_id,reviewee_id" },
    )
  ).error,
);

// ---- summary ----------------------------------------------------------------
const counts = {};
for (const t of ["profiles", "sports", "venues", "events", "event_participants", "event_messages", "reviews"]) {
  const { count } = await sb.from(t).select("*", { count: "exact", head: true });
  counts[t] = count;
}
console.log("\n✓ Seed complete:", counts);
console.log("Demo login: any of the @demo.test emails · password:", DEMO_PASSWORD);
