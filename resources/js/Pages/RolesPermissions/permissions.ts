export type Permission = {
  name: string;
  checked: boolean;
  permission: {
    name: string;
    value: string;
    checked: boolean;
  }[]
}

export const permissionsOptions: Permission[] = [
  {
    name: 'Post',
    checked: false,
    permission: [
      { name: 'View', value: 'View Post', checked: false, },
      { name: 'Create', value: 'Create Post', checked: false, },
      { name: 'Update', value: 'Update Post', checked: false, },
      { name: 'Delete', value: 'Delete Post', checked: false, }
    ],
  },
  {
    name: 'Category',
    checked: false,
    permission: [
      { name: 'View', value: 'View Category', checked: false, },
      { name: 'Create', value: 'Create Category', checked: false, },
      { name: 'Update', value: 'Update Category', checked: false, },
      { name: 'Delete', value: 'Delete Category', checked: false, }
    ],
  },
  {
    name: 'Pages',
    checked: false,
    permission: [
      { name: 'View', value: 'View Pages', checked: false, },
      { name: 'Create', value: 'Create Pages', checked: false, },
      { name: 'Update', value: 'Update Pages', checked: false, },
      { name: 'Delete', value: 'Delete Pages', checked: false, }
    ],
  },
  {
    name: 'Tags',
    checked: false,
    permission: [
      { name: 'View', value: 'View Tags', checked: false, },
      { name: 'Create', value: 'Create Tags', checked: false, },
      { name: 'Update', value: 'Update Tags', checked: false, },
      { name: 'Delete', value: 'Delete Tags', checked: false, }
    ],
  },
  {
    name: 'Comments',
    checked: false,
    permission: [
      { name: 'View', value: 'View Comments', checked: false, },
      { name: 'Create', value: 'Create Comments', checked: false, },
      { name: 'Update', value: 'Update Comments', checked: false, },
      { name: 'Delete', value: 'Delete Comments', checked: false, }
    ],
  },
  {
    name: 'Users',
    checked: false,
    permission: [
      { name: 'View', value: 'View Users', checked: false, },
      { name: 'Create', value: 'Create Users', checked: false, },
      { name: 'Update', value: 'Update Users', checked: false, },
      { name: 'Delete', value: 'Delete Users', checked: false, }
    ],
  },
  {
    name: 'Roles & Permissions',
    checked: false,
    permission: [
      { name: 'View', value: 'View Roles', checked: false, },
      { name: 'Create', value: 'Create Roles', checked: false, },
      { name: 'Update', value: 'Update Roles', checked: false, },
      { name: 'Delete', value: 'Delete Roles', checked: false, }
    ],
  },
  {
    name: 'Profile',
    checked: false,
    permission: [
      { name: 'View', value: 'View Profiles', checked: false, },
      { name: 'Create', value: 'Create Profiles', checked: false, },
      { name: 'Update', value: 'Update Profiles', checked: false, },
      { name: 'Delete', value: 'Delete Profiles', checked: false, }
    ],
  },
]
