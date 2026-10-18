import {
  ORGANISATION,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "@/lib/site";

/**
 * JSON-LD describing the college, the website and the BCA programme.
 * Optional fields (phone, e-mail, social profiles) are only included when
 * they have been filled in `lib/site.ts`.
 */
export function StructuredData() {
  const organisation: Record<string, unknown> = {
    "@type": ["CollegeOrUniversity", "EducationalOrganization"],
    "@id": `${SITE_URL}/#organization`,
    name: ORGANISATION.legalName,
    alternateName: ORGANISATION.alternateName,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/college-logo.png`,
    },
    image: `${SITE_URL}/opengraph-image`,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANISATION.streetAddress,
      addressLocality: ORGANISATION.addressLocality,
      addressRegion: ORGANISATION.addressRegion,
      addressCountry: ORGANISATION.addressCountry,
    },
    department: {
      "@type": "Organization",
      name: ORGANISATION.departmentName,
      url: SITE_URL,
    },
  };

  if (ORGANISATION.telephone) organisation.telephone = ORGANISATION.telephone;
  if (ORGANISATION.email) organisation.email = ORGANISATION.email;
  if (SOCIAL_LINKS.length > 0) {
    organisation.sameAs = SOCIAL_LINKS.map((link) => link.href);
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      organisation,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en-IN",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Course",
        "@id": `${SITE_URL}/#course`,
        name: ORGANISATION.programmeName,
        description: ORGANISATION.programmeDescription,
        url: `${SITE_URL}/department`,
        provider: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
