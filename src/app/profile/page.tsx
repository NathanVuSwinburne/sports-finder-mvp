import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { ProfileSummary } from "@/components/profile/ProfileSummary";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { requireUser, getCurrentProfile } from "@/lib/auth";

export const metadata = { title: "Your profile · SportsFinder" };

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-600">
          We couldn&rsquo;t load your profile. Make sure the database is set up.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your profile</h1>
        <SignOutButton />
      </div>

      <div className="mt-6">
        <ProfileSummary profile={profile} />
      </div>

      <div className="mt-3 flex gap-4 text-sm">
        <Link href={`/profile/${user.id}`} className="font-medium text-brand-600 hover:text-brand-700">
          View public profile
        </Link>
        <Link href="/my-events" className="font-medium text-brand-600 hover:text-brand-700">
          My events
        </Link>
      </div>

      <Card className="mt-6">
        <CardBody className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit details</h2>
          <ProfileForm profile={profile} />
        </CardBody>
      </Card>
    </div>
  );
}
