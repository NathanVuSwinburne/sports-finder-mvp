import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ReliabilityBadge } from "@/components/ReliabilityBadge";
import { SKILL_LABELS } from "@/lib/reliability";
import { SPORT_OPTIONS } from "@/lib/constants";
import type { ProfileRow } from "@/types/database";

function sportLabel(slug: string): string {
  return SPORT_OPTIONS.find((s) => s.slug === slug)?.label ?? slug;
}

export function ProfileSummary({ profile }: { profile: ProfileRow }) {
  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <Avatar name={profile.display_name} src={profile.avatar_url} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{profile.display_name}</h1>
            <p className="text-sm text-slate-500">
              {[profile.suburb, profile.university].filter(Boolean).join(" · ") || "Melbourne"}
            </p>
            <div className="mt-2">
              <ReliabilityBadge profile={profile} asHost showNoShows />
            </div>
          </div>
        </div>

        {profile.bio && <p className="mt-4 text-slate-700">{profile.bio}</p>}

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="brand">{SKILL_LABELS[profile.skill_level]}</Badge>
          {profile.preferred_sports.map((s) => (
            <Badge key={s} tone="slate">{sportLabel(s)}</Badge>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <Stat label="Attended" value={profile.attendance_count} />
          <Stat label="No-shows" value={profile.no_show_count} />
          <Stat label="Hosted" value={profile.hosted_events_count} />
        </div>
      </CardBody>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
