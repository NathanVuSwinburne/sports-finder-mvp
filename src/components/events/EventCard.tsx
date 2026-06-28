import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ReliabilityBadge } from "@/components/ReliabilityBadge";
import { deriveEventStats, type EventWithRelations } from "@/lib/events";
import { formatDateTime, formatPrice } from "@/lib/format";
import { SKILL_LABELS, STATUS_LABELS } from "@/lib/reliability";

const STATUS_TONE = {
  open: "emerald",
  full: "amber",
  cancelled: "red",
  completed: "slate",
} as const;

export function EventCard({ event }: { event: EventWithRelations }) {
  const stats = deriveEventStats(event);
  const isActive = event.status === "open" || event.status === "full";

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <Link href={`/events/${event.id}`} className="flex h-full flex-col p-5">
        {/* Top badges */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Badge tone={STATUS_TONE[event.status]}>{STATUS_LABELS[event.status]}</Badge>
          {event.beginner_friendly && <Badge tone="emerald">🌱 Beginner-friendly</Badge>}
          <Badge tone="slate">{SKILL_LABELS[event.skill_level]}</Badge>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-slate-900">
          {event.title}
        </h3>

        <div className="mt-2 space-y-1 text-sm text-slate-600">
          <p className="flex items-center gap-1.5">
            <span aria-hidden>📍</span>
            {event.venue?.name ?? "Venue TBC"}
            {event.venue?.suburb && <span className="text-slate-400">· {event.venue.suburb}</span>}
          </p>
          <p className="flex items-center gap-1.5">
            <span aria-hidden>🗓️</span>
            {formatDateTime(event.start_at)}
          </p>
        </div>

        {/* Price + capacity */}
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="font-semibold text-slate-900">{formatPrice(event.price_cents)}</span>
          <span className="text-slate-300">|</span>
          <span className={isActive && stats.spotsLeft <= 2 && stats.spotsLeft > 0 ? "font-medium text-amber-600" : "text-slate-600"}>
            {stats.confirmed}/{event.capacity} joined
            {stats.isFull && isActive && " · full"}
            {!stats.isFull && isActive && stats.spotsLeft <= 2 && ` · ${stats.spotsLeft} left`}
          </span>
        </div>
        {event.min_players > 1 && stats.confirmed < event.min_players && isActive && (
          <p className="mt-1 text-xs text-slate-500">
            Needs {event.min_players - stats.confirmed} more to reach the {event.min_players} minimum
          </p>
        )}
        {stats.waitlisted > 0 && (
          <p className="mt-1 text-xs text-amber-600">{stats.waitlisted} on waitlist</p>
        )}

        {/* Host */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Avatar name={event.host?.display_name ?? "Host"} src={event.host?.avatar_url} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {event.host?.display_name ?? "Host"}
            </p>
          </div>
          <div className="ml-auto">
            {event.host && <ReliabilityBadge profile={event.host} asHost />}
          </div>
        </div>
      </Link>
    </Card>
  );
}
