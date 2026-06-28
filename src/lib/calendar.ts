/** Format a date as the compact UTC stamp Google Calendar expects: 20260703T080000Z */
function toGCalStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * "Add to Google Calendar" link (no OAuth — just a prefilled template URL).
 */
export function googleCalendarUrl(args: {
  title: string;
  start: string;
  end?: string | null;
  details?: string | null;
  location?: string | null;
}): string {
  const start = toGCalStamp(args.start);
  // Default to a 2-hour block when no end time is set.
  const end = toGCalStamp(
    args.end ?? new Date(new Date(args.start).getTime() + 2 * 60 * 60 * 1000).toISOString(),
  );
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: args.title,
    dates: `${start}/${end}`,
  });
  if (args.details) params.set("details", args.details);
  if (args.location) params.set("location", args.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * External Google Maps search link from venue name + suburb (NOT the Maps API).
 * Falls back to a stored google_maps_url if present.
 */
export function directionsUrl(args: {
  google_maps_url?: string | null;
  name?: string | null;
  address?: string | null;
  suburb?: string | null;
}): string {
  if (args.google_maps_url) return args.google_maps_url;
  const query = [args.name, args.address, args.suburb, "VIC", "Australia"]
    .filter(Boolean)
    .join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
