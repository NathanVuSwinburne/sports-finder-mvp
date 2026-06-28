import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { ReliabilityBadge } from "@/components/ReliabilityBadge";
import { PlayerList } from "@/components/events/PlayerList";
import { JoinPanel } from "@/components/events/JoinPanel";
import { EventChat } from "@/components/events/EventChat";
import { EventReviews } from "@/components/events/EventReviews";
import { HostAttendancePanel } from "@/components/events/HostAttendancePanel";
import { VenueMap } from "@/components/events/VenueMap";
import { ReportButton } from "@/components/safety/ReportButton";
import { fetchEventDetail, deriveEventStats } from "@/lib/events";
import { getSessionUser } from "@/lib/auth";
import { formatLongDate, formatTime, formatPrice } from "@/lib/format";
import { SKILL_LABELS, STATUS_LABELS } from "@/lib/reliability";
import { googleCalendarUrl, directionsUrl } from "@/lib/calendar";

const STATUS_TONE = {
  open: "emerald",
  full: "amber",
  cancelled: "red",
  completed: "slate",
} as const;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [event, user] = await Promise.all([
    fetchEventDetail(id),
    getSessionUser(),
  ]);

  if (!event) notFound();

  const stats = deriveEventStats(event);
  const confirmed = event.participants.filter(
    (p) => p.status === "joined" || p.status === "attended",
  );
  const waitlist = event.participants.filter((p) => p.status === "waitlisted");
  const isActive = event.status === "open" || event.status === "full";
  const myStatus =
    event.participants.find((p) => p.user_id === user?.id)?.status ?? null;
  const isHost = Boolean(user) && event.host_id === user?.id;
  // Server component render; current time is intentional, not a render impurity.
  // eslint-disable-next-line react-hooks/purity
  const startInPast = new Date(event.start_at).getTime() < Date.now();
  const attendees = event.participants.filter((p) =>
    ["joined", "attended", "no_show"].includes(p.status),
  );
  const canReview =
    event.status === "completed" &&
    Boolean(user) &&
    !isHost &&
    ["joined", "attended", "no_show"].includes(myStatus ?? "");

  const location = [event.venue?.name, event.venue?.suburb]
    .filter(Boolean)
    .join(", ");
  const calUrl = googleCalendarUrl({
    title: event.title,
    start: event.start_at,
    end: event.end_at,
    details: event.description,
    location,
  });
  const mapUrl = directionsUrl({
    google_maps_url: event.venue?.google_maps_url,
    name: event.venue?.name,
    address: event.venue?.address,
    suburb: event.venue?.suburb,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href="/events" className="text-sm font-medium text-slate-500 hover:text-slate-800">
        ← Back to events
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABELS[event.status]}</Badge>
            {event.beginner_friendly && <Badge tone="emerald">🌱 Beginner-friendly</Badge>}
            <Badge tone="slate">{SKILL_LABELS[event.skill_level]}</Badge>
            <Badge tone="brand">{event.sport?.name ?? "Badminton"}</Badge>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {event.title}
          </h1>

          {event.status === "cancelled" && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800 ring-1 ring-red-200">
              This event has been cancelled by the host.
            </div>
          )}

          {event.description && (
            <p className="mt-4 whitespace-pre-line text-slate-700">{event.description}</p>
          )}

          {event.rules && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Rules &amp; notes
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{event.rules}</p>
            </div>
          )}

          {/* Players */}
          <div className="mt-8 space-y-6">
            <PlayerList
              title="Players joined"
              players={confirmed}
              hostId={event.host_id}
              emptyText="No players yet — be the first!"
            />
            {(waitlist.length > 0 || stats.isFull) && (
              <PlayerList title="Waitlist" players={waitlist} emptyText="Waitlist is empty." />
            )}
          </div>

          {isHost && startInPast && (
            <div className="mt-8">
              <HostAttendancePanel
                eventId={event.id}
                players={attendees}
                status={event.status}
              />
            </div>
          )}

          {event.status === "completed" && (
            <EventReviews
              eventId={event.id}
              currentUserId={user?.id ?? null}
              canReview={canReview}
            />
          )}

          <EventChat
            eventId={event.id}
            canChat={isHost || (myStatus !== null && myStatus !== "cancelled")}
          />

          <div className="mt-8">
            <ReportButton targetType="event" targetId={event.id} signedIn={Boolean(user)} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">When</p>
                <p className="mt-1 font-medium text-slate-900">{formatLongDate(event.start_at)}</p>
                <p className="text-sm text-slate-600">
                  {formatTime(event.start_at)}
                  {event.end_at && ` – ${formatTime(event.end_at)}`}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Where</p>
                <p className="mt-1 font-medium text-slate-900">{event.venue?.name ?? "Venue TBC"}</p>
                <p className="text-sm text-slate-600">
                  {[event.venue?.address, event.venue?.suburb].filter(Boolean).join(", ")}
                </p>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Price</p>
                  <p className="mt-1 font-semibold text-slate-900">{formatPrice(event.price_cents)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Spots</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {stats.confirmed}/{event.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Min</p>
                  <p className="mt-1 font-semibold text-slate-900">{event.min_players}</p>
                </div>
              </div>

              {!user ? (
                isActive && (
                  <ButtonLink href="/auth/sign-in?next=protected" className="w-full">
                    Sign in to join
                  </ButtonLink>
                )
              ) : (
                <JoinPanel
                  eventId={event.id}
                  myStatus={myStatus}
                  isActive={isActive}
                  startInPast={startInPast}
                  isHost={isHost}
                  spotsLeft={stats.spotsLeft}
                />
              )}

              <div className="grid grid-cols-2 gap-2">
                <ButtonLink href={mapUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                  🧭 Directions
                </ButtonLink>
                <ButtonLink href={calUrl} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                  📅 Calendar
                </ButtonLink>
              </div>
            </CardBody>
          </Card>

          {/* Host */}
          <Card>
            <CardBody>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hosted by</p>
              <Link href={`/profile/${event.host_id}`} className="mt-2 flex items-center gap-3">
                <Avatar name={event.host?.display_name ?? "Host"} src={event.host?.avatar_url} size="md" />
                <div>
                  <p className="font-semibold text-slate-900">{event.host?.display_name ?? "Host"}</p>
                  {event.host && <ReliabilityBadge profile={event.host} asHost showNoShows />}
                </div>
              </Link>
            </CardBody>
          </Card>

          {/* Map (demo tiles) */}
          {event.venue?.latitude != null && event.venue?.longitude != null && (
            <Card>
              <CardBody>
                <VenueMap
                  lat={event.venue.latitude}
                  lng={event.venue.longitude}
                  label={event.venue.name}
                />
                <p className="mt-2 text-xs text-slate-400">
                  Map tiles © OpenStreetMap · demo use only
                </p>
              </CardBody>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
