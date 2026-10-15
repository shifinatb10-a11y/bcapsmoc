"use client";

import { useEffect, useState } from "react";
import { Download, Eye, ExternalLink, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

function downloadHref(url: string) {
  if (!url) return url;
  return url.includes("?") ? `${url}&download=` : `${url}?download=`;
}

export function DocumentActions({
  url,
  title,
  className,
  variant = "light",
}: {
  url?: string | null;
  title: string;
  className?: string;
  variant?: "light" | "dark";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!url) return null;

  const primary =
    variant === "dark"
      ? "bg-white/10 text-white hover:bg-white/20 border border-white/15"
      : "bg-brand-600 text-white hover:bg-brand-700";
  const secondary =
    variant === "dark"
      ? "bg-transparent text-brand-100 hover:text-white border border-white/15"
      : "bg-white text-ink-700 hover:text-brand-700 border border-ink-100 hover:border-brand-300";

  return (
    <>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
            primary,
          )}
        >
          <Eye className="h-4 w-4" />
          View
        </button>
        <a
          href={downloadHref(url)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
            secondary,
          )}
        >
          <Download className="h-4 w-4" />
          Download
        </a>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] flex flex-col bg-ink-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-brand-950 px-4 py-3 text-white sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0 text-amber-300" />
              <span className="truncate text-sm font-semibold">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={downloadHref(url)}
                className="hidden items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-brand-100 hover:text-white sm:inline-flex"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-brand-100 hover:text-white sm:inline-flex"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close viewer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 bg-ink-100">
            <iframe
              src={`${url}#view=FitH`}
              title={title}
              className="h-full w-full"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
