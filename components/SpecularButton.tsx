"use client";

/**
 * SpecularButton — an animated button/link with a specular highlight that
 * follows the mouse cursor.
 * Inspired by: reactbits.dev/components/specular-button
 */

import type { ReactNode, MouseEvent } from "react";
import { useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "white";

interface SpecularButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /** Any extra props forwarded to the underlying element */
  [key: string]: unknown;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lift hover:shadow-glow",
  secondary:
    "border border-white/25 bg-white/8 text-white backdrop-blur hover:bg-white/15",
  ghost:
    "border border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
  white:
    "bg-white text-brand-800 shadow-lift hover:shadow-md",
};

export function SpecularButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
  disabled,
  ...rest
}: SpecularButtonProps) {
  const ref = useRef<HTMLElement>(null);

  function handleMouseMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--sx", `${x}%`);
    el.style.setProperty("--sy", `${y}%`);
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--sx", "50%");
    el.style.setProperty("--sy", "50%");
  }

  const commonClass = cn(
    "specular-btn relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "rounded-xl px-5 py-3 text-sm font-semibold",
    "transition-all duration-200 ease-out",
    "select-none outline-offset-2",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500",
    variantStyles[variant],
    disabled && "pointer-events-none opacity-55",
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={commonClass}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...(rest as object)}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={commonClass}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...(rest as object)}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
