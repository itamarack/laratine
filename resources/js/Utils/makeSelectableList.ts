import _ from "lodash";
import { User, SelectableList, Category } from "@/types";

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
