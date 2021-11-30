import numeral from 'numeral';
import objectPath from 'object-path';
import React, { useEffect } from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind, NumberColumnProps } from '../types';

import HeaderRender from './HeaderRender';

import { Input } from '@/components/tailwind-ui';

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

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }

    const render =
      children ??
      ((row) => {
        const model = objectPath(row);
        if (!model.has(dataPath)) return '-';
        const num = model.get(dataPath);
        return numeral(num).format(format);
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
        kind: ColumnKind.NUMBER,
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
  const value = objectPath(query).get(path, '');
  return (
    <HeaderRender title={title} path={path}>
      {(ref) => (
        <Input
          name={path}
          label={path}
          value={value}
          ref={ref}
          hiddenLabel
          type="number"
          onChange={({ currentTarget: { value } }) => {
            setQuery({ ...query, [path]: value, page: '1' });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitQuery(query);
          }}
        />
      )}
    </HeaderRender>
  );
}
