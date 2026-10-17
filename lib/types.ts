export type AdminRole =
  | "superadmin"
  | "department"
  | "association"
  | "club"
  | "studyzone"
  | "finance"
  | "media";

export const ADMIN_ROLES: AdminRole[] = [
  "superadmin",
  "department",
  "association",
  "club",
  "studyzone",
  "finance",
  "media",
];

export const ROLE_LABELS: Record<AdminRole, string> = {
  superadmin: "Super Admin",
  department: "Department Admin",
  association: "Association Admin",
  club: "Club Admin",
  studyzone: "Study Zone Admin",
  finance: "Finance Admin",
  media: "Media Admin",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  superadmin:
    "Full access — manages every section (department, association, club, study zone, finance and gallery), all administrator accounts and which pages the public can see.",
  department:
    "Manages student records for every batch and semester, and can view the finance ledger (read-only). Faculty, site settings and administrator accounts are managed by the Super Admin.",
  association:
    "Manages the student association, its secretaries, event reports and magazines. Can view the finance ledger (read-only).",
  club: "Manages the department club, its events and activity reports.",
  studyzone: "Manages previous year question papers and study notes.",
  finance:
    "Manages the finance ledger — adds, edits and deletes transactions.",
  media:
    "Manages the public gallery — uploads and removes images and videos.",
};

/** Which admin section a role is allowed to manage. */
export type Section =
  | "department"
  | "association"
  | "club"
  | "studyzone"
  | "finance"
  | "gallery"
  | "students";

export const ALL_SECTIONS: Section[] = [
  "department",
  "association",
  "club",
  "studyzone",
  "finance",
  "gallery",
  "students",
];

const PERMISSIONS: Record<AdminRole, Section[]> = {
  superadmin: ALL_SECTIONS,
  // The Department Admin manages the private student records. Faculty, Site
  // Settings and Admin Team belong to the Super Admin only.
  department: ["students"],
  association: ["association"],
  club: ["club"],
  studyzone: ["studyzone"],
  finance: ["finance"],
  media: ["gallery"],
};

/**
 * Extra roles (besides the managers above) that may OPEN a section read-only.
 * The Finance page is visible to the Department and Association admins, but
 * only the Finance Admin and Super Admin can change transactions.
 */
const VIEW_PERMISSIONS: Record<Section, AdminRole[]> = {
  department: [],
  association: [],
  club: [],
  studyzone: [],
  finance: ["department", "association"],
  gallery: [],
  // Student records are private to the Department Admin and the Super Admin.
  students: [],
};

export function canManage(role: AdminRole | null, section: Section): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(section) ?? false;
}

/** True if the role may open (view) the section, even if read-only. */
export function canView(role: AdminRole | null, section: Section): boolean {
  if (!role) return false;
  if (canManage(role, section)) return true;
  return VIEW_PERMISSIONS[section]?.includes(role) ?? false;
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

export type TransactionKind = "income" | "expense";

export interface Transaction {
  id: string;
  title: string;
  kind: TransactionKind;
  amount: number;
  category: string | null;
  transaction_date: string | null;
  reference: string | null;
  description: string | null;
  created_at: string | null;
}

export type GalleryMediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  title: string;
  media_type: GalleryMediaType;
  url: string;
  thumbnail_url: string | null;
  description: string | null;
  display_order: number;
  created_at: string | null;
}

export interface PageVisibility {
  page: string;
  public_visible: boolean;
  admin_visible: boolean;
  updated_at: string | null;
}

/**
 * Semesters 1 to 8 (four years).
 */
export const SEMESTERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const GENDERS: string[] = ["Male", "Female", "Other"];

/**
 * A batch (admission year) such as "2025-2029". Every student belongs to a
 * batch, and the batch carries the current semester for the whole group.
 * The Department Admin can add batches and move a batch to the next semester.
 */
export interface StudentBatch {
  label: string;
  current_semester: number;
  created_at: string | null;
}

/**
 * A student record. Stored in the private `students` table and linked to a
 * batch by its year label. Never shown on the public website.
 */
export interface Student {
  id: string;
  batch: string;
  roll_no: string | null;
  admission_no: string | null;
  register_no: string | null;
  apaar_id: string | null;
  name: string;
  gender: string | null;
  dob: string | null;
  mobile: string | null;
  email: string | null;
  created_at: string | null;
}
