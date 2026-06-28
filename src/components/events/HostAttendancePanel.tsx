import { Card, CardBody } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { markAttendance, completeEvent } from "@/app/events/actions";
import { cn } from "@/lib/utils";
import type { ParticipantWithProfile } from "@/lib/events";
import type { EventStatus } from "@/types/database";

export function HostAttendancePanel({
  eventId,
  players,
  status,
}: {
  eventId: string;
  players: ParticipantWithProfile[];
  status: EventStatus;
}) {
  return (
    <Card className="border-brand-200 bg-brand-50/40">
      <CardBody>
        <h2 className="text-lg font-semibold text-slate-900">Host tools</h2>
        <p className="mt-1 text-sm text-slate-600">
          Mark who showed up — this updates everyone&rsquo;s show-up score.
        </p>

        {status !== "completed" && status !== "cancelled" && (
          <form action={completeEvent} className="mt-3">
            <input type="hidden" name="event_id" value={eventId} />
            <button
              type="submit"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Mark event as completed
            </button>
          </form>
        )}

        <ul className="mt-4 space-y-2">
          {players.length === 0 && (
            <li className="text-sm text-slate-500">No players joined this event.</li>
          )}
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-xl bg-white px-3 py-2">
              <Avatar name={p.profile?.display_name ?? "Player"} src={p.profile?.avatar_url} size="sm" />
              <span className="flex-1 truncate text-sm font-medium text-slate-800">
                {p.profile?.display_name ?? "Player"}
              </span>
              <form action={markAttendance} className="flex gap-1">
                <input type="hidden" name="event_id" value={eventId} />
                <input type="hidden" name="user_id" value={p.user_id} />
                <button
                  type="submit"
                  name="status"
                  value="attended"
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold",
                    p.status === "attended"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-emerald-100",
                  )}
                >
                  Attended
                </button>
                <button
                  type="submit"
                  name="status"
                  value="no_show"
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-semibold",
                    p.status === "no_show"
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-red-100",
                  )}
                >
                  No-show
                </button>
              </form>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
