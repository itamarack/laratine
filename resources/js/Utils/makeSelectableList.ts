import _ from "lodash";
import { User, SelectableList, Category, Tags, Page } from "@/types";

export function makeAuthorList(authors: User[] | undefined) {
  if (_.isEmpty(authors) || _.isNil(authors)) return [];

  return authors.map((author: User) => ({
    value: author.id?.toString(),
    label: author.fullname
  })) as SelectableList[];
}

export function makeCategoryList({ categories, category }: { categories?: Category[], category?: Category }) {
  if (_.isEmpty(categories) || _.isNil(categories)) return [];

  return categories.map((category: Category) => ({
    value: category.id?.toString(),
    label: category.title
  })).filter((item) => item.value != category?.id) as SelectableList[];
}

export function makeTagsList({ tags, tag }: { tags?: Tags[], tag?: Tags }) {
  if (_.isEmpty(tags) || _.isNil(tags)) return [];

  return tags.map((tag: Tags) => ({
    value: tag.id?.toString(),
    label: tag.title
  })).filter((item) => item.value != tag?.id) as SelectableList[];
}

export function makePagesList({ pages, page }: { pages?: Page[], page?: Page }) {
  if (_.isEmpty(pages) || _.isNil(pages)) return [];

  return pages.map((page: Page) => ({
    value: page.id?.toString(),
    label: page.title
  })).filter((item) => item.value != page?.id) as SelectableList[];
}
