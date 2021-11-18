import React, { useEffect } from 'react';
import objectPath from 'object-path';

import { Input } from '@/components/tailwind-ui';
import { BaseColumnProps, ColumnKind } from '../types';
import { useTableQueryContext } from '../hooks/useTableQueryContext';
import HeaderRender from './HeaderRender';
import SortIcon from './SortIcon';

export default function TextColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
}: BaseColumnProps) {
  const { query, setQuery, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;

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
        },
        kind: ColumnKind.TEXT,
      },
    });

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { index } });
  }, [dataPath, path, disableSearch, disableSort, nullable, index]);

  if (disableSearch) return <HeaderRender title={title} />;
  const value = objectPath(query).get(path, '');
  return (
    <HeaderRender title={title}>
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
        trailingInlineAddon={<SortIcon disableSort={disableSort} path={path} />}
      />
    </HeaderRender>
  );
}
