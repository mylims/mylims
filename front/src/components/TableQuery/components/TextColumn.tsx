import {
  EqualCircle20Regular,
  TextAddSpaceBefore20Regular,
  TextDirectionHorizontalRight20Regular,
} from '@fluentui/react-icons';
import objectPath from 'object-path';
import React, { useEffect } from 'react';

import { Dropdown, Input } from '@/components/tailwind-ui';
import { FilterTextOperator } from '@/generated/graphql';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { BaseColumnProps, ColumnKind } from '../types';

import HeaderRender from './HeaderRender';

interface IconFilterProps {
  operator: FilterTextOperator;
  className?: string;
}
export function IconFilterText({ operator, className }: IconFilterProps) {
  switch (operator) {
    case FilterTextOperator.STARTSWITH: {
      return <TextDirectionHorizontalRight20Regular className={className} />;
    }
    case FilterTextOperator.EQUALS: {
      return <EqualCircle20Regular className={className} />;
    }
    case FilterTextOperator.CONTAINS:
    default: {
      return <TextAddSpaceBefore20Regular className={className} />;
    }
  }
}
export const textOperators = [
  [
    {
      label: 'Contains',
      type: 'option' as const,
      icon: <IconFilterText operator={FilterTextOperator.CONTAINS} />,
      data: FilterTextOperator.CONTAINS,
    },
    {
      label: 'Exact search',
      type: 'option' as const,
      icon: <IconFilterText operator={FilterTextOperator.EQUALS} />,
      data: FilterTextOperator.EQUALS,
    },
    {
      label: 'Starts with',
      type: 'option' as const,
      icon: <IconFilterText operator={FilterTextOperator.STARTSWITH} />,
      data: FilterTextOperator.STARTSWITH,
    },
  ],
];

export default function TextColumn({
  title,
  dataPath,
  queryPath,
  disableSort = true,
  disableSearch = false,
  nullable = false,
  index,
  children,
}: BaseColumnProps) {
  const { query, setQuery, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;
  const value = query[`${path}.value`] ?? '';
  const operator =
    (query[`${path}.operator`] as FilterTextOperator) ??
    FilterTextOperator.CONTAINS;

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
    children,
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
            options={textOperators}
          >
            <IconFilterText
              operator={operator}
              className="mx-2 h-5 w-5 text-neutral-400"
            />
          </Dropdown>
        }
      />
    </HeaderRender>
  );
}
