import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone = "brand",
}: {
  children: ReactNode;
  className?: string;
  tone?: "brand" | "gold" | "muted" | "accent";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-700 ring-brand-200/70",
    accent: "bg-accent-50 text-accent-700 ring-accent-200/70",
    gold: "bg-amber-50 text-amber-700 ring-amber-200/70",
    muted: "bg-ink-100 text-ink-500 ring-ink-200/70",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center"
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700 ring-1 ring-inset ring-brand-100">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-[2rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  imageUrl,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  imageUrl?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      {imageUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Blue duotone blend so the photo sits into the brand colour */}
          <div className="absolute inset-0 bg-brand-900/55 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-950/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/25 to-transparent" />
        </>
      ) : null}
      <div aria-hidden="true" className="absolute inset-0 bg-mesh-hero opacity-70" />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-[-6rem] h-72 w-72 rounded-full bg-brand-500/30 blur-3xl animate-float"
      />
      <div
        aria-hidden="true"
        className="absolute -right-16 bottom-[-6rem] h-80 w-80 rounded-full bg-accent-500/25 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-faint opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <Container className="relative py-16 sm:py-24">
        <div className="max-w-3xl animate-in">
          {eyebrow ? (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-300 backdrop-blur">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-brand-100/85 sm:text-lg">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-ink-200 bg-white/70 px-6 py-14 text-center backdrop-blur">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 7h16M4 12h10M4 17h7" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-ink-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function StatCard({
  value,
  label,
  icon,
}: {
  value: string | number;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-card backdrop-blur transition-shadow hover:shadow-glow">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br from-brand-500/15 to-accent-500/15 blur-xl"
      />
      <div className="flex items-center gap-2">
        {icon ? (
          <span className="text-brand-500 transition-transform group-hover:scale-110">
            {icon}
          </span>
        ) : null}
        <div className="font-display text-2xl font-semibold text-gradient sm:text-3xl">
          {value}
        </div>
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-500">
        {label}
      </div>
    </div>
  );
}

export function Avatar({
  src,
  name,
  className,
  rounded = "rounded-2xl",
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
  rounded?: string;
}) {
  const label = (name ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "Photo"}
        className={cn("h-full w-full object-cover", rounded, className)}
        loading="lazy"
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 to-accent-100 font-display text-2xl font-semibold text-brand-700",
        rounded,
        className,
      )}
    >
      {label}
    </div>
  );
}
