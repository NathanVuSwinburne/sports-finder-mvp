import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";

const reasons = [
  {
    icon: "🎯",
    title: "Clear skill level",
    body: "Every session says beginner, casual, intermediate or competitive — so you never show up to the wrong game.",
  },
  {
    icon: "💸",
    title: "Clear price upfront",
    body: "Free or paid, shown before you join. No surprise court fees split awkwardly on the day.",
  },
  {
    icon: "✅",
    title: "Confirmed spots",
    body: "See exactly how many players are confirmed and how many spots are left. Full means full.",
  },
  {
    icon: "⭐",
    title: "Host reliability",
    body: "Hosts and players build a show-up score. Flaky no-shows are visible; reliable people stand out.",
  },
  {
    icon: "🌱",
    title: "Beginner-friendly tags",
    body: "Sessions made for newcomers are clearly marked, so a first-timer always has somewhere to start.",
  },
  {
    icon: "📍",
    title: "Real venues, by suburb",
    body: "Filter by suburb and meet at public venues — never anyone's home address.",
  },
];

const steps = [
  { n: "1", title: "Browse by suburb", body: "Filter friendly badminton sessions near you by area, skill, date and price." },
  { n: "2", title: "Join or waitlist", body: "Grab a confirmed spot in one tap, or hop on the waitlist if it's full." },
  { n: "3", title: "Show up & play", body: "Meet at a public venue, play, and build your reliability score together." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="emerald" className="mb-5">
              🏸 Now in Melbourne · Badminton first
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Find friendly badminton games near you
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Beginner-friendly sessions with clear price, location and skill level —
              and people who <span className="font-semibold text-slate-900">actually show up</span>.
              Made for international students, newcomers and casual players.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/events" size="lg" className="w-full sm:w-auto">
                Browse events
              </ButtonLink>
              <ButtonLink href="/events/new" size="lg" variant="outline" className="w-full sm:w-auto">
                Host a game
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Free to join · No app download · Public venues only
            </p>
          </div>
        </div>
      </section>

      {/* Why better than Facebook groups */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Better than messy Facebook groups
          </h2>
          <p className="mt-3 text-slate-600">
            Facebook groups are noisy, unreliable and not sport-specific. People RSVP and
            ghost. SportsFinder is built around one thing: <strong>trust</strong>.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r) => (
            <Card key={r.title}>
              <CardBody>
                <div className="text-2xl">{r.icon}</div>
                <h3 className="mt-3 font-semibold text-slate-900">{r.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{r.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Made for people finding their feet
            </h2>
            <p className="mt-3 text-slate-600">
              New to the city or new to the sport? You belong here. No pressure, no cliques —
              just welcoming games where beginners are the point, not an afterthought.
            </p>
            <ul className="mt-5 space-y-2 text-slate-700">
              {[
                "International students settling into Melbourne",
                "Newcomers who want to meet people through sport",
                "Casual players looking for a regular hit",
                "Total beginners picking up a racket for the first time",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="bg-gradient-to-br from-brand-600 to-violet-600 text-white">
            <CardBody className="p-8">
              <p className="text-lg font-medium leading-relaxed">
                &ldquo;Find beginner-friendly badminton sessions near you, with clear price,
                location, skill level, and people who actually show up.&rdquo;
              </p>
              <div className="mt-6">
                <ButtonLink href="/auth/sign-up" variant="secondary" size="md">
                  Create your free account
                </ButtonLink>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
