import objectPath from 'object-path';
import React, { useEffect, useMemo } from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { SelectColumnProps, ColumnKind, SelectionValue } from '../types';

import HeaderRender from './HeaderRender';

import {
  MultiSearchSelect,
  useMultiSearchSelect,
} from '@/components/tailwind-ui';

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

  if (disableSearch) return <HeaderRender title={title} path={path} />;
  return (
    <HeaderRender title={title} path={path}>
      {(ref) => (
        <MultiSearchSelect
          {...selectTags}
          ref={ref}
          name={path}
          label={path}
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
      )}
    </HeaderRender>
  );
}
