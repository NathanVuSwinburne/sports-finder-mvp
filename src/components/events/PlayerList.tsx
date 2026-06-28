import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ReliabilityBadge } from "@/components/ReliabilityBadge";
import type { ParticipantWithProfile } from "@/lib/events";

export function PlayerList({
  title,
  players,
  emptyText,
  hostId,
}: {
  title: string;
  players: ParticipantWithProfile[];
  emptyText?: string;
  hostId?: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title} ({players.length})
      </h3>
      {players.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText ?? "No one yet."}</p>
      ) : (
        <ul className="space-y-2">
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-3">
              <Avatar name={p.profile?.display_name ?? "Player"} src={p.profile?.avatar_url} size="sm" />
              <Link
                href={`/profile/${p.user_id}`}
                className="text-sm font-medium text-slate-800 hover:text-brand-700"
              >
                {p.profile?.display_name ?? "Player"}
              </Link>
              {p.user_id === hostId && <Badge tone="brand">Host</Badge>}
              {p.status === "no_show" && <Badge tone="red">No-show</Badge>}
              {p.status === "attended" && <Badge tone="emerald">Attended</Badge>}
              <span className="ml-auto">
                {p.profile && <ReliabilityBadge profile={p.profile} />}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
