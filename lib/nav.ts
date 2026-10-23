import {
  Sparkles,
  BookOpen,
  Building2,
  Users,
  Images,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const MAIN_NAV: NavItem[] = [
  {
    href: "/department",
    label: "Department",
    description: "About the department, vision, mission & faculty",
    icon: Building2,
  },
  {
    href: "/association",
    label: "Association",
    description: "Student association, events, reports & magazines",
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
    description: "Question papers & quizzes",
    icon: BookOpen,
  },
  {
    href: "/gallery",
    label: "Gallery",
    description: "Photos & videos from the department",
    icon: Images,
  },
];
