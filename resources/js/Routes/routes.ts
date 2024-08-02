const ADMIN_PREFIX = '/admin';

export const dashboardRoute = {
  dashboard: `${ADMIN_PREFIX}/dashboard`
};

export const postRoute = {
  list: `${ADMIN_PREFIX}/posts`,
  create: `${ADMIN_PREFIX}/posts/create`,
  update: (id: string) => `${ADMIN_PREFIX}/posts/${id}/edit`
};

export const pageRoute = {
  list: `${ADMIN_PREFIX}/pages`,
  create: `${ADMIN_PREFIX}/pages/create`,
  update: (id: string) => `${ADMIN_PREFIX}/pages/${id}/edit`
};

export const categoryRoute = {
  list: `${ADMIN_PREFIX}/categories`,
  create: `${ADMIN_PREFIX}/categories/create`,
  update: (id: string) => `${ADMIN_PREFIX}/categories/${id}/edit`
};

export const userRoute = {
  list: `${ADMIN_PREFIX}/users`,
  create: `${ADMIN_PREFIX}/users/create`,
  update: (id: string | number) => `${ADMIN_PREFIX}/users/${id}/edit`
};

export const commentRoute = {
  list: `${ADMIN_PREFIX}/comments`,
  create: `${ADMIN_PREFIX}/comments/create`,
  update: (id: string) => `${ADMIN_PREFIX}/comments/${id}/edit`
};

export const permissionsRoute = {
  list: `${ADMIN_PREFIX}/roles-permissions`,
  create: `${ADMIN_PREFIX}/roles-permissions/permissions/create`,
  update: (id: string) => `${ADMIN_PREFIX}/roles-permissions/permissions/${id}/edit`
};
