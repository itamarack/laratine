import {
  IconUserCircle,
  IconMessage,
  IconDashboard,
  IconSettings,
  IconUsersGroup,
  IconArticle,
  IconCategory,
  IconTags,
  IconBooks,
  IconMessage2,
  IconShield,
  IconLock
} from '@tabler/icons-react';

const ADMIN_PREFIX = "/admin";

const sidebarNavigation = [
  {
    title: 'Dashboard',
    links: [
      { label: 'Dashboard', icon: IconDashboard, link: `${ADMIN_PREFIX}/dashboard` },
      // { label: 'Messages', icon: IconMessage, link: '/admin/messages' },
    ]
  },
  {
    title: 'Publishing',
    links: [
      { label: 'Posts', icon: IconArticle, link: `${ADMIN_PREFIX}/posts` },
      { label: 'Categories', icon: IconCategory, link: `${ADMIN_PREFIX}/categories` },
      { label: 'Tags', icon: IconTags, link: `${ADMIN_PREFIX}/tags` },
      { label: 'Pages', icon: IconBooks, link: `${ADMIN_PREFIX}/pages` },
      { label: 'Comments', icon: IconMessage2, link: `${ADMIN_PREFIX}/comments` },
    ]
  },
  {
    title: 'User Management',
    links: [
      { label: 'Users', icon: IconUsersGroup, link: `${ADMIN_PREFIX}/users` },
      { label: 'Roles & Permissions', icon: IconShield, link: `${ADMIN_PREFIX}/roles-permissions` },
    ]
  },
  {
    title: 'My Account',
    links: [
      { label: 'Profile', icon: IconUserCircle, link: `${ADMIN_PREFIX}/profile` },
      { label: 'Account Security', icon: IconLock, link: `${ADMIN_PREFIX}/account-security` },
      // { label: 'Settings', icon: IconSettings, link: 'v/settings' },
    ]
  }
];

export default sidebarNavigation;
