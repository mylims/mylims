import React, { useEffect } from 'react';

import { BaseColumnProps, ColumnKind } from '../types';
import { useTableQueryContext } from '../hooks/useTableQueryContext';

export default function TextColumn({
  fieldPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
}: BaseColumnProps) {
  const { dispatch } = useTableQueryContext();

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${fieldPath}`);
    }
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        index,
        value: { fieldPath, disableSearch, disableSort, nullable },
        kind: ColumnKind.TEXT,
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
