import numeral from 'numeral';
import objectPath from 'object-path';
import React, { useEffect, useMemo } from 'react';

import { Dropdown, Input } from '@/components/tailwind-ui';

import HeaderRender from '../components/HeaderRender';
import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind, NumberColumnProps } from '../types';
import { QueryType } from './../types';
import {
  ChevronLeft20Regular,
  ChevronRight20Regular,
} from '@fluentui/react-icons';

enum NumberOperators {
  MIN = 'min',
  MAX = 'max',
}

interface IconFilterProps {
  operator: NumberOperators;
  className?: string;
}
export function IconFilterText({ operator, className }: IconFilterProps) {
  switch (operator) {
    case NumberOperators.MAX: {
      return <ChevronRight20Regular className={className} />;
    }
    case NumberOperators.MIN:
    default: {
      return <ChevronLeft20Regular className={className} />;
    }
  }
}
export const numberOperators = [
  [
    {
      label: 'Min value',
      type: 'option' as const,
      icon: <IconFilterText operator={NumberOperators.MIN} />,
      data: NumberOperators.MIN,
    },
    {
      label: 'Max value',
      type: 'option' as const,
      icon: <IconFilterText operator={NumberOperators.MAX} />,
      data: NumberOperators.MAX,
    },
  ],
];

function fromValueToQuery(
  value: number | undefined,
  operator: NumberOperators,
  path: string,
  query: QueryType,
): QueryType {
  const { [`${path}.max`]: max, [`${path}.min`]: min, ...other } = query;

  if (value === undefined) return other as QueryType;
  return { ...(other as QueryType), [`${path}.${operator}`]: `${value}` };
}

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
  const minValue = query[`${path}.min`];
  const maxValue = query[`${path}.max`];

  const [value, operator] = useMemo(() => {
    if (!minValue && maxValue) return [+maxValue, NumberOperators.MAX];
    if (minValue && !maxValue) return [+minValue, NumberOperators.MIN];
    return [undefined, NumberOperators.MIN];
  }, [minValue, maxValue]);

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
    format,
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
        type="number"
        onChange={({ currentTarget: { value } }) => {
          setQuery(fromValueToQuery(+value, operator, path, query));
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
                  ...fromValueToQuery(value, operator, path, query),
                  page: '1',
                });
              }
            }}
            options={numberOperators}
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
