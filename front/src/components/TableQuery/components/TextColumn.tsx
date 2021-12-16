import objectPath from 'object-path';
import React, { useEffect } from 'react';
import {
  ArrowCircleDownIcon,
  ArrowCircleRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/outline';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { BaseColumnProps, ColumnKind } from '../types';

import HeaderRender from './HeaderRender';

import { Dropdown, Input } from '@/components/tailwind-ui';

export enum TextFilter {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  STARTS_WITH = 'startsWith',
}

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
    path,
    title,
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
        trailingAddon={
          <Dropdown
            onSelect={({ data }) => console.log(data)}
            options={[
              [
                {
                  label: 'Exact search',
                  type: 'option',
                  icon: <CheckCircleIcon />,
                  data: TextFilter.EQUALS,
                },
                {
                  label: 'Contains',
                  type: 'option',
                  icon: <ArrowCircleDownIcon />,
                  data: TextFilter.CONTAINS,
                },
                {
                  label: 'Starts with',
                  type: 'option',
                  icon: <ArrowCircleRightIcon />,
                  data: TextFilter.STARTS_WITH,
                },
              ],
            ]}
          >
            <CheckCircleIcon className="w-5 h-5 mx-2 text-neutral-400" />
          </Dropdown>
        }
      />
    </HeaderRender>
  );
}
