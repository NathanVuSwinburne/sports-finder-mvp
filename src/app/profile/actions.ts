"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import type { SkillLevel } from "@/types/database";

export type ProfileState = { error?: string; ok?: string } | null;

const SKILLS: SkillLevel[] = ["beginner", "casual", "intermediate", "competitive"];

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getSessionUser();
  if (!user) return { error: "Please sign in." };

  const displayName = String(formData.get("display_name") ?? "").trim();
  if (!displayName) return { error: "Display name is required." };

  const skill = String(formData.get("skill_level") ?? "casual") as SkillLevel;
  const preferred = formData.getAll("preferred_sports").map(String);

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      avatar_url: String(formData.get("avatar_url") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      suburb: String(formData.get("suburb") ?? "").trim() || null,
      university: String(formData.get("university") ?? "").trim() || null,
      skill_level: SKILLS.includes(skill) ? skill : "casual",
      preferred_sports: preferred.length ? preferred : ["badminton"],
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath(`/profile/${user.id}`);
  return { ok: "Profile saved." };
}
