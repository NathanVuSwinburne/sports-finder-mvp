import type { ProfileRow } from "@/types/database";

export type ShowUp = {
  /** Fewer than 3 completed sessions — show "New player". */
  isNew: boolean;
  /** Show-up rate as a whole number 0–100, or null when isNew. */
  rate: number | null;
  /** attended + no_show */
  completed: number;
};

const MIN_COMPLETED = 3;

/**
 * Show-up score: attended / (attended + no_show).
 * Anyone with fewer than 3 completed joined events is a "New player".
 */
export function showUp(profile: Pick<ProfileRow, "attendance_count" | "no_show_count">): ShowUp {
  const completed = profile.attendance_count + profile.no_show_count;
  if (completed < MIN_COMPLETED) {
    return { isNew: true, rate: null, completed };
  }
  const rate = Math.round((profile.attendance_count / completed) * 100);
  return { isNew: false, rate, completed };
}

/** A host is "reliable" with a strong show-up rate and a track record of hosting. */
export function isReliableHost(
  profile: Pick<ProfileRow, "attendance_count" | "no_show_count" | "hosted_events_count">,
): boolean {
  const s = showUp(profile);
  return !s.isNew && (s.rate ?? 0) >= 85 && profile.hosted_events_count >= 2;
}

export const SKILL_LABELS = {
  beginner: "Beginner",
  casual: "Casual",
  intermediate: "Intermediate",
  competitive: "Competitive",
} as const;

export const STATUS_LABELS = {
  open: "Open",
  full: "Full",
  cancelled: "Cancelled",
  completed: "Completed",
} as const;
