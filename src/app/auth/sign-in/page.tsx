import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { SignInForm } from "@/components/auth/SignInForm";
import { getSessionUser } from "@/lib/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; next?: string }>;
}) {
  const [user, params] = await Promise.all([getSessionUser(), searchParams]);
  if (user) redirect("/events");

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in to join games and chat with hosts.
        </p>
      </div>

      {params.registered && (
        <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          Account created! Please confirm your email if prompted, then sign in.
        </div>
      )}
      {params.next === "protected" && (
        <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Please sign in to continue.
        </div>
      )}

      <Card>
        <CardBody>
          <SignInForm />
        </CardBody>
      </Card>

      <p className="mt-5 text-center text-sm text-slate-600">
        New here?{" "}
        <Link href="/auth/sign-up" className="font-semibold text-brand-600 hover:text-brand-700">
          Create an account
        </Link>
      </p>
    </div>
  );
}
