import React, { useEffect } from 'react';
import objectPath from 'object-path';
import numeral from 'numeral';

import { Input } from '@/components/tailwind-ui';
import { ColumnKind, NumberColumnProps } from '../types';
import { useTableQueryContext } from '../hooks/useTableQueryContext';
import HeaderRender from './HeaderRender';

export default function NumberColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  format = '0.00',
  children,
}: NumberColumnProps) {
  const { query, setQuery, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;
  const render =
    children ??
    ((row) => {
      const model = objectPath(row);
      if (!model.has(dataPath)) return '-';
      const num = model.get(dataPath);
      return numeral(num).format(format);
    });

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        index,
        value: {
          dataPath,
          queryPath: path,
          disableSearch,
          disableSort,
          nullable,
          render,
        },
        kind: ColumnKind.NUMBER,
      },
    });

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { index } });
  }, [dataPath, path, disableSearch, disableSort, nullable, index]);

  if (disableSearch) return <HeaderRender title={title} path={path} />;
  const value = objectPath(query).get(path, '');
  return (
    <HeaderRender title={title} path={path}>
      <Input
        name={path}
        label={path}
        value={value}
        hiddenLabel
        type="number"
        onChange={({ currentTarget: { value } }) => {
          setQuery({ ...query, [path]: value });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submitQuery(query);
        }}
      />
    </HeaderRender>
  );
}
