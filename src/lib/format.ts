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
