"use client";

import { useActionState, useEffect, useRef } from "react";
import { postMessageAction, type JoinState } from "@/app/events/actions";
import { Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function ChatForm({ eventId }: { eventId: string }) {
  const [state, action, pending] = useActionState<JoinState, FormData>(
    postMessageAction,
    null,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="space-y-2">
      <Textarea
        name="body"
        required
        maxLength={1000}
        placeholder="Say hi, ask a question, or coordinate gear…"
        className="min-h-20"
      />
      <input type="hidden" name="event_id" value={eventId} />
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Posting…" : "Post message"}
        </Button>
        {state?.error && <span className="text-sm text-red-600">{state.error}</span>}
      </div>
    </form>
  );
}
