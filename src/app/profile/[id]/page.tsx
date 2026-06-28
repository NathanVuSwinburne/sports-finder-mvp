import { notFound } from "next/navigation";
import { ProfileSummary } from "@/components/profile/ProfileSummary";
import { EventCard } from "@/components/events/EventCard";
import { ReportButton } from "@/components/safety/ReportButton";
import { BlockButton } from "@/components/safety/BlockButton";
import { fetchProfile } from "@/lib/profiles";
import { fetchEvents } from "@/lib/events";
import { getSessionUser } from "@/lib/auth";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, allEvents, user] = await Promise.all([
    fetchProfile(id),
    fetchEvents(),
    getSessionUser(),
  ]);

  if (!profile) notFound();

  const hosted = allEvents.filter((e) => e.host_id === id);
  const isSelf = user?.id === id;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ProfileSummary profile={profile} />

      {!isSelf && (
        <div className="mt-3 flex items-center gap-4">
          <ReportButton targetType="user" targetId={id} signedIn={Boolean(user)} />
          <BlockButton />
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Games hosted by {profile.display_name}
        </h2>
        {hosted.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No games hosted yet.</p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {hosted.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
