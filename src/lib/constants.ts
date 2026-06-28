import type { SkillLevel, ReviewTag } from "@/types/database";

export const SKILL_OPTIONS: { value: SkillLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "casual", label: "Casual" },
  { value: "intermediate", label: "Intermediate" },
  { value: "competitive", label: "Competitive" },
];

export const SPORT_OPTIONS: { slug: string; label: string }[] = [
  { slug: "badminton", label: "Badminton" },
  { slug: "basketball", label: "Basketball" },
  { slug: "soccer", label: "Soccer" },
  { slug: "pickleball", label: "Pickleball" },
  { slug: "volleyball", label: "Volleyball" },
  { slug: "futsal", label: "Futsal" },
];

export const REVIEW_TAG_OPTIONS: { value: ReviewTag; label: string }[] = [
  { value: "beginner-friendly", label: "Beginner-friendly" },
  { value: "well-organised", label: "Well-organised" },
  { value: "good-vibe", label: "Good vibe" },
  { value: "too-competitive", label: "Too competitive" },
  { value: "no-show-issue", label: "No-show issue" },
];

export const REPORT_REASONS = [
  "Harassment or aggressive behaviour",
  "Spam or scam",
  "Inappropriate content",
  "Filming without consent",
  "No-show / unreliable",
  "Other",
] as const;

/** Default sport for v1. */
export const DEFAULT_SPORT_SLUG = "badminton";
