export interface SubmenuItem {
  link: string;
  icon: string;
  text: string;
}

export interface SidebarNavItem {
  link: string;
  section: string;
  icon: string;
  text: string;
  role: string[];
  submenu?: SubmenuItem[];
}

const sidebarNav: SidebarNavItem[] = [
  {
    link: "/admin/dashboard",
    section: "dashboard",
    icon: "lucide:layout-dashboard",
    text: "Dashboard",
    role: ["admin"],
  },
  {
    link: "/admin/users",
    section: "users",
    icon: "lucide:users",
    text: "Users",
    role: ["admin"],
  },
  {
    link: "/admin/equipment",
    section: "equipment",
    icon: "lucide:wrench",
    text: "Equipment",
    role: ["admin"],
  },
  {
    link: "/admin/essential-tools",
    section: "essential-tools",
    icon: "lucide:hammer",
    text: "Essential Tools",
    role: ["admin"],
  },
  {
    link: "/admin/maintenance-guides",
    section: "maintenance-guides",
    icon: "lucide:book-open",
    text: "Maintenance Guides",
    role: ["admin"],
  },
  {
    link: "/admin/plumbing-codes",
    section: "plumbing-codes",
    icon: "lucide:book",
    text: "Plumbing Codes",
    role: ["admin"],
  },
  {
    link: "/admin/training-videos",
    section: "training-videos",
    icon: "lucide:video",
    text: "Training Videos",
    role: ["admin"],
    submenu: [
      {
        link: "/admin/training-videos/apprentice",
        icon: "lucide:video",
        text: "Apprentice",
      },
      {
        link: "/admin/training-videos/licensed-plumber",
        icon: "lucide:video",
        text: "Licensed Plumber",
      },
    ],
  },
  {
    link: "/admin/ai-videos",
    section: "ai-videos",
    icon: "lucide:sparkles",
    text: "AI Videos",
    role: ["admin"],
  },
  {
    link: "/admin/faqs",
    section: "faqs",
    icon: "lucide:help-circle",
    text: "Support & FAQs",
    role: ["admin"],
  },
  {
    link: "/admin/support",
    section: "support",
    icon: "lucide:message-square",
    text: "Support Requests",
    role: ["admin"],
  },
];

export default sidebarNav;

