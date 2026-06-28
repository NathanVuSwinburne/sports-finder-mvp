const TZ = "Australia/Melbourne";

/** "$12", "$12.50", or "Free". */
export function formatPrice(cents: number): string {
  if (!cents) return "Free";
  const dollars = cents / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

/** "Fri 3 Jul · 6:00 pm" (Melbourne time). */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TZ,
  }).format(d);
  const time = new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  })
    .format(d)
    .toLowerCase();
  return `${date} · ${time}`;
}

/** "6:00 pm" (Melbourne time). */
export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  })
    .format(new Date(iso))
    .toLowerCase();
}

/** "Friday 3 July 2026" (Melbourne time). */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** Minutes that `tz` is ahead of UTC at the given instant. */
function tzOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUTC = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    map.hour === 24 ? 0 : map.hour,
    map.minute,
    map.second,
  );
  return (asUTC - date.getTime()) / 60000;
}

/**
 * Convert a Melbourne wall-clock date + time into a UTC ISO string,
 * accounting for AEST/AEDT. `date` is "YYYY-MM-DD", `time` is "HH:MM".
 */
export function melbourneToUtcISO(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const offset = tzOffsetMinutes(new Date(guess), TZ);
  return new Date(guess - offset * 60000).toISOString();
}

/** Melbourne calendar-day key (YYYY-MM-DD) for date filtering. */
export function melbourneDateKey(iso: string): string {
  // en-CA gives ISO-style YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}
