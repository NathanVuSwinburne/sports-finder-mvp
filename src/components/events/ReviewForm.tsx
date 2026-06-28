"use client";

import { useActionState } from "react";
import { submitReviewAction, type JoinState } from "@/app/events/actions";
import { Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { REVIEW_TAG_OPTIONS } from "@/lib/constants";

export function ReviewForm({ eventId }: { eventId: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(
    submitReviewAction,
    null,
  );

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">Leave a review</h3>

      <div>
        <Label>Rating</Label>
        {/* Radios styled as stars; default 5. Higher value first for CSS-free fill. */}
        <div className="flex flex-row-reverse justify-end gap-1">
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={n}
                defaultChecked={n === 5}
                className="peer sr-only"
              />
              <span className="text-2xl text-slate-300 peer-checked:text-amber-400 hover:text-amber-300">
                ★
              </span>
            </label>
          ))}
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-800">Tags</legend>
        <div className="flex flex-wrap gap-2">
          {REVIEW_TAG_OPTIONS.map((t) => (
            <label key={t.value} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 has-[:checked]:border-brand-400 has-[:checked]:bg-brand-50">
              <input type="checkbox" name="tags" value={t.value} className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="comment" hint="(optional)">Comment</Label>
        <Textarea id="comment" name="comment" placeholder="How was the session?" />
      </div>

      <input type="hidden" name="event_id" value={eventId} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm text-emerald-700">{state.ok}</p>}

      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
