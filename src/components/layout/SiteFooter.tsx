import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-700">
          <span>🏸</span> SportsFinder
          <span className="font-normal text-slate-400">· Melbourne</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/events" className="hover:text-slate-800">Browse events</Link>
          <Link href="/events/new" className="hover:text-slate-800">Host a game</Link>
          <Link href="/guidelines" className="hover:text-slate-800">Community guidelines</Link>
        </nav>
        <p className="text-xs text-slate-400">
          Built for students &amp; newcomers. Play safe — meet in public venues.
        </p>
      </div>
    </footer>
  );
}
