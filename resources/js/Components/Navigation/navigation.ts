import {
  IconUserCircle,
  IconMessage,
  IconDashboard,
  IconSettings,
  IconUsersGroup,
  IconArticle,
  IconCategory,
  IconTags,
  IconBooks
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
    title: 'Publishing',
    links: [
      { label: 'Posts', icon: IconArticle, link: '/posts' },
      { label: 'Categories', icon: IconCategory, link: '/categories' },
      { label: 'Tags', icon: IconTags, link: '/tags' },
      { label: 'Pages', icon: IconBooks, link: '/pages' },
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
