import urlSlug from 'url-slug';

export default function slugify(title: string): string {
  return urlSlug(title);
}
