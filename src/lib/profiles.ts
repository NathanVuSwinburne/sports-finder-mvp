import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/auth";
import type { ProfileRow } from "@/types/database";

/** A single profile by id, or null. */
export async function fetchProfile(id: string): Promise<ProfileRow | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("fetchProfile:", error.message);
    return null;
  }
  return data ?? null;
}
