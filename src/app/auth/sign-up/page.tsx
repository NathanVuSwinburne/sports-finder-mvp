import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { getSessionUser } from "@/lib/auth";

export default async function SignUpPage() {
  const user = await getSessionUser();
  if (user) redirect("/events");

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">
          Free forever. Join friendly games near you.
        </p>
      </div>

      <Card>
        <CardBody>
          <SignUpForm />
        </CardBody>
      </Card>

      <p className="mt-4 text-center text-xs text-slate-500">
        By creating an account you agree to play fair and follow our{" "}
        <Link href="/guidelines" className="underline hover:text-slate-700">
          community guidelines
        </Link>
        .
      </p>

      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="font-semibold text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
