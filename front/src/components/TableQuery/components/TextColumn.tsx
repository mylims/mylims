import {
  ArrowCircleDownIcon,
  ArrowCircleRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/outline';
import objectPath from 'object-path';
import React, { useEffect } from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { BaseColumnProps, ColumnKind } from '../types';

import HeaderRender from './HeaderRender';

import { Dropdown, Input } from '@/components/tailwind-ui';
import { FilterTextOperator } from '@/generated/graphql';

interface IconFilterProps {
  operator: FilterTextOperator;
  className?: string;
}
export function IconFilterText({ operator, className }: IconFilterProps) {
  switch (operator) {
    case FilterTextOperator.CONTAINS: {
      return <ArrowCircleDownIcon className={className} />;
    }
    case FilterTextOperator.STARTSWITH: {
      return <ArrowCircleRightIcon className={className} />;
    }
    case FilterTextOperator.EQUALS:
    default: {
      return <CheckCircleIcon className={className} />;
    }
  }
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
  const value = query[`${path}.value`] ?? '';
  const operator =
    (query[`${path}.operator`] as FilterTextOperator) ??
    FilterTextOperator.EQUALS;

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }

    const render =
      children ?? ((row) => objectPath(row).get(dataPath, '-') ?? '-');

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
          setQuery({
            ...query,
            [`${path}.value`]: value,
            [`${path}.operator`]: operator,
          });
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submitQuery({ ...query, page: '1' });
        }}
        trailingAddon={
          <Dropdown
            noDefaultButtonStyle
            buttonClassName="rounded-full flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none "
            onSelect={({ data }) => {
              if (data) {
                submitQuery({
                  ...query,
                  [`${path}.value`]: value,
                  [`${path}.operator`]: data,
                });
              }
            }}
            options={[
              [
                {
                  label: 'Exact search',
                  type: 'option',
                  icon: <IconFilterText operator={FilterTextOperator.EQUALS} />,
                  data: FilterTextOperator.EQUALS,
                },
                {
                  label: 'Contains',
                  type: 'option',
                  icon: (
                    <IconFilterText operator={FilterTextOperator.CONTAINS} />
                  ),
                  data: FilterTextOperator.CONTAINS,
                },
                {
                  label: 'Starts with',
                  type: 'option',
                  icon: (
                    <IconFilterText operator={FilterTextOperator.STARTSWITH} />
                  ),
                  data: FilterTextOperator.STARTSWITH,
                },
              ],
            ]}
          >
            <IconFilterText
              operator={operator}
              className="w-5 h-5 mx-2 text-neutral-400"
            />
          </Dropdown>
        }
      />
    </HeaderRender>
  );
}
