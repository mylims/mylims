import objectPath from 'object-path';
import React, { useEffect } from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { BaseColumnProps, ColumnKind } from '../types';

import HeaderRender from './HeaderRender';

import { Input } from '@/components/tailwind-ui';

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
  const value = query[path] ?? '';

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }

    const render =
      children ??
      ((row) => {
        const model = objectPath(row);
        return model.get(dataPath, '-') ?? '-';
      });

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

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { dataPath } });
  }, [
    dataPath,
    path,
    disableSearch,
    disableSort,
    nullable,
    index,
    dispatch,
    children,
  ]);

  if (disableSearch) {
    return <HeaderRender title={title} path={path} disableSort={disableSort} />;
  }
  return (
    <HeaderRender title={title} path={path} disableSort={disableSort}>
      <Input
        name={path}
        label={path}
        value={value}
        autoFocus
        hiddenLabel
        onChange={({ currentTarget: { value } }) => {
          setQuery({ ...query, [path]: value });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submitQuery({ ...query, page: '1' });
        }}
      />
    </HeaderRender>
  );
}
