import { Card, CardBody } from "@/components/ui/Card";

export const metadata = {
  title: "Community guidelines · SportsFinder",
};

const dos = [
  "Be welcoming — especially to beginners and newcomers.",
  "Show up if you say you will. If plans change, leave the event early so your spot frees up.",
  "Meet at public venues — stadiums, rec centres, community halls.",
  "Use your suburb/general area, never your home address.",
  "Communicate clearly in the event chat.",
];

const donts = [
  "No harassment, discrimination or aggressive behaviour.",
  "No spam, scams or self-promotion.",
  "No filming or photographing people without their consent.",
  "No repeated no-shows — it ruins games for everyone.",
  "No pressuring people to play above their skill or comfort level.",
];

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Community guidelines
      </h1>
      <p className="mt-2 text-slate-600">
        SportsFinder works because people are friendly and reliable. A few simple
        rules keep it that way for students, newcomers and beginners.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-semibold text-emerald-700">✅ Please do</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {dos.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="font-semibold text-red-700">🚫 Please don&rsquo;t</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {donts.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="text-red-500">✕</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardBody>
          <h2 className="font-semibold text-slate-900">Staying safe</h2>
          <p className="mt-2 text-sm text-slate-700">
            Always meet at a <strong>public venue</strong>. Don&rsquo;t share your
            home address, and don&rsquo;t feel pressured to share personal contact
            details. If someone makes you uncomfortable, use the{" "}
            <strong>Report</strong> button on their profile or the event — our team
            reviews every report.
          </p>
        </CardBody>
      </Card>

      <Card className="mt-6">
        <CardBody>
          <h2 className="font-semibold text-slate-900">Reliability &amp; show-up scores</h2>
          <p className="mt-2 text-sm text-slate-700">
            After each game, hosts mark who attended. Your show-up rate is shown on
            your profile so reliable players stand out. New players start with a{" "}
            <strong>&ldquo;New player&rdquo;</strong> badge until they&rsquo;ve completed a
            few games — everyone gets a fair start.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
