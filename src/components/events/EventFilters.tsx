import Link from "next/link";
import { Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { SKILL_OPTIONS } from "@/lib/constants";

export type EventFilterValues = {
  suburb?: string;
  skill?: string;
  price?: string;
  date?: string;
  beginner?: string;
};

export function EventFilters({
  suburbs,
  values,
}: {
  suburbs: string[];
  values: EventFilterValues;
}) {
  const hasFilters = Boolean(
    values.suburb || values.skill || values.price || values.date || values.beginner,
  );

  return (
    <form method="get" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label htmlFor="suburb">Suburb</Label>
          <Select id="suburb" name="suburb" defaultValue={values.suburb ?? ""}>
            <option value="">All suburbs</option>
            {suburbs.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="skill">Skill level</Label>
          <Select id="skill" name="skill" defaultValue={values.skill ?? ""}>
            <option value="">Any level</option>
            {SKILL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Select id="price" name="price" defaultValue={values.price ?? ""}>
            <option value="">Free &amp; paid</option>
            <option value="free">Free only</option>
            <option value="paid">Paid only</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={values.date ?? ""}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="flex items-end">
          <label className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-3.5 text-sm text-slate-700">
            <input
              type="checkbox"
              name="beginner"
              value="1"
              defaultChecked={values.beginner === "1"}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Beginner-friendly
          </label>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button type="submit" size="sm">Apply filters</Button>
        {hasFilters && (
          <Link
            href="/events"
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
