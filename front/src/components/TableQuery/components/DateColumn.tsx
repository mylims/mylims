import React, { useEffect } from 'react';

import { ColumnKind, DateColumnProps } from '../types';
import { useTableQueryContext } from '../hooks/useTableQueryContext';

export default function DateColumn({
  fieldPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  format = 'dd.MM.yyyy HH:mm',
}: DateColumnProps) {
  const { dispatch } = useTableQueryContext();

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${fieldPath}`);
    }
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        index,
        value: { fieldPath, disableSearch, disableSort, nullable, format },
        kind: ColumnKind.DATE,
      },
    });

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { index } });
  }, [fieldPath, disableSearch, disableSort, nullable, index]);

  return (
    <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase rounded-t-lg text-neutral-500 ">
      {fieldPath}
    </th>
  );
}
