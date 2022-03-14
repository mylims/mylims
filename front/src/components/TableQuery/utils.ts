import { unflatten } from 'flat';
import { Children, cloneElement, isValidElement, ReactNode } from 'react';

import { FilterMetaText } from '@/generated/graphql';

import ActionsColumn from './components/ActionsColumn';
import DateColumn from './components/DateColumn';
import MultiSelectColumn from './components/MultiSelectColumn';
import NumberColumn from './components/NumberColumn';
import Queries from './components/QueryPreview';
import TextColumn from './components/TextColumn';
import TextListColumn from './components/TextListColumn';
import TextMetaColumn from './components/TextMetaColumn';
import UserColumn from './components/UserColumn';
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
  const meta = rawMeta
    ? Object.entries(rawMeta).map(([key, { value, operator }]) => ({
        key,
        value,
        operator,
      }))
    : null;
  const pageNumber = parseInt(page, 10);
  return {
    skip: (pageNumber - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
    filterBy: { ...filter, meta, userId: user?.value },
    sortBy,
  };
}
