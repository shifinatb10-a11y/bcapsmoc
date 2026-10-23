/**
 * ImageKit client-side URL builder.
 *
 * Generates transformed ImageKit URLs for responsive, optimised images.
 * Safe to import in both Server and Client components (no secrets used here).
 *
 * Usage:
 *   import { ikUrl, ikThumbnail } from "@/lib/imagekit/client";
 *   <img src={ikUrl(rawUrl, { width: 800, format: "webp", quality: 80 })} />
 */

const IK_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";

export interface IKTransform {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png" | "auto";
  crop?: "maintain_ratio" | "force" | "at_least" | "at_max";
  blur?: number;
}

/**
 * Builds an ImageKit URL with transformation parameters.
 * Falls through to the original URL if it's not an ImageKit URL
 * (e.g. external YouTube thumbnails or legacy Supabase storage links).
 */
export function ikUrl(url: string | null | undefined, transform: IKTransform = {}): string {
  if (!url) return "";

  // Pass through non-IK URLs unchanged
  if (!url.includes("ik.imagekit.io") && !url.startsWith(IK_ENDPOINT)) {
    return url;
  }

  const parts: string[] = [];
  if (transform.width) parts.push(`w-${transform.width}`);
  if (transform.height) parts.push(`h-${transform.height}`);
  if (transform.quality) parts.push(`q-${transform.quality}`);
  if (transform.format) parts.push(`f-${transform.format}`);
  if (transform.crop) parts.push(`c-${transform.crop}`);
  if (transform.blur) parts.push(`bl-${transform.blur}`);

  if (parts.length === 0) return url;

  // Insert tr= before the path segment
  const trString = `tr=${parts.join(",")}`;
  try {
    const parsed = new URL(url);
    // IK applies transforms via path: /tr:w-800,f-webp/path/to/image.jpg
    parsed.pathname = `/tr:${parts.join(",")}${parsed.pathname}`;
    return parsed.toString();
  } catch {
    // Fallback: append as query param
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}${trString}`;
  }
}

/** Standard gallery thumbnail — 480×340, WebP, quality 80. */
export function ikThumbnail(url: string | null | undefined): string {
  return ikUrl(url, { width: 480, height: 340, format: "webp", quality: 80, crop: "maintain_ratio" });
}

/** Large lightbox / fullscreen image — 1400 wide, WebP, quality 88. */
export function ikFull(url: string | null | undefined): string {
  return ikUrl(url, { width: 1400, format: "webp", quality: 88 });
}

/** Blurred placeholder — 20 wide, heavily blurred. */
export function ikPlaceholder(url: string | null | undefined): string {
  return ikUrl(url, { width: 20, blur: 10, format: "webp", quality: 20 });
}

/** Small avatar / profile photo — 160×160 square crop. */
export function ikAvatar(url: string | null | undefined): string {
  return ikUrl(url, { width: 160, height: 160, format: "webp", quality: 85, crop: "force" });
}

/** Hero / cover banner — 1200 wide, WebP, quality 85. */
export function ikHero(url: string | null | undefined): string {
  return ikUrl(url, { width: 1200, format: "webp", quality: 85 });
}
