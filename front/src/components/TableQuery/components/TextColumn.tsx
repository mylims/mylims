import React, { useEffect } from 'react';
import objectPath from 'object-path';

import { Input } from '@/components/tailwind-ui';
import { BaseColumnProps, ColumnKind } from '../types';
import { useTableQueryContext } from '../hooks/useTableQueryContext';
import HeaderRender from './HeaderRender';

export default function TextColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  children,
}: BaseColumnProps) {
  const { query, setQuery, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;
  const value = objectPath(query).get(path, '');

  const render =
    children ??
    ((row) => {
      const model = objectPath(row);
      if (!model.has(dataPath)) return '-';
      return model.get(dataPath);
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
        kind: ColumnKind.TEXT,
      },
    });

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { index } });
  }, [dataPath, path, disableSearch, disableSort, nullable, index]);

  if (disableSearch) return <HeaderRender title={title} path={path} />;
  return (
    <HeaderRender title={title} path={path}>
      <Input
        name={path}
        label={path}
        value={value}
        hiddenLabel
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
