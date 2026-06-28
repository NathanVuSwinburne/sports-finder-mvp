/**
 * Hand-written database types mirroring supabase/migrations.
 * Keep in sync with the SQL schema. (You can later regenerate this with the
 * Supabase CLI: `supabase gen types typescript`.)
 */

export type SkillLevel = "beginner" | "casual" | "intermediate" | "competitive";
export type EventStatus = "open" | "full" | "cancelled" | "completed";
export type ParticipantStatus =
  | "joined"
  | "waitlisted"
  | "cancelled"
  | "attended"
  | "no_show";
export type ReportTarget = "user" | "event";

export type ReviewTag =
  | "beginner-friendly"
  | "well-organised"
  | "good-vibe"
  | "too-competitive"
  | "no-show-issue";

export interface ProfileRow {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  suburb: string | null;
  university: string | null;
  skill_level: SkillLevel;
  preferred_sports: string[];
  attendance_count: number;
  no_show_count: number;
  hosted_events_count: number;
  created_at: string;
}

export interface SportRow {
  id: string;
  name: string;
  slug: string;
}

export interface VenueRow {
  id: string;
  name: string;
  address: string | null;
  suburb: string;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  price_hint: string | null;
  created_at: string;
}

export interface EventRow {
  id: string;
  host_id: string;
  sport_id: string;
  venue_id: string | null;
  title: string;
  description: string | null;
  start_at: string;
  end_at: string | null;
  price_cents: number;
  capacity: number;
  min_players: number;
  skill_level: SkillLevel;
  beginner_friendly: boolean;
  rules: string | null;
  status: EventStatus;
  created_at: string;
}

export interface EventParticipantRow {
  id: string;
  event_id: string;
  user_id: string;
  status: ParticipantStatus;
  joined_at: string;
}

export interface EventMessageRow {
  id: string;
  event_id: string;
  user_id: string;
  body: string;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  event_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  tags: string[];
  comment: string | null;
  created_at: string;
}

export interface ReportRow {
  id: string;
  reporter_id: string;
  target_type: ReportTarget;
  target_id: string;
  reason: string;
  created_at: string;
}

/** Generic helper: Insert = required minus DB-defaulted, Update = all partial. */
type Insert<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

type TableDef<Row, Ins, Upd> = { Row: Row; Insert: Ins; Update: Upd };

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<
        ProfileRow,
        Insert<
          ProfileRow,
          | "avatar_url"
          | "bio"
          | "suburb"
          | "university"
          | "skill_level"
          | "preferred_sports"
          | "attendance_count"
          | "no_show_count"
          | "hosted_events_count"
          | "created_at"
        >,
        Partial<ProfileRow>
      >;
      sports: TableDef<SportRow, SportRow, Partial<SportRow>>;
      venues: TableDef<
        VenueRow,
        Insert<
          VenueRow,
          | "id"
          | "address"
          | "latitude"
          | "longitude"
          | "google_maps_url"
          | "price_hint"
          | "created_at"
        >,
        Partial<VenueRow>
      >;
      events: TableDef<
        EventRow,
        Insert<
          EventRow,
          | "id"
          | "venue_id"
          | "description"
          | "end_at"
          | "price_cents"
          | "min_players"
          | "skill_level"
          | "beginner_friendly"
          | "rules"
          | "status"
          | "created_at"
        >,
        Partial<EventRow>
      >;
      event_participants: TableDef<
        EventParticipantRow,
        Insert<EventParticipantRow, "id" | "status" | "joined_at">,
        Partial<EventParticipantRow>
      >;
      event_messages: TableDef<
        EventMessageRow,
        Insert<EventMessageRow, "id" | "created_at">,
        Partial<EventMessageRow>
      >;
      reviews: TableDef<
        ReviewRow,
        Insert<ReviewRow, "id" | "tags" | "comment" | "created_at">,
        Partial<ReviewRow>
      >;
      reports: TableDef<
        ReportRow,
        Insert<ReportRow, "id" | "created_at">,
        Partial<ReportRow>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      is_event_member: {
        Args: { p_event_id: string; p_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      skill_level: SkillLevel;
      event_status: EventStatus;
      participant_status: ParticipantStatus;
      report_target: ReportTarget;
    };
  };
}
