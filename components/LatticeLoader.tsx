"use client";

/**
 * LatticeLoader — dots-pattern lattice loading animation.
 * Inspired by: reactbits.dev/micro/lattice-loader?pattern=dots
 *
 * Renders a grid of dots that scale in/out in a staggered wave pattern.
 * Used as a fallback for Suspense boundaries and loading states.
 */

import { cn } from "@/lib/utils";

interface LatticeLoaderProps {
  /** Number of columns. Default 5. */
  cols?: number;
  /** Number of rows. Default 5. */
  rows?: number;
  /** Dot colour. Default brand indigo. */
  color?: string;
  /** Size of each dot in px. Default 6. */
  dotSize?: number;
  /** Gap between dots in px. Default 8. */
  gap?: number;
  className?: string;
  /** Show a centered overlay over the parent. Default false. */
  overlay?: boolean;
}

export function LatticeLoader({
  cols = 5,
  rows = 5,
  dotSize = 6,
  gap = 8,
  className,
  overlay = false,
}: LatticeLoaderProps) {
  const total = cols * rows;

  const wrapper = cn(
    "flex items-center justify-center",
    overlay && "absolute inset-0 z-50 bg-white/70 backdrop-blur-sm",
    className,
  );

  return (
    <div className={wrapper} role="status" aria-label="Loading…">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          // Diagonal wave: delay based on (col + row)
          const delay = ((col + row) / (cols + rows - 2)) * 0.8;

          return (
            <span
              key={i}
              className="rounded-full bg-brand-500"
              style={{
                width: dotSize,
                height: dotSize,
                animation: `lattice-pulse 1.4s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/** Full-page centred loader — handy for route-level loading.tsx files. */
export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LatticeLoader cols={6} rows={6} dotSize={7} gap={10} />
    </div>
  );
}
