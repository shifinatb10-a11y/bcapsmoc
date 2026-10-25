/**
 * Central site configuration: the public URL, the organisation details used
 * for structured data (JSON-LD) and the department's social profiles.
 *
 * Fill in the placeholder values below — anything left empty is simply
 * omitted from the schema and the footer.
 */

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Canonical origin of the website, without a trailing slash. */
export const SITE_URL = resolveSiteUrl().replace(/\/+$/, "");

export const SITE_NAME = "BCA Department · PSMO College";

export const SITE_TITLE =
  "BCA Department | PSMO College (Autonomous), Tirurangadi";

export const SITE_DESCRIPTION =
  "Official website of the Department of Computer Applications (BCA), PSMO College (Autonomous), Tirurangadi. Faculty, student association, club, previous year question papers and study notes.";

/** Organisation details used on the site and in JSON-LD structured data. */
export const ORGANISATION = {
  legalName: "PSMO College (Autonomous), Tirurangadi",
  alternateName: "PSMO College",
  departmentName: "Department of Computer Applications",
  programmeName: "Bachelor of Computer Applications (BCA)",
  programmeDescription:
    "A four-year, eight-semester Bachelor of Computer Applications programme covering programming, databases, web and mobile development, networking and software engineering.",
  streetAddress: "PSMO College (Autonomous), Tirurangadi",
  addressLocality: "Tirurangadi",
  addressRegion: "Kerala",
  addressCountry: "IN",
  /** Add the department's phone number and e-mail to publish them. */
  telephone: "",
  email: "",
};

export interface SocialLink {
  label: string;
  href: string;
}

/**
 * The department's public social profiles. Add one line per profile — they
 * appear in the footer and in the `sameAs` structured-data property.
 * Example: { label: "Instagram", href: "https://instagram.com/..." }
 */
export const SOCIAL_LINKS: SocialLink[] = [];
