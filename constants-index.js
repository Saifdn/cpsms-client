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
    },
    {
      title: 'Dashboard',
      url: '/dashboard',
      Icon: LayoutDashboardIcon,
    },
    {
      title: 'Studio',
      url: '#',
      Icon: Camera,
      children: [
        { title: "Location", url: "/studio"},
        { title: "Package", url: "/package"},
        { title: "Session", url: "/session"}
      ]
    },
    {
      title: 'Booking',
      url: '#',
      Icon: CalendarCheck,
    },
    {
      title: 'Counter',
      url: '#',
      Icon: ScanQrCode,
      children: [
        { title: "Registration", url: "/registration-counter"},
        { title: "Studio", url: "/studio-counter"},
      ]
    },
    {
      title: 'Live Queue',
      url: '/live-queue',
      Icon: ClockAlert,
    },
    {
      title: 'Reporting',
      url: '#',
      Icon: ChartPieIcon,
    },
    {
      title: 'Users',
      url: '/staff',
      Icon: UsersIcon,
      children: [
        { title: "Staff", url: "/staff"},
        { title: "Gradaute", url: "/graduate"},
        { title: "Admin", url: "/admin"}
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