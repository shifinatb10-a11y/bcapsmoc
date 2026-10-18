import type { MetadataRoute } from "next";
import { MAIN_NAV } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

/**
 * Every public page in the sitemap, generated from the main navigation so it
 * always stays in step with the site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return MAIN_NAV.map((item) => ({
    url: item.href === "/" ? SITE_URL : `${SITE_URL}${item.href}`,
    lastModified,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
