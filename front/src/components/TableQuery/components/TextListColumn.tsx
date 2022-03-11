import objectPath from 'object-path';
import React, { useEffect } from 'react';

import { Dropdown, Input } from '@/components/tailwind-ui';
import { FilterTextOperator } from '@/generated/graphql';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind, TextListColumnProps } from '../types';

import HeaderRender from './HeaderRender';
import { IconFilterText } from './TextColumn';

export default function TextListColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  queryIndex,
  children,
}: TextListColumnProps) {
  const { query, setQuery, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;
  const value = query[`${path}.${queryIndex}.value.value`] ?? '';
  const operator =
    (query[`${path}.${queryIndex}.value.operator`] as FilterTextOperator) ??
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
          queryIndex,
          disableSearch,
          disableSort,
          nullable,
          render,
        },
        kind: ColumnKind.TEXT_LIST,
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
    queryIndex,
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
    <HeaderRender
      title={title}
      path={path}
      disableSort={disableSort}
      queryIndex={queryIndex}
    >
      <Input
        name={path}
        label={path}
        value={value}
        autoFocus
        hiddenLabel
        onChange={({ currentTarget: { value } }) => {
          setQuery({
            ...query,
            [`${path}.${queryIndex}.index`]: `${queryIndex}`,
            [`${path}.${queryIndex}.value.value`]: value,
            [`${path}.${queryIndex}.value.operator`]: operator,
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
                  [`${path}.${queryIndex}.index`]: `${queryIndex}`,
                  [`${path}.${queryIndex}.value.value`]: value,
                  [`${path}.${queryIndex}.value.operator`]: data,
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
              className="mx-2 h-5 w-5 text-neutral-400"
            />
          </Dropdown>
        }
      />
    </HeaderRender>
  );
}
