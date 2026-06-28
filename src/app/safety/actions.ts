"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import type { ReportTarget } from "@/types/database";

export type ReportState = { error?: string; ok?: string } | null;

export async function createReportAction(
  _prev: ReportState,
  formData: FormData,
): Promise<ReportState> {
  const user = await getSessionUser();
  if (!user) return { error: "Please sign in to report." };

  const targetType = String(formData.get("target_type") ?? "") as ReportTarget;
  const targetId = String(formData.get("target_id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  const details = String(formData.get("details") ?? "").trim();

  if (targetType !== "user" && targetType !== "event") {
    return { error: "Invalid report target." };
  }
  if (!targetId) return { error: "Missing target." };
  if (!reason) return { error: "Please choose a reason." };

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    target_type: targetType,
    target_id: targetId,
    reason: details ? `${reason} — ${details}` : reason,
  });
  if (error) return { error: error.message };

  return { ok: "Thanks — our team will review this report." };
}
