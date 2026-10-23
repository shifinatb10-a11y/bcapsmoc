import {
  Award,
  BookOpen,
  Eye,
  GraduationCap,
  Images,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { canView, isSuperAdmin, type AdminRole, type Section } from "@/lib/types";

export interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  section: Section | null;
  /** `page_visibility` key — lets the Super Admin hide this page from admins. */
  pageKey?: string;
  /** Only the Super Admin sees this item. */
  superAdminOnly?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    description: "Dashboard summary",
    icon: LayoutDashboard,
    section: null,
  },
  {
    href: "/admin/students",
    label: "Students",
    description: "Student records by batch & semester",
    icon: GraduationCap,
    section: "students",
  },
  {
    href: "/admin/faculty",
    label: "Faculty",
    description: "Faculty profiles & page content",
    icon: Users,
    section: "department",
    pageKey: "department",
  },
  {
    href: "/admin/association",
    label: "Association",
    description: "Secretaries, reports & magazines",
    icon: Award,
    section: "association",
    pageKey: "association",
  },
  {
    href: "/admin/club",
    label: "Club",
    description: "Club details, events & reports",
    icon: Sparkles,
    section: "club",
    pageKey: "club",
  },
  {
    href: "/admin/study-zone",
    label: "Study Zone",
    description: "Question papers & notes",
    icon: BookOpen,
    section: "studyzone",
    pageKey: "study-zone",
  },
  {
    href: "/admin/finance",
    label: "Finance",
    description: "Transactions & finance ledger",
    icon: Wallet,
    section: "finance",
    pageKey: "finance",
  },
  {
    href: "/admin/gallery",
    label: "Gallery",
    description: "Photos & videos shown on the website",
    icon: Images,
    section: "gallery",
    pageKey: "gallery",
  },
  {
    href: "/admin/team",
    label: "Admin Team",
    description: "Administrator roles",
    icon: ShieldCheck,
    section: null,
    pageKey: "team",
    superAdminOnly: true,
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    description: "Homepage & department text",
    icon: Settings,
    section: null,
    pageKey: "settings",
    superAdminOnly: true,
  },
  {
    href: "/admin/pages",
    label: "Pages",
    description: "Show or hide pages",
    icon: Eye,
    section: null,
    superAdminOnly: true,
  },
];

/**
 * The nav items a role may see, after applying role permissions and the
 * Super Admin's page-visibility switches.
 */
export function navItemsFor(
  role: AdminRole | null,
  hiddenPageKeys: string[] = [],
): AdminNavItem[] {
  return ADMIN_NAV.filter((item) => {
    if (item.pageKey && hiddenPageKeys.includes(item.pageKey)) return false;
    if (item.superAdminOnly) return isSuperAdmin(role);
    if (item.section === null) return true;
    return canView(role, item.section);
  });
}
