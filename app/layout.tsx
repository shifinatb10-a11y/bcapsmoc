import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BCA Department | PSMO College (Autonomous), Tirurangadi",
    template: "%s | BCA Department · PSMO College",
  },
  description:
    "Official website of the Department of Computer Applications (BCA), PSMO College (Autonomous), Tirurangadi. Faculty, student association, club, previous year question papers and study notes.",
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
    title: "BCA Department | PSMO College (Autonomous), Tirurangadi",
    description:
      "Faculty, student association, club, question papers and study notes — all in one place.",
    type: "website",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <style>{`:root{--font-sans:"Plus Jakarta Sans";--font-display:"Newsreader";}`}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
