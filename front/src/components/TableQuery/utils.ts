import { unflatten } from 'flat';
import { Children, cloneElement, isValidElement, ReactNode } from 'react';

import { FilterMetaText } from '@/generated/graphql';

import ActionsColumn from './columns/ActionsColumn';
import DateColumn from './columns/DateColumn';
import MultiSelectColumn from './columns/MultiSelectColumn';
import NumberColumn from './columns/NumberColumn';
import TextColumn from './columns/TextColumn';
import TextListColumn from './columns/TextListColumn';
import TextMetaColumn from './columns/TextMetaColumn';
import UserColumn from './columns/UserColumn';
import Queries from './components/QueryPreview';
import { QueryType } from './types';

const invalidError = 'Invalid column child';
export function splitChildren(children: ReactNode) {
  let columns = [];
  let queries = null;
  const childrenArray = Children.toArray(children);
  for (let index = 0; index < childrenArray.length; index++) {
    let child = childrenArray[index];
    if (typeof child !== 'object' || !isValidElement(child)) {
      // eslint-disable-next-line no-console
      console.error(invalidError, child);
      throw new Error(invalidError);
    } else if (
      child.type === NumberColumn ||
      child.type === TextColumn ||
      child.type === TextListColumn ||
      child.type === TextMetaColumn ||
      child.type === DateColumn ||
      child.type === MultiSelectColumn ||
      child.type === UserColumn ||
      child.type === ActionsColumn
    ) {
      columns.push(cloneElement(child, { ...child.props, index }));
    } else if (child.type === Queries) {
      queries = child;
    } else {
      // eslint-disable-next-line no-console
      console.error(invalidError, child);
      throw new Error(invalidError);
    }
  }
  return { columns, queries };
}

export const PAGE_SIZE = 10;
interface BaseQuery {
  page: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortBy: Record<'direction' | 'field', any>;
  meta?: Record<string, Omit<FilterMetaText, 'key'>>;
  user?: Record<'label' | 'value', string>;
}
export function getVariablesFromQuery<T extends BaseQuery>(query: QueryType) {
  const {
    page,
    sortBy,
    meta: rawMeta,
    user,
    ...filter
  } = unflatten<QueryType, T>(query);
  type Filter = typeof filter & { userId?: string; meta?: FilterMetaText[] };
  let filterBy: Filter = filter;
  if (rawMeta) {
    filterBy.meta = Object.entries(rawMeta).map(
      ([key, { value, operator }]) => ({
        key,
        value,
        operator,
      }),
    );
  }
  if (user) filterBy.userId = user.value;

  const pageNumber = parseInt(page, 10);
  return {
    skip: (pageNumber - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    filterBy,
    sortBy,
  };
}
