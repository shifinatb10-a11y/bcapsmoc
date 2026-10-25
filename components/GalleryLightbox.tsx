"use client";

/**
 * GalleryLightbox — full-screen image/video viewer overlay.
 * Opens when a gallery item card is clicked.
 */

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { ikFull } from "@/lib/imagekit/client";

interface GalleryLightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: GalleryLightboxProps) {
  const item = items[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-900/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink-900/60 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous"
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink-900/60 text-white transition hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* Next */}
      {items.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next"
          className="absolute right-14 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink-900/60 text-white transition hover:bg-white/20"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Content */}
      <div
        className="relative flex max-h-[90vh] max-w-5xl flex-col items-center gap-4 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {item.media_type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ikFull(item.url)}
            alt={item.title}
            className="max-h-[78vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="text-center text-white">
              <p className="text-lg font-semibold">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-sm text-white/70">{item.description}</p>
              )}
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lift transition hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4" />
              Open video
            </a>
          </div>
        )}

        {/* Caption */}
        {item.media_type === "image" && (
          <div className="text-center">
            <p className="font-semibold text-white">{item.title}</p>
            {item.description && (
              <p className="mt-0.5 text-sm text-white/70">{item.description}</p>
            )}
          </div>
        )}

        {/* Counter */}
        {items.length > 1 && (
          <p className="text-xs text-white/50">
            {index + 1} / {items.length}
          </p>
        )}
      </div>
    </div>
  );
}
