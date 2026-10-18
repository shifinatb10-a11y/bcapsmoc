/** @type {import("next").NextConfig} */

const isDev = process.env.NODE_ENV === "development";

// ---------------------------------------------------------------------------
// Content Security Policy
//   * `unsafe-inline` is required by Next.js (its inline bootstrap + styles).
//   * `unsafe-eval` is only added in development (hot reload / error overlay).
//   * Supabase is the only external endpoint the site talks to.
// ---------------------------------------------------------------------------
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data: blob: https://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com",
  "media-src 'self' blob: https://*.supabase.co",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googletagmanager.com https://www.google-analytics.com https://*.analytics.google.com",
  "frame-src 'self' https://*.supabase.co",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
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
];

const nextConfig = {
  // Hide the `X-Powered-By: Next.js` response header.
  poweredByHeader: false,

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
