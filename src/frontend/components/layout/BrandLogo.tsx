import Link from "next/link";

type BrandLogoProps = {
  showSubtitle?: boolean;
  size?: "sm" | "md";
};

export function BrandLogo({ showSubtitle = true, size = "md" }: BrandLogoProps) {
  const iconSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const textSize = size === "sm" ? "text-sm" : "text-[15px]";

  return (
    <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3">
      <div
        className={`relative ${iconSize} shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-[2px] shadow-lg shadow-fuchsia-500/20`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-fuchsia-300" aria-hidden>
            <path
              fill="currentColor"
              d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.7L12 16.8 6.4 19.5l2.1-6.7L3 8.8h6.8L12 2z"
            />
          </svg>
        </div>
      </div>
      <div className="hidden min-w-0 sm:block">
        <p className={`truncate font-semibold tracking-tight text-white ${textSize}`}>
          SME Risk Workbench
        </p>
        {showSubtitle ? (
          <p className="truncate text-xs text-zinc-400">
            Credit risk · underwriting
          </p>
        ) : null}
      </div>
    </Link>
  );
}
