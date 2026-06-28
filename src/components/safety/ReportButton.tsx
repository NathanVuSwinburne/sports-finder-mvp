"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { createReportAction, type ReportState } from "@/app/safety/actions";
import { Select, Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { REPORT_REASONS } from "@/lib/constants";
import type { ReportTarget } from "@/types/database";

export function ReportButton({
  targetType,
  targetId,
  signedIn,
}: {
  targetType: ReportTarget;
  targetId: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ReportState, FormData>(
    createReportAction,
    null,
  );

  if (!signedIn) {
    return (
      <Link href="/auth/sign-in?next=protected" className="text-xs font-medium text-slate-400 hover:text-slate-600">
        ⚠ Report (sign in)
      </Link>
    );
  }

  if (state?.ok) {
    return <p className="text-xs text-emerald-700">{state.ok}</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-slate-400 hover:text-red-600"
      >
        ⚠ Report this {targetType}
      </button>
    );
  }

  return (
    <form action={action} className="max-w-sm space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-800">Report this {targetType}</p>
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <div>
        <Label htmlFor="reason">Reason</Label>
        <Select id="reason" name="reason" defaultValue="">
          <option value="" disabled>Choose a reason…</option>
          {REPORT_REASONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="details" hint="(optional)">Details</Label>
        <Textarea id="details" name="details" className="min-h-16" placeholder="Anything we should know?" />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" variant="danger" disabled={pending}>
          {pending ? "Sending…" : "Submit report"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
