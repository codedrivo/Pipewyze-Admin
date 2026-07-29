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
    link: "/admin/plumbing-codes",
    section: "plumbing-codes",
    icon: "lucide:book-open",
    text: "Plumbing Codes",
    role: ["admin"],
  },
];

export default sidebarNav;

