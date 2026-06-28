import { Avatar } from "@/components/ui/Avatar";
import { ChatForm } from "@/components/events/ChatForm";
import { fetchEventMessages } from "@/lib/events";
import { formatDateTime } from "@/lib/format";

export async function EventChat({
  eventId,
  canChat,
}: {
  eventId: string;
  canChat: boolean;
}) {
  const messages = canChat ? await fetchEventMessages(eventId) : [];

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900">Event chat</h2>
      <p className="mt-1 text-sm text-slate-500">
        Only the host and joined players can see and post messages.
      </p>

      {!canChat ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          🔒 Join this game to see the chat and message the group.
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {messages.length === 0 ? (
            <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No messages yet — say hello 👋
            </p>
          ) : (
            <ul className="space-y-4">
              {messages.map((m) => (
                <li key={m.id} className="flex gap-3">
                  <Avatar name={m.profile?.display_name ?? "Player"} src={m.profile?.avatar_url} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-semibold text-slate-800">
                        {m.profile?.display_name ?? "Player"}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        {formatDateTime(m.created_at)}
                      </span>
                    </p>
                    <p className="whitespace-pre-line text-sm text-slate-700">{m.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="border-t border-slate-200 pt-4">
            <ChatForm eventId={eventId} />
          </div>
        </div>
      )}
    </section>
  );
}
