import Link from "next/link";
import { getSessionUser, getCurrentProfile } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

export async function SiteHeader() {
  const user = await getSessionUser();
  const profile = user ? await getCurrentProfile() : null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="text-xl">🏸</span>
          <span>
            Sports<span className="text-brand-600">Finder</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/events" className="hover:text-slate-900">
            Browse events
          </Link>
          <Link href="/events/new" className="hover:text-slate-900">
            Host a game
          </Link>
          <Link href="/guidelines" className="hover:text-slate-900">
            Guidelines
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/events" className="text-sm font-medium text-slate-600 hover:text-slate-900 sm:hidden">
            Browse
          </Link>
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full p-0.5 hover:bg-slate-100"
              aria-label="Your profile"
            >
              <Avatar name={profile?.display_name ?? "You"} src={profile?.avatar_url} size="sm" />
            </Link>
          ) : (
            <>
              <ButtonLink href="/auth/sign-in" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/auth/sign-up" size="sm">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
