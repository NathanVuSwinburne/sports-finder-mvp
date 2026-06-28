/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
} as const;

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const cls = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
    sizes[size],
    className,
  );

  if (src) {
    return <img src={src} alt={name} className={cn(cls, "object-cover")} />;
  }
  return (
    <span className={cn(cls, "bg-brand-100 text-brand-700")} aria-hidden>
      {initials(name) || "?"}
    </span>
  );
}
