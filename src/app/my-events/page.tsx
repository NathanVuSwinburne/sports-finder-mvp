import { EventCard } from "@/components/events/EventCard";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { requireUser } from "@/lib/auth";
import { fetchEvents, fetchMyParticipations } from "@/lib/events";

export const metadata = { title: "My events · SportsFinder" };

export default async function MyEventsPage() {
  const user = await requireUser();
  const [allEvents, participations] = await Promise.all([
    fetchEvents(),
    fetchMyParticipations(user.id),
  ]);

  const hosting = allEvents.filter((e) => e.host_id === user.id);
  const byStart = (a: { start_at: string }, b: { start_at: string }) =>
    new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
  hosting.sort(byStart);
  const playing = [...participations].sort((a, b) => byStart(a.event, b.event));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My events</h1>
        <ButtonLink href="/events/new" size="sm">Host a game</ButtonLink>
      </div>

      {/* Playing */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Games you&rsquo;ve joined</h2>
        {playing.length === 0 ? (
          <EmptyRow
            text="You haven't joined any games yet."
            href="/events"
            cta="Browse events"
          />
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {playing.map((p) => (
              <div key={p.event.id} className="relative">
                {p.status === "waitlisted" && (
                  <span className="absolute right-3 top-3 z-10">
                    <Badge tone="amber">Waitlisted</Badge>
                  </span>
                )}
                <EventCard event={p.event} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Hosting */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Games you&rsquo;re hosting</h2>
        {hosting.length === 0 ? (
          <EmptyRow
            text="You're not hosting any games yet."
            href="/events/new"
            cta="Host a game"
          />
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hosting.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-xs text-slate-400">
        Tip: hosts can mark attendance on an event page once it&rsquo;s in the past —
        that updates everyone&rsquo;s show-up score.
      </p>
    </div>
  );
}

function EmptyRow({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600">{text}</p>
      <ButtonLink href={href} size="sm" variant="outline">{cta}</ButtonLink>
    </div>
  );
}
