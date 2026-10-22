/** @type {import("next").NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// ---------------------------------------------------------------------------
// Content Security Policy
//   * `unsafe-inline` is required by Next.js (its inline bootstrap + styles).
//   * `unsafe-eval` is only added in development (hot reload / error overlay).
//   * Supabase is the only external data endpoint; ImageKit serves all media.
// ---------------------------------------------------------------------------
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  // Images: self, Supabase storage, ImageKit CDN, Google Analytics pixel
  "img-src 'self' data: blob: https://*.supabase.co https://ik.imagekit.io https://www.googletagmanager.com https://www.google-analytics.com",
  // Media: self, Supabase storage, ImageKit CDN (videos)
  "media-src 'self' blob: https://*.supabase.co https://ik.imagekit.io",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  // Connect: Supabase (data + realtime), ImageKit upload API, Google Analytics
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://upload.imagekit.io https://ik.imagekit.io https://www.googletagmanager.com https://www.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self' https://*.supabase.co https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Prevent DNS prefetching for privacy
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig = {
  // Hide the `X-Powered-By: Next.js` response header.
  poweredByHeader: false,

  // ImageKit and Supabase image domains for next/image (if used in future)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply the security headers to every route (pages, API, static).
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
