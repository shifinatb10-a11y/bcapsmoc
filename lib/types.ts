export type AdminRole =
  | "superadmin"
  | "department"
  | "association"
  | "club"
  | "studyzone";

export const ADMIN_ROLES: AdminRole[] = [
  "superadmin",
  "department",
  "association",
  "club",
  "studyzone",
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: "Super Admin",
  department: "Department Admin",
  association: "Association Admin",
  club: "Club Admin",
  studyzone: "Study Zone Admin",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  superadmin:
    "Full access — manages every section (department, association, club and study zone) and all other administrator accounts.",
  department:
    "View-only dashboard access. Faculty, site settings and administrator accounts are managed by the Super Admin.",
  association:
    "Manages the student association, its secretaries, event reports and magazines.",
  club: "Manages the department club, its events and activity reports.",
  studyzone: "Manages previous year question papers and study notes.",
};

/** Which admin section a role is allowed to manage. */
export type Section = "department" | "association" | "club" | "studyzone";

export const ALL_SECTIONS: Section[] = [
  "department",
  "association",
  "club",
  "studyzone",
];

const PERMISSIONS: Record<AdminRole, Section[]> = {
  superadmin: ALL_SECTIONS,
  // Faculty, Site Settings and Admin Team belong to the Super Admin only.
  department: [],
  association: ["association"],
  club: ["club"],
  studyzone: ["studyzone"],
};

export function canManage(role: AdminRole | null, section: Section): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(section) ?? false;
}

/** True only for the Super Admin role. */
export function isSuperAdmin(role: AdminRole | null): boolean {
  return role === "superadmin";
}

export interface Faculty {
  id: number;
  name: string;
  role_title: string | null;
  designation: string | null;
  qualification: string | null;
  email: string | null;
  bio: string | null;
  photo_url: string | null;
  display_order: number | null;
  created_at: string | null;
}

export interface Association {
  id: string;
  name: string;
  year_label: string;
  start_year: number | null;
  end_year: number | null;
  secretary_name: string | null;
  secretary_designation: string | null;
  secretary_photo_url: string | null;
  secretary_details: string | null;
  description: string | null;
  magazine_title: string | null;
  magazine_url: string | null;
  cover_image_url: string | null;
  display_order: number;
  created_at: string | null;
}

export interface AssociationReport {
  id: string;
  association_id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  file_url: string | null;
  created_at: string | null;
}

export interface Club {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  cover_image_url: string | null;
  display_order: number;
  created_at: string | null;
}

export interface ClubEvent {
  id: string;
  club_id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  image_url: string | null;
  report_url: string | null;
  created_at: string | null;
}

export type MaterialCategory = "question_paper" | "notes";

export interface StudyMaterial {
  id: string;
  title: string;
  category: MaterialCategory;
  subject: string | null;
  semester: string | null;
  year: string | null;
  description: string | null;
  file_url: string;
  created_at: string | null;
}

export interface SiteSetting {
  key: string;
  value: string | null;
  updated_at: string | null;
}
