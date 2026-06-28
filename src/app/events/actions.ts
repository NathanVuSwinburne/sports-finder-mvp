"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";

export type JoinState = { error?: string; ok?: string } | null;

function revalidateEvent(eventId: string) {
  revalidatePath(`/events/${eventId}`);
  revalidatePath("/events");
  revalidatePath("/my-events");
}

/** Join an event (or its waitlist if full). Prevents duplicate joins. */
export async function joinEventAction(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const eventId = String(formData.get("event_id") ?? "");
  const user = await getSessionUser();
  if (!user) return { error: "Please sign in to join." };
  if (!eventId) return { error: "Missing event." };

  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, status, capacity")
    .eq("id", eventId)
    .maybeSingle();
  if (!event) return { error: "Event not found." };
  if (event.status === "cancelled" || event.status === "completed") {
    return { error: "This event is closed." };
  }

  const { data: parts } = await supabase
    .from("event_participants")
    .select("id, user_id, status")
    .eq("event_id", eventId);

  const rows = parts ?? [];
  const confirmed = rows.filter(
    (p) => p.status === "joined" || p.status === "attended",
  ).length;
  const mine = rows.find((p) => p.user_id === user.id);

  if (mine && (mine.status === "joined" || mine.status === "waitlisted")) {
    return { error: "You have already joined this event." };
  }

  const nextStatus = confirmed < event.capacity ? "joined" : "waitlisted";

  const { error } = mine
    ? await supabase
        .from("event_participants")
        .update({ status: nextStatus, joined_at: new Date().toISOString() })
        .eq("id", mine.id)
    : await supabase
        .from("event_participants")
        .insert({ event_id: eventId, user_id: user.id, status: nextStatus });

  if (error) return { error: error.message };

  revalidateEvent(eventId);
  return {
    ok: nextStatus === "joined" ? "You're in! See you on court." : "Added to the waitlist.",
  };
}

/** Leave an event before it starts. The DB trigger promotes the next waitlister. */
export async function leaveEventAction(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const eventId = String(formData.get("event_id") ?? "");
  const user = await getSessionUser();
  if (!user) return { error: "Please sign in." };
  if (!eventId) return { error: "Missing event." };

  const supabase = await createClient();

  const { data: mine } = await supabase
    .from("event_participants")
    .select("id, status")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!mine || mine.status === "cancelled") {
    return { error: "You are not in this event." };
  }

  const { error } = await supabase
    .from("event_participants")
    .update({ status: "cancelled" })
    .eq("id", mine.id);

  if (error) return { error: error.message };

  revalidateEvent(eventId);
  return { ok: "You've left this event." };
}

/** Post a message to an event board. RLS allows only the host + joined players. */
export async function postMessageAction(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const eventId = String(formData.get("event_id") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const user = await getSessionUser();
  if (!user) return { error: "Please sign in." };
  if (!eventId) return { error: "Missing event." };
  if (!body) return { error: "Message can't be empty." };
  if (body.length > 1000) return { error: "Message is too long (max 1000)." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("event_messages")
    .insert({ event_id: eventId, user_id: user.id, body });

  if (error) return { error: "Only joined players and the host can post here." };

  revalidatePath(`/events/${eventId}`);
  return { ok: "sent" };
}

/** Host marks a player attended / no-show. Reliability counters update via trigger. */
export async function markAttendance(formData: FormData): Promise<void> {
  const eventId = String(formData.get("event_id") ?? "");
  const targetId = String(formData.get("user_id") ?? "");
  const status = String(formData.get("status") ?? "");
  const user = await getSessionUser();
  if (!user || !eventId || !targetId) return;
  if (status !== "attended" && status !== "no_show") return;

  const supabase = await createClient();
  const { data: ev } = await supabase
    .from("events")
    .select("host_id")
    .eq("id", eventId)
    .maybeSingle();
  if (!ev || ev.host_id !== user.id) return; // host only

  await supabase
    .from("event_participants")
    .update({ status })
    .eq("event_id", eventId)
    .eq("user_id", targetId);

  revalidatePath(`/events/${eventId}`);
}

/** Host marks the event completed (unlocks attendance + reviews). */
export async function completeEvent(formData: FormData): Promise<void> {
  const eventId = String(formData.get("event_id") ?? "");
  const user = await getSessionUser();
  if (!user || !eventId) return;

  const supabase = await createClient();
  await supabase
    .from("events")
    .update({ status: "completed" })
    .eq("id", eventId)
    .eq("host_id", user.id);

  revalidatePath(`/events/${eventId}`);
}

/** A joined player reviews the host after a completed event. */
export async function submitReviewAction(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const eventId = String(formData.get("event_id") ?? "");
  const rating = Number(formData.get("rating") ?? 0);
  const tags = formData.getAll("tags").map(String);
  const comment = String(formData.get("comment") ?? "").trim();
  const user = await getSessionUser();
  if (!user) return { error: "Please sign in." };
  if (!eventId) return { error: "Missing event." };
  if (!(rating >= 1 && rating <= 5)) return { error: "Please choose a rating." };

  const supabase = await createClient();

  const { data: ev } = await supabase
    .from("events")
    .select("host_id, status")
    .eq("id", eventId)
    .maybeSingle();
  if (!ev) return { error: "Event not found." };
  if (ev.status !== "completed") {
    return { error: "You can review once the event is completed." };
  }
  if (ev.host_id === user.id) return { error: "You can't review your own event." };

  const { data: part } = await supabase
    .from("event_participants")
    .select("status")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!part || part.status === "cancelled" || part.status === "waitlisted") {
    return { error: "Only players who joined can leave a review." };
  }

  const { error } = await supabase.from("reviews").insert({
    event_id: eventId,
    reviewer_id: user.id,
    reviewee_id: ev.host_id,
    rating,
    tags,
    comment: comment || null,
  });
  if (error) {
    return {
      error:
        error.code === "23505"
          ? "You've already reviewed this event."
          : error.message,
    };
  }

  revalidatePath(`/events/${eventId}`);
  return { ok: "Thanks for your review!" };
}
