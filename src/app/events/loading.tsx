export default function EventsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <div className="mb-6 h-9 w-64 animate-pulse rounded-lg bg-slate-200" />
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
