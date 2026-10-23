import type { Section } from "@/lib/types";

/**
 * Every page the Super Admin can show or hide.
 *
 * `publicHref` — the page on the public website (null when the page is
 *                admin-only, e.g. Finance or Admin Team).
 * `adminHref`  — the matching page inside the admin dashboard (null for Home,
 *                which has no admin screen of its own).
 */
export interface PageDef {
  key: string;
  label: string;
  description: string;
  publicHref: string | null;
  adminHref: string | null;
  section: Section | null;
}

export const PAGES: PageDef[] = [
  {
    key: "home",
    label: "Home",
    description: "The public homepage shown at the website root.",
    publicHref: "/",
    adminHref: null,
    section: null,
  },
  {
    key: "department",
    label: "Department",
    description: "About the department, facilities and the faculty directory.",
    publicHref: "/department",
    adminHref: "/admin/faculty",
    section: "department",
  },
  {
    key: "association",
    label: "Association",
    description: "Association terms, secretaries, reports and magazines.",
    publicHref: "/association",
    adminHref: "/admin/association",
    section: "association",
  },
  {
    key: "club",
    label: "Club",
    description: "The department club, events and activity reports.",
    publicHref: "/club",
    adminHref: "/admin/club",
    section: "club",
  },
  {
    key: "study-zone",
    label: "Study Zone",
    description: "Previous year question papers and subject quizzes.",
    publicHref: "/study-zone",
    adminHref: "/admin/study-zone",
    section: "studyzone",
  },
  {
    key: "gallery",
    label: "Gallery",
    description: "Photos and videos from the department.",
    publicHref: "/gallery",
    adminHref: "/admin/gallery",
    section: "gallery",
  },
  {
    key: "finance",
    label: "Finance",
    description: "Department finance ledger (never shown to the public).",
    publicHref: null,
    adminHref: "/admin/finance",
    section: "finance",
  },
  {
    key: "team",
    label: "Admin Team",
    description: "Administrator accounts and their roles.",
    publicHref: null,
    adminHref: "/admin/team",
    section: null,
  },
  {
    key: "settings",
    label: "Site Settings",
    description: "Homepage hero image and department text.",
    publicHref: null,
    adminHref: "/admin/settings",
    section: null,
  },
];

export const PAGE_KEYS: string[] = PAGES.map((page) => page.key);

export interface Visibility {
  public_visible: boolean;
  admin_visible: boolean;
}

export type VisibilityMap = Record<string, Visibility>;

/** Every page is visible unless the database says otherwise. */
export function defaultVisibility(): VisibilityMap {
  const map: VisibilityMap = {};
  for (const page of PAGES) {
    map[page.key] = { public_visible: true, admin_visible: true };
  }
  return map;
}

export function isPublicVisible(map: VisibilityMap, key: string): boolean {
  return map[key]?.public_visible ?? true;
}

export function isAdminVisible(map: VisibilityMap, key: string): boolean {
  return map[key]?.admin_visible ?? true;
}
