"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { melbourneToUtcISO } from "@/lib/format";
import { DEFAULT_SPORT_SLUG } from "@/lib/constants";
import type { SkillLevel } from "@/types/database";

export type CreateState = { error: string } | null;

const SKILLS: SkillLevel[] = ["beginner", "casual", "intermediate", "competitive"];

export async function createEventAction(
  _prev: CreateState,
  formData: FormData,
): Promise<CreateState> {
  const user = await getSessionUser();
  if (!user) redirect("/auth/sign-in?next=protected");

  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const title = get("title");
  const description = get("description");
  const venueName = get("venue_name");
  const suburb = get("suburb");
  const addressOrLink = get("address");
  const date = get("date");
  const time = get("time");
  const durationMin = Number(get("duration") || "120");
  const priceDollars = Number(get("price") || "0");
  const capacity = Number(get("capacity") || "0");
  const minPlayers = Number(get("min_players") || "1");
  const skill = get("skill_level") as SkillLevel;
  const beginnerFriendly = formData.get("beginner_friendly") === "1";
  const rules = get("rules");

  // ---- validation -------------------------------------------------------
  if (!title) return { error: "Please add a title." };
  if (!venueName) return { error: "Please add a venue name." };
  if (!suburb) return { error: "Please add a suburb." };
  if (!date || !time) return { error: "Please choose a date and time." };
  if (!SKILLS.includes(skill)) return { error: "Please choose a skill level." };
  if (!Number.isFinite(capacity) || capacity < 2) {
    return { error: "Capacity must be at least 2." };
  }
  if (!Number.isFinite(minPlayers) || minPlayers < 1 || minPlayers > capacity) {
    return { error: "Minimum players must be between 1 and the capacity." };
  }
  if (!Number.isFinite(priceDollars) || priceDollars < 0) {
    return { error: "Price can't be negative." };
  }

  const startAt = melbourneToUtcISO(date, time);
  if (new Date(startAt).getTime() < Date.now()) {
    return { error: "Please pick a date and time in the future." };
  }
  const endAt = new Date(
    new Date(startAt).getTime() + durationMin * 60000,
  ).toISOString();

  const isLink = /^https?:\/\//i.test(addressOrLink);

  const supabase = await createClient();

  // Sport (badminton in v1)
  const { data: sport } = await supabase
    .from("sports")
    .select("id")
    .eq("slug", DEFAULT_SPORT_SLUG)
    .maybeSingle();
  if (!sport) {
    return { error: "Sport not configured. Apply supabase/seed.sql first." };
  }

  // Create the venue inline (no separate venue admin in v1).
  const { data: venue, error: venueError } = await supabase
    .from("venues")
    .insert({
      name: venueName,
      suburb,
      address: isLink ? null : addressOrLink || null,
      google_maps_url: isLink ? addressOrLink : null,
    })
    .select("id")
    .single();
  if (venueError || !venue) {
    return { error: venueError?.message ?? "Could not save the venue." };
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .insert({
      host_id: user.id,
      sport_id: sport.id,
      venue_id: venue.id,
      title,
      description: description || null,
      start_at: startAt,
      end_at: endAt,
      price_cents: Math.round(priceDollars * 100),
      capacity,
      min_players: minPlayers,
      skill_level: skill,
      beginner_friendly: beginnerFriendly,
      rules: rules || null,
      status: "open",
    })
    .select("id")
    .single();
  if (eventError || !event) {
    return { error: eventError?.message ?? "Could not create the event." };
  }

  revalidatePath("/events");
  revalidatePath("/my-events");
  redirect(`/events/${event.id}`);
}
