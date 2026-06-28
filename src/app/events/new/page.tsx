import { Card, CardBody } from "@/components/ui/Card";
import { CreateEventForm } from "@/components/events/CreateEventForm";
import { requireUser } from "@/lib/auth";

export const metadata = {
  title: "Host a game · SportsFinder",
};

export default async function NewEventPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Host a badminton game
      </h1>
      <p className="mt-1 text-slate-600">
        Set the details so players know exactly what to expect.
      </p>

      <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
        ⚠️ <strong>Public venue recommended.</strong> Always host at a public
        venue (a stadium, rec centre or community hall) — never your home
        address. It keeps everyone safe and welcome.
      </div>

      <Card className="mt-6">
        <CardBody className="p-6">
          <CreateEventForm />
        </CardBody>
      </Card>
    </div>
  );
}
