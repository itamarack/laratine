import _ from "lodash";
import { User, SelectableList, Category, Tags, Page, Post, Comment } from "@/types";

function createSelectableList<T extends { id?: number | string; title?: string; fullname?: string; content?: string }>(
  items: T[] | undefined,
  labelKey: keyof T,
  excludedId?: number | string
): SelectableList[] {
  if (_.isEmpty(items) || _.isNil(items)) return [];

  return items.filter((item: T) => item.id != null)
    .map((item: T) => ({ value: item.id!.toString(), label: item[labelKey] as string }))
    .filter((item) => item.value != excludedId?.toString());
}

export default function makeSelectableList<T extends { id?: number | string; title?: string; fullname?: string; content?: string }>(
  items: T[] | undefined,
  labelKey: keyof T,
  excludedItem?: T
): SelectableList[] {
  return createSelectableList(items, labelKey, excludedItem?.id);
}
