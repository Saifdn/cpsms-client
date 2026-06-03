import {
  CalendarCheck,
  ChartPieIcon,
  ClipboardList,
  ClockAlert,
  FileBarChart2,
  HomeIcon,
  LayoutDashboardIcon,
  ScanQrCode,
  Settings,
  Truck,
  UsersIcon,
  Camera,
  ShoppingBag,
  Package,
  Frame,
} from "lucide-react";

export const APP_SIDEBAR = {
  primaryNav: [
    {
      title: "Home",
      url: "/",
      Icon: HomeIcon,
      allowedRoles: ["graduate"],
    },
    {
      title: "Frame Shop",
      url: "/frames",
      Icon: ShoppingBag,
      allowedRoles: ["graduate"],
    },
    {
      title: "Book Studio",
      url: "/book",
      Icon: CalendarCheck,
      allowedRoles: ["graduate"],
    },
    {
      title: "My Orders",
      url: "/my-orders",
      Icon: Package,
      allowedRoles: ["graduate"],
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      Icon: LayoutDashboardIcon,
      allowedRoles: ["superadmin", "admin", "staff"],
    },
    {
      title: "Studio",
      url: "#",
      Icon: Camera,
      children: [
        {
          title: "Location",
          url: "/studio",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
        {
          title: "Package",
          url: "/package",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
        {
          title: "Session",
          url: "/session",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
      ],
    },
    {
      title: "Booking",
      url: "/booking",
      Icon: CalendarCheck,
      allowedRoles: ["superadmin", "admin", "staff"],
    },
    {
      title: "Frames",
      url: "#",
      Icon: Frame,
      children: [
        {
          title: "Frame Catalog",
          url: "/frame-management",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
        {
          title: "Frame Orders",
          url: "/frame-orders",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
      ],
    },
    {
      title: "My Tasks",
      url: "/tasks/my",
      Icon: ClipboardList,
      allowedRoles: ["staff"],
    },
    {
      title: "Check-In / Out",
      url: "#",
      Icon: ScanQrCode,
      children: [
        {
          title: "Registration Counter",
          url: "/registration-counter",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
        {
          title: "Studio Counter",
          url: "/studio-counter",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
      ],
    },
    {
      title: "Live Queue",
      url: "/live-queue",
      Icon: ClockAlert,
      allowedRoles: ["superadmin", "admin", "staff"],
    },
    {
      title: "Shipment",
      url: "#",
      Icon: Truck,
      children: [
        {
          title: "Studio",
          url: "/shipment",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
        {
          title: "Frame",
          url: "/shipment/frames",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      Icon: FileBarChart2,
      allowedRoles: ["superadmin", "admin", "staff"],
    },
    {
      title: "Tasks",
      url: "/tasks",
      Icon: ClipboardList,
      allowedRoles: ["superadmin", "admin"],
    },
    {
      title: "Users",
      url: "#",
      Icon: UsersIcon,
      children: [
        {
          title: "Staff",
          url: "/staff",
          allowedRoles: ["superadmin", "admin"],
        },
        {
          title: "Graduate",
          url: "/graduate",
          allowedRoles: ["superadmin", "admin", "staff"],
        },
        { title: "Admin",
          url: "/admin",
          allowedRoles: ["superadmin"] 
        },
      ],
    },
  ],
  secondaryNav: [
    {
      title: "Settings",
      url: "/settings",
      Icon: Settings,
      allowedRoles: ["superadmin", "admin"],
    },
  ],
};
