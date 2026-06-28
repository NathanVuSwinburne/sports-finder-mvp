import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import { ButtonLink } from "@/components/ui/Button";
import {
  fetchEvents,
  suburbsFromEvents,
  type EventWithRelations,
} from "@/lib/events";
import { hasSupabaseEnv } from "@/lib/auth";
import { melbourneDateKey } from "@/lib/format";

export const metadata = {
  title: "Browse badminton events · SportsFinder",
};

type SearchParams = {
  suburb?: string;
  skill?: string;
  price?: string;
  date?: string;
  beginner?: string;
};

function applyFilters(
  events: EventWithRelations[],
  f: SearchParams,
): EventWithRelations[] {
  return events.filter((e) => {
    if (f.suburb && e.venue?.suburb !== f.suburb) return false;
    if (f.skill && e.skill_level !== f.skill) return false;
    if (f.price === "free" && e.price_cents !== 0) return false;
    if (f.price === "paid" && e.price_cents === 0) return false;
    if (f.beginner === "1" && !e.beginner_friendly) return false;
    if (f.date && melbourneDateKey(e.start_at) !== f.date) return false;
    return true;
  });
}

/** Upcoming open/full first (soonest), then everything else (most recent). */
function sortForBrowse(events: EventWithRelations[]): EventWithRelations[] {
  const now = Date.now();
  const isUpcomingActive = (e: EventWithRelations) =>
    (e.status === "open" || e.status === "full") &&
    new Date(e.start_at).getTime() >= now;

  return [...events].sort((a, b) => {
    const au = isUpcomingActive(a);
    const bu = isUpcomingActive(b);
    if (au !== bu) return au ? -1 : 1;
    const at = new Date(a.start_at).getTime();
    const bt = new Date(b.start_at).getTime();
    return au ? at - bt : bt - at;
  });
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const all = await fetchEvents();
  const suburbs = suburbsFromEvents(all);
  const events = sortForBrowse(applyFilters(all, params));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Badminton near you
          </h1>
          <p className="mt-1 text-slate-600">
            Friendly sessions across Melbourne. Filter by suburb, skill and price.
          </p>
        </div>
        <ButtonLink href="/events/new" size="sm">
          Host a game
        </ButtonLink>
      </div>

      <EventFilters suburbs={suburbs} values={params} />

      {!hasSupabaseEnv() ? (
        <EmptyState
          title="Connect Supabase to see events"
          body="Add your Supabase keys to .env.local and apply the migrations + seed in supabase/."
        />
      ) : all.length === 0 ? (
        <EmptyState
          title="No events yet"
          body="The database has no events. Apply supabase/seed.sql, or be the first to host a game!"
          cta
        />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events match your filters"
          body="Try widening your search — clear a filter or pick a different suburb."
        />
      ) : (
        <>
          <p className="mb-4 mt-6 text-sm text-slate-500">
            {events.length} {events.length === 1 ? "event" : "events"}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta?: boolean;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="text-4xl">🏸</div>
      <h2 className="mt-3 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{body}</p>
      {cta && (
        <div className="mt-5">
          <ButtonLink href="/events/new">Host the first game</ButtonLink>
        </div>
      )}
      {!cta && (
        <div className="mt-5">
          <Link href="/events" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            Clear filters
          </Link>
        </div>
      )}
    </div>
  );
}
