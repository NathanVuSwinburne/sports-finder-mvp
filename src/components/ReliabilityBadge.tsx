import { Badge } from "@/components/ui/Badge";
import { showUp, isReliableHost } from "@/lib/reliability";
import type { ProfileRow } from "@/types/database";

type Props = {
  profile: Pick<
    ProfileRow,
    "attendance_count" | "no_show_count" | "hosted_events_count"
  >;
  /** Also show a "Reliable host" badge when earned. */
  asHost?: boolean;
  /** Show the no-show count when there is one. */
  showNoShows?: boolean;
};

/** Show-up score badge(s): "New player", "92% show-up", optional "Reliable host". */
export function ReliabilityBadge({ profile, asHost, showNoShows }: Props) {
  const s = showUp(profile);

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {asHost && isReliableHost(profile) && (
        <Badge tone="violet">⭐ Reliable host</Badge>
      )}
      {s.isNew ? (
        <Badge tone="blue">New player</Badge>
      ) : (
        <Badge tone={(s.rate ?? 0) >= 85 ? "emerald" : (s.rate ?? 0) >= 60 ? "amber" : "red"}>
          {s.rate}% show-up
        </Badge>
      )}
      {showNoShows && profile.no_show_count > 0 && (
        <Badge tone="slate">{profile.no_show_count} no-show{profile.no_show_count > 1 ? "s" : ""}</Badge>
      )}
    </span>
  );
}
