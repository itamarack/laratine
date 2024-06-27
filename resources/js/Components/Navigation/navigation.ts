import {
  IconUserCircle,
  IconMessage,
  IconDashboard,
  IconSettings,
  IconUsersGroup
} from '@tabler/icons-react';

const navigationItems = [
  {
    title: 'Dashboard',
    links: [
      { label: 'Dashboard', icon: IconDashboard, link: '/dashboard' },
      { label: 'Messages', icon: IconMessage, link: '/messages' },
    ]
  },
  {
    title: 'Account',
    links: [
      { label: 'Profile', icon: IconUserCircle, link: '/profile' },
      { label: 'Users', icon: IconUsersGroup, link: '/users' },
      { label: 'Settings', icon: IconSettings, link: '/settings' },
    ]
  }
];

export default navigationItems;
