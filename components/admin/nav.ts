import {
  Award,
  BookOpen,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Section } from "@/lib/types";

export interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  section: Section | null;
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
    href: "/admin/faculty",
    label: "Faculty",
    description: "Faculty profiles & page content",
    icon: Users,
    section: "department",
  },
  {
    href: "/admin/association",
    label: "Association",
    description: "Secretaries, reports & magazines",
    icon: Award,
    section: "association",
  },
  {
    href: "/admin/club",
    label: "Club",
    description: "Club details, events & reports",
    icon: Sparkles,
    section: "club",
  },
  {
    href: "/admin/study-zone",
    label: "Study Zone",
    description: "Question papers & notes",
    icon: BookOpen,
    section: "studyzone",
  },
  {
    href: "/admin/team",
    label: "Admin Team",
    description: "Administrator roles",
    icon: ShieldCheck,
    section: "department",
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    description: "Homepage & department text",
    icon: Settings,
    section: "department",
  },
];
