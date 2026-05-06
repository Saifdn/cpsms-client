import {
  BookOpenIcon,
  ChartPieIcon,
  CopyCheckIcon,
  CopyIcon,
  FolderKanbanIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  LogOutIcon,
  PencilIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
  UsersIcon,
  Camera,
  CalendarCheck,
  ClockAlert,
  ScanQrCode,
} from 'lucide-react';

export const APP_SIDEBAR = {
  primaryNav: [
    {
      title: 'Home',
      url: '/',
      Icon: HomeIcon,
      allowedRoles: ["graduate"]
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      Icon: LayoutDashboardIcon,
      allowedRoles: ["superadmin", "admin", "staff"]
    },
    {
      title: 'Studio',
      url: '#',
      Icon: Camera,
      children: [
        { title: "Location", url: "/studio", allowedRoles: ["superadmin", "admin", "staff"]},
        { title: "Package", url: "/package", allowedRoles: ["superadmin", "admin", "staff"]},
        { title: "Session", url: "/session", allowedRoles: ["superadmin", "admin", "staff"]}
      ]
    },
    {
      title: 'Booking',
      url: '/booking',
      Icon: CalendarCheck,
      allowedRoles: ["superadmin", "admin", "staff"]
    },
    {
      title: 'Check-In / Out',
      url: '#',
      Icon: ScanQrCode,
      children: [
        { title: "Registration Counter", url: "/registration-counter", allowedRoles: ["superadmin", "admin", "staff"]},
        { title: "Studio Counter", url: "/studio-counter", allowedRoles: ["superadmin", "admin", "staff"]},
      ]
    },
    {
      title: 'Live Queue',
      url: '/live-queue',
      Icon: ClockAlert,
      allowedRoles: ["superadmin", "admin", "staff"]
    },
    {
      title: 'Reporting',
      url: '#',
      Icon: ChartPieIcon,
      allowedRoles: ["superadmin", "admin", "staff"]
    },
    {
      title: 'Users',
      url: '/staff',
      Icon: UsersIcon,
      children: [
        { title: "Staff", url: "/staff", allowedRoles: ["superadmin", "admin", "staff"]},
        { title: "Gradaute", url: "/graduate", allowedRoles: ["superadmin", "admin", "staff"]},
        { title: "Admin", url: "/admin", allowedRoles: ["superadmin"]},
      ]
    },
  ],
  secondaryNav: [
    {
      title: 'Support',
      url: '#',
      Icon: LifeBuoyIcon,
    },
    {
      title: 'Settings',
      url: '#',
      Icon: SettingsIcon,
    },
  ],
  curProfile: {
    src: 'https://randomuser.me/api/portraits/men/47.jpg',
    name: 'Ahmad Saifudin',
    email: 'sai@utm.my',
  },
  allProfiles: [
    {
      src: 'https://randomuser.me/api/portraits/men/47.jpg',
      name: 'Salvador Pearson',
      email: 'salvador.pearson@example.com',
    },
    {
      src: 'https://randomuser.me/api/portraits/women/43.jpg',
      name: 'Violet Hicks',
      email: 'violet.hicks@example.com',
    },
  ],
  userMenu: {
    itemsPrimary: [
      {
        title: 'View profile',
        url: '#',
        Icon: UserIcon,
        kbd: '⌘K->P',
      },
      {
        title: 'Account settings',
        url: '#',
        Icon: SettingsIcon,
        kbd: '⌘S',
      },
    ],
    itemsSecondary: [
      {
        title: 'Sign out',
        url: '#',
        Icon: LogOutIcon,
        kbd: '⌥⇧Q',
      },
    ],
  },
};