const sidebarNav = [
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
    link: "/admin/plumber",
    section: "plumber",
    icon: "lucide:wrench",
    text: "Plumber",
    role: ["admin", "licensed-plumber"],
    submenu: [
      {
        link: "/admin/equipment",
        section: "equipment",
        icon: "lucide:wrench",
        text: "Equipment",
      },
    ],
  },
];

export default sidebarNav;
