export const postRoute = (postId?: string) => ({
  list: '/list',
  create: './posts/create',
  update: `./posts/${postId}/edit`
});
