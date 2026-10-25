"use client";

import { useState } from "react";
import { Images, PlayCircle } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { ikThumbnail } from "@/lib/imagekit/client";
import { GalleryLightbox } from "@/components/GalleryLightbox";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const total = items.length;

  return (
    <>
      {/* Masonry-style grid */}
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <div key={item.id} className="mb-5 break-inside-avoid">
            {item.media_type === "image" ? (
              <figure
                className="group cursor-zoom-in overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-transform hover:-translate-y-1 hover:shadow-glow"
                onClick={() => setLightboxIndex(index)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ikThumbnail(item.url)}
                  alt={item.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="p-4">
                  <div className="font-semibold text-ink-900">{item.title}</div>
                  {item.description && (
                    <p className="mt-1 text-sm text-ink-500">{item.description}</p>
                  )}
                </figcaption>
              </figure>
            ) : (
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-ink-100 bg-brand-950 p-8 text-center text-white shadow-card transition-transform hover:-translate-y-1 hover:shadow-glow"
              >
                <PlayCircle className="h-12 w-12 text-amber-300 transition-transform group-hover:scale-110" />
                <div>
                  <div className="font-display font-semibold">{item.title}</div>
                  {item.description && (
                    <p className="mt-1 text-sm text-brand-100/80">{item.description}</p>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                  Watch video ↗
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {total > 0 && (
        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-ink-500">
          <Images className="h-3.5 w-3.5" />
          {total} {total === 1 ? "item" : "items"} in the gallery
        </p>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          items={items}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i! - 1 + total) % total)}
          onNext={() => setLightboxIndex((i) => (i! + 1) % total)}
        />
      )}
    </>
  );
}
