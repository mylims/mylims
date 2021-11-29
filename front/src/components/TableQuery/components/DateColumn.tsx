import { format as dateFormat } from 'date-fns';
import objectPath from 'object-path';
import React, { useEffect } from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind, DateColumnProps } from '../types';

import HeaderRender from './HeaderRender';

import { Input } from '@/components/tailwind-ui';

export default function DateColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  format = 'dd.MM.yyyy HH:mm',
  children,
}: DateColumnProps) {
  const { query, setQuery, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;
  const value = objectPath(query).get(path, '');

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }

    const render =
      children ??
      ((row) => {
        const model = objectPath(row);
        if (!model.has(dataPath)) return '-';
        const date = model.get(dataPath);
        return dateFormat(new Date(date), format);
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
        kind: ColumnKind.DATE,
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
    format,
    dispatch,
    children,
  ]);

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
          if (e.key === 'Enter') submitQuery({ ...query, page: '1' });
        }}
        type="date"
      />
    </HeaderRender>
  );
}
