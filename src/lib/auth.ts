import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";
import type { User } from "@supabase/supabase-js";

/** True when Supabase env vars are configured. */
export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Current authenticated user, or null. Safe to call before Supabase is
 * configured (returns null instead of throwing) so the UI degrades gracefully.
 */
export async function getSessionUser(): Promise<User | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** Current user's profile row, or null. */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    return data ?? null;
  } catch {
    return null;
  }
}
