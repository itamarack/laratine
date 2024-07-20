export const dashboardRoute = () => '/dashboard';

export const postRoute = (postId?: string) => ({
  list: '/posts',
  create: '/posts/create',
  update: `/posts/${postId}/edit`
});

export const pageRoute = (pageId?: string) => ({
  list: '/pages',
  create: '/pages/create',
  update: `/pages/${pageId}/edit`
});

export const userRoute = (userId?: string | number) => ({
  list: '/users',
  create: '/users/create',
  update: `/users/${userId}/edit`
});

export const commentRoute = (commentId?: string | number) => ({
  list: '/comments',
  create: '/comments/create',
  update: `/comments/${commentId}/edit`
});
