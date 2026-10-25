/**
 * The official PSMO College logo. The source artwork has a solid white
 * background, so it is presented inside a white tile for a clean, intentional
 * look on both light and dark surfaces.
 */
export function CollegeLogo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-ink-100 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/college-logo.png"
        alt="PSMO College (Autonomous), Tirurangadi emblem"
        className="h-full w-full object-contain p-0.5"
      />
    </span>
  );
}
