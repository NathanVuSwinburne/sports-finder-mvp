"use client";

import { useActionState } from "react";
import {
  joinEventAction,
  leaveEventAction,
  type JoinState,
} from "@/app/events/actions";
import { Button } from "@/components/ui/Button";
import type { ParticipantStatus } from "@/types/database";

function Message({ state }: { state: JoinState }) {
  if (!state) return null;
  if (state.error)
    return <p className="text-sm text-red-600">{state.error}</p>;
  if (state.ok)
    return <p className="text-sm text-emerald-700">{state.ok}</p>;
  return null;
}

export function JoinPanel({
  eventId,
  myStatus,
  isActive,
  startInPast,
  isHost,
  spotsLeft,
}: {
  eventId: string;
  myStatus: ParticipantStatus | null;
  isActive: boolean;
  startInPast: boolean;
  isHost: boolean;
  spotsLeft: number;
}) {
  const [joinState, join, joining] = useActionState<JoinState, FormData>(
    joinEventAction,
    null,
  );
  const [leaveState, leave, leaving] = useActionState<JoinState, FormData>(
    leaveEventAction,
    null,
  );

  if (isHost) {
    return (
      <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
        You&rsquo;re hosting this event.
      </div>
    );
  }

  if (!isActive) return null;

  const joined = myStatus === "joined";
  const waitlisted = myStatus === "waitlisted";

  if (joined || waitlisted) {
    return (
      <div className="space-y-2">
        <div
          className={
            joined
              ? "rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
              : "rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700"
          }
        >
          {joined ? "✓ You're confirmed for this game" : "⏳ You're on the waitlist"}
        </div>
        {startInPast ? (
          <p className="text-xs text-slate-500">
            This session has started — you can no longer leave.
          </p>
        ) : (
          <form action={leave}>
            <input type="hidden" name="event_id" value={eventId} />
            <Button type="submit" variant="outline" className="w-full" disabled={leaving}>
              {leaving ? "Leaving…" : "Leave event"}
            </Button>
          </form>
        )}
        <Message state={leaveState} />
      </div>
    );
  }

  if (startInPast) {
    return (
      <p className="text-sm text-slate-500">This session has already started.</p>
    );
  }

  return (
    <div className="space-y-2">
      <form action={join}>
        <input type="hidden" name="event_id" value={eventId} />
        <Button type="submit" className="w-full" disabled={joining}>
          {joining ? "Joining…" : spotsLeft > 0 ? "Join this game" : "Join waitlist"}
        </Button>
      </form>
      {spotsLeft <= 0 && (
        <p className="text-xs text-slate-500">
          This game is full — join the waitlist and we&rsquo;ll bump you up if a spot opens.
        </p>
      )}
      <Message state={joinState} />
    </div>
  );
}
