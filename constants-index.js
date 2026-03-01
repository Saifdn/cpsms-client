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
} from 'lucide-react';

export const APP_SIDEBAR = {
  primaryNav: [
    {
      title: 'Home',
      url: '#',
      Icon: HomeIcon,
    },
    {
      title: 'Dashboard',
      url: '#',
      Icon: LayoutDashboardIcon,
    },
    {
      title: 'Project',
      url: '#',
      Icon: FolderKanbanIcon,
    },
    {
      title: 'Tasks',
      url: '#',
      Icon: CopyCheckIcon,
    },
    {
      title: 'Reporting',
      url: '#',
      Icon: ChartPieIcon,
    },
    {
      title: 'Users',
      url: '#',
      Icon: UsersIcon,
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