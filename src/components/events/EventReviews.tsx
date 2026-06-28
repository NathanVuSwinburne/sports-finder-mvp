import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ReviewForm } from "@/components/events/ReviewForm";
import { fetchEventReviews } from "@/lib/events";
import { formatLongDate } from "@/lib/format";
import { REVIEW_TAG_OPTIONS } from "@/lib/constants";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400" aria-label={`${rating} out of 5`}>
      {"★".repeat(rating)}
      <span className="text-slate-300">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function tagLabel(value: string): string {
  return REVIEW_TAG_OPTIONS.find((t) => t.value === value)?.label ?? value;
}

export async function EventReviews({
  eventId,
  currentUserId,
  canReview,
}: {
  eventId: string;
  currentUserId: string | null;
  canReview: boolean;
}) {
  const reviews = await fetchEventReviews(eventId);
  const alreadyReviewed = reviews.some((r) => r.reviewer_id === currentUserId);

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>

      {canReview && !alreadyReviewed && (
        <div className="mt-4">
          <ReviewForm eventId={eventId} />
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No reviews yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <Avatar name={r.reviewer?.display_name ?? "Player"} src={r.reviewer?.avatar_url} size="sm" />
                <div>
                  <Link href={`/profile/${r.reviewer_id}`} className="text-sm font-semibold text-slate-800 hover:text-brand-700">
                    {r.reviewer?.display_name ?? "Player"}
                  </Link>
                  <p className="text-xs text-slate-400">{formatLongDate(r.created_at)}</p>
                </div>
                <span className="ml-auto">
                  <Stars rating={r.rating} />
                </span>
              </div>
              {r.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.tags.map((t) => (
                    <Badge key={t} tone={t === "no-show-issue" || t === "too-competitive" ? "amber" : "emerald"}>
                      {tagLabel(t)}
                    </Badge>
                  ))}
                </div>
              )}
              {r.comment && <p className="mt-2 text-sm text-slate-700">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
