import { Children, cloneElement, isValidElement, ReactNode } from 'react';

import DateColumn from './components/DateColumn';
import NumberColumn from './components/NumberColumn';
import TextColumn from './components/TextColumn';

const invalidError = 'Invalid column child';
export function splitChildren(children: ReactNode) {
  let columns = [];
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
      child.type === DateColumn
    ) {
      columns.push(cloneElement(child, { ...child.props, index }));
    } else {
      // eslint-disable-next-line no-console
      console.error(invalidError, child);
      throw new Error(invalidError);
    }
  }
  return { columns };
}
