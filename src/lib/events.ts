import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/auth";
import type {
  EventRow,
  ProfileRow,
  VenueRow,
  SportRow,
  EventParticipantRow,
  ParticipantStatus,
} from "@/types/database";

export type ParticipantLite = { status: ParticipantStatus };

export type EventWithRelations = EventRow & {
  venue: VenueRow | null;
  host: ProfileRow | null;
  participants: ParticipantLite[];
};

export type ParticipantWithProfile = EventParticipantRow & {
  profile: ProfileRow | null;
};

export type EventDetail = EventRow & {
  venue: VenueRow | null;
  host: ProfileRow | null;
  sport: SportRow | null;
  participants: ParticipantWithProfile[];
};

const SELECT = `
  *,
  venue:venues(*),
  host:profiles!events_host_id_fkey(*),
  participants:event_participants(status)
`;

/** Statuses that count as a confirmed, present player. */
const CONFIRMED: ParticipantStatus[] = ["joined", "attended"];

export type EventStats = {
  confirmed: number;
  waitlisted: number;
  spotsLeft: number;
  isFull: boolean;
};

export function deriveEventStats(event: {
  capacity: number;
  status: EventRow["status"];
  participants: ParticipantLite[];
}): EventStats {
  const parts = event.participants ?? [];
  const confirmed = parts.filter((p) => CONFIRMED.includes(p.status)).length;
  const waitlisted = parts.filter((p) => p.status === "waitlisted").length;
  const spotsLeft = Math.max(event.capacity - confirmed, 0);
  const isFull = event.status === "full" || spotsLeft === 0;
  return { confirmed, waitlisted, spotsLeft, isFull };
}

/** All events with venue, host and participant statuses, soonest first. */
export async function fetchEvents(): Promise<EventWithRelations[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SELECT)
    .order("start_at", { ascending: true });

  if (error) {
    console.error("fetchEvents:", error.message);
    return [];
  }
  return (data ?? []) as unknown as EventWithRelations[];
}

/** A single event with relations, or null if not found. */
export async function fetchEventById(
  id: string,
): Promise<EventWithRelations | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("fetchEventById:", error.message);
    return null;
  }
  return (data as unknown as EventWithRelations) ?? null;
}

const DETAIL_SELECT = `
  *,
  venue:venues(*),
  host:profiles!events_host_id_fkey(*),
  sport:sports(*),
  participants:event_participants(*, profile:profiles(*))
`;

/** A single event with venue, host, sport and full participant list (with profiles). */
export async function fetchEventDetail(id: string): Promise<EventDetail | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(DETAIL_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("fetchEventDetail:", error.message);
    return null;
  }
  return (data as unknown as EventDetail) ?? null;
}

/** Unique, sorted suburb list from a set of events (for the filter dropdown). */
export function suburbsFromEvents(events: EventWithRelations[]): string[] {
  const set = new Set<string>();
  for (const e of events) if (e.venue?.suburb) set.add(e.venue.suburb);
  return [...set].sort();
}
