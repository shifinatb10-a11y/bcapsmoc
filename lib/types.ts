export type AdminRole = "department" | "association" | "club" | "studyzone";

export const ADMIN_ROLES: AdminRole[] = [
  "department",
  "association",
  "club",
  "studyzone",
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  department: "Department Admin",
  association: "Association Admin",
  club: "Club Admin",
  studyzone: "Study Zone Admin",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  department:
    "Manages faculty profiles, the department page and general site settings.",
  association:
    "Manages the student association, its secretaries, event reports and magazines.",
  club: "Manages the department club, its events and activity reports.",
  studyzone: "Manages previous year question papers and study notes.",
};

/** Which admin section a role is allowed to manage. */
export type Section = "department" | "association" | "club" | "studyzone";

const PERMISSIONS: Record<AdminRole, Section[]> = {
  department: ["department"],
  association: ["association"],
  club: ["club"],
  studyzone: ["studyzone"],
};

export function canManage(role: AdminRole | null, section: Section): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(section) ?? false;
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
