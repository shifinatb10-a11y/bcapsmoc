import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// next/font self-hosts these at build time, so the site makes no request to
// Google for fonts (faster, and one less third party).
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

const siteUrl = SITE_URL;

const title = "BCA Department | PSMO College (Autonomous), Tirurangadi";
const description = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | BCA Department · PSMO College",
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "PSMO College",
    "BCA",
    "Tirurangadi",
    "Department of Computer Applications",
    "question papers",
    "study notes",
  ],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title,
    description:
      "Faculty, student association, club, question papers and study notes — all in one place.",
    type: "website",
    url: siteUrl,
    siteName: "BCA Department · PSMO College",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "Faculty, student association, club, question papers and study notes — all in one place.",
  },
};

// Mobile-friendly viewport plus a brand-coloured browser UI on mobile.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#312e81",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
