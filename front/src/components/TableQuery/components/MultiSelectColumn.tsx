import objectPath from 'object-path';
import React, { useEffect, useMemo } from 'react';

import {
  MultiSearchSelect,
  useMultiSearchSelect,
} from '@/components/tailwind-ui';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { SelectColumnProps, ColumnKind, SelectionValue } from '../types';

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
    () => (query[path] ?? '').split(',').filter((val) => val !== ''),
    [query, path],
  );

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }

    const render =
      children ??
      ((row) => {
        const model = objectPath(row);
        if (!model.has(dataPath)) return '-';
        return model.get(dataPath).join(', ');
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
        kind: ColumnKind.MULTI_SELECT,
        title: title.toLowerCase(),
      },
    });

    return () =>
      dispatch({
        type: 'REMOVE_COLUMN',
        payload: { title: title.toLowerCase() },
      });
  }, [
    dataPath,
    title,
    path,
    disableSearch,
    disableSort,
    nullable,
    index,
    dispatch,
  ]);

  if (disableSearch) {
    return <HeaderRender title={title} path={path} disableSort={disableSort} />;
  }
  return (
    <HeaderRender title={title} path={path} disableSort={disableSort}>
      <MultiSearchSelect
        {...selectTags}
        name={path}
        label={path}
        autoFocus
        clearable
        hiddenLabel
        onSelect={(value: SelectionValue[]) => {
          submitQuery({
            ...query,
            [path]: value.map((v) => v.value).join(','),
            page: '1',
          });
        }}
        selected={parseOptions(value)}
      />
    </HeaderRender>
  );
}
