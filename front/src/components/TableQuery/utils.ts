import { Children, cloneElement, isValidElement, ReactNode } from 'react';

import ActionsColumn from './components/ActionsColumn';
import DateColumn from './components/DateColumn';
import MultiSelectColumn from './components/MultiSelectColumn';
import NumberColumn from './components/NumberColumn';
import Queries from './components/QueryPreview';
import TextColumn from './components/TextColumn';
import TextListColumn from './components/TextListColumn';
import TextMetaColumn from './components/TextMetaColumn';

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
export function boundariesFromPage(page: string) {
  const pageNumber = parseInt(page, 10);
  return {
    skip: (pageNumber - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  };
}
