export type Permission = {
  name: string;
  checked: boolean;
  permission: {
    name: string;
    checked: boolean;
  }[]
}

export const permissionsOptions: Permission[] = [
  {
    name: 'Post',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
  {
    name: 'Category',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
  {
    name: 'Pages',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
  {
    name: 'Tags',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
  {
    name: 'Comments',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
  {
    name: 'Users',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
  {
    name: 'Roles & Permissions',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
  {
    name: 'Profile',
    checked: false,
    permission: [
      { name: 'View', checked: false, },
      { name: 'Create', checked: false, },
      { name: 'Update', checked: false, },
      { name: 'Delete', checked: false, }
    ],
  },
]
