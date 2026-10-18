import type { SVGProps } from "react";

/**
 * Small inline brand icons for the footer.
 *
 * `lucide-react` no longer ships brand logos, so these are drawn here from
 * simple stroke paths (same 24x24, 2px stroke style as the rest of the icon
 * set) — no extra dependency and no external requests.
 */

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIcon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </SocialIcon>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIcon {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </SocialIcon>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIcon {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </SocialIcon>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIcon {...props}>
      <path d="M4 3l7.5 9.5M20 21l-7.5-9.5" />
      <path d="M4 21 20 3" />
    </SocialIcon>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIcon {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </SocialIcon>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIcon {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </SocialIcon>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIcon {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </SocialIcon>
  );
}

/** Shared 24x24 stroke wrapper — accepts `className` etc. like a lucide icon. */
function SocialIcon({
  children,
  ...props
}: { children: React.ReactNode } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}
