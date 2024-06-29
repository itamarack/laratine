import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import { User, SelectableList } from "@/types";

export function makeAuthorsList(authors: User[] | undefined) {
  if (_isEmpty(authors) || _isNil(authors)) return [];

  return authors.map((author: User) => ({
    value: author.id?.toString(),
    label: author.fullname
  })) as SelectableList[];
}
