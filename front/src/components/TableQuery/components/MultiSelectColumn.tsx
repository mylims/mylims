import React, { useEffect, useMemo } from 'react';
import objectPath from 'object-path';

import {
  MultiSearchSelect,
  useMultiSearchSelect,
} from '@/components/tailwind-ui';
import { SelectColumnProps, ColumnKind, SelectionValue } from '../types';
import { useTableQueryContext } from '../hooks/useTableQueryContext';
import HeaderRender from './HeaderRender';

function parseOptions(options: SelectColumnProps['options']): SelectionValue[] {
  return options.map((value) => {
    if (typeof value === 'string') return { value, label: value };
    return value;
  });
}

export default function MultiSelectColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  options,
  children,
}: SelectColumnProps) {
  const { query, submitQuery, dispatch } = useTableQueryContext();
  const selectTags = useMultiSearchSelect({ options: parseOptions(options) });
  const path = queryPath ?? dataPath;
  const value = useMemo(
    () =>
      objectPath(query)
        .get(path, '')
        .split(',')
        .filter((val) => val !== ''),
    [query, path],
  );

  const render =
    children ??
    ((row) => {
      const model = objectPath(row);
      if (!model.has(dataPath)) return '-';
      return model.get(dataPath).join(', ');
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
        kind: ColumnKind.MULTI_SELECT,
      },
    });

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { index } });
  }, [dataPath, path, disableSearch, disableSort, nullable, index]);

  if (disableSearch) return <HeaderRender title={title} path={path} />;
  return (
    <HeaderRender title={title} path={path}>
      <MultiSearchSelect
        {...selectTags}
        name={path}
        label={path}
        clearable
        hiddenLabel
        onSelect={(value: SelectionValue[]) => {
          submitQuery({
            ...query,
            [path]: value.map((v) => v.value).join(','),
          });
        }}
        selected={parseOptions(value)}
      />
    </HeaderRender>
  );
}
