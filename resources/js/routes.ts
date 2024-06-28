export const postRoute = (postId?: string) => ({
  list: '/posts/list',
  create: './posts/create',
  update: `./posts/${postId}/edit`
});
