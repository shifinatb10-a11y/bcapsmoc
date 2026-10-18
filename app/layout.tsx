import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const title = "BCA Department | PSMO College (Autonomous), Tirurangadi";
const description =
  "Official website of the Department of Computer Applications (BCA), PSMO College (Autonomous), Tirurangadi. Faculty, student association, club, previous year question papers and study notes.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | BCA Department · PSMO College",
  },
  description,
  applicationName: "BCA Department · PSMO College",
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
