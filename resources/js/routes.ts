export const dashboardRoute = () => '/dashboard';

export const postRoute = (postId?: string) => ({
  list: '/posts/list',
  create: '/posts/create',
  update: `/posts/${postId}/edit`
});

export const userRoute = (userId?: string | number) => ({
  list: '/users/list',
  create: '/users/create',
  update: `/users/${userId}/edit`
});
