import {
  BookOpen,
  Building2,
  Images,
  LayoutDashboard,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface MainNavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const MAIN_NAV: MainNavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    description: "Department overview & highlights",
    icon: LayoutDashboard,
  },
  {
    href: "/department",
    label: "Department",
    description: "About us, faculty & facilities",
    icon: Building2,
  },
  {
    href: "/association",
    label: "Association",
    description: "Office bearers, reports & magazines",
    icon: Users,
  },
  {
    href: "/club",
    label: "Club",
    description: "Club events & activity reports",
    icon: Sparkles,
  },
  {
    href: "/study-zone",
    label: "Study Zone",
    description: "Question papers & study notes",
    icon: BookOpen,
  },
  {
    href: "/gallery",
    label: "Gallery",
    description: "Photos & videos from the department",
    icon: Images,
  },
];
