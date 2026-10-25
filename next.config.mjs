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
  // Block inline event handlers (onclick=, onload=, etc.) for stricter XSS defense
  "script-src-attr 'none'",
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
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), accelerometer=(), autoplay=(), display-capture=(), encrypted-media=(), fullscreen=(), gyroscope=(), magnetometer=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), xr-spatial-tracking=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // Prevent loading cross-origin resources that do not explicitly grant permission
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
  // Restrict Flash and Acrobat cross-domain policy files
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  // Legacy XSS protection filter
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Isolate origin browsing context into a dedicated OS process
  { key: "Origin-Agent-Cluster", value: "?1" },
  // Prevent Internet Explorer / legacy browsers from executing direct file downloads
  { key: "X-Download-Options", value: "noopen" },
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

  // Ensure production source maps are not publicly exposed
  productionBrowserSourceMaps: false,

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
      {
        // Keep administrative routes strictly non-indexable without exposing them in robots.txt
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        // Keep internal API routes strictly non-indexable without exposing them in robots.txt
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
