import { Select } from '@/components/tailwind-ui';
import { format as dateFormat, startOfDay, endOfDay } from 'date-fns';
import objectPath from 'object-path';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind, DateColumnProps } from '../types';

import HeaderRender from './HeaderRender';

function limitDate(date: Date | null, limiter: (date: Date) => Date) {
  return date ? limiter(date).toISOString() : null;
}

enum DateOperators {
  BETWEEN = 'between',
  LESS = 'less',
  GREATER = 'greater',
}
const OPERATOR_LABEL = {
  [DateOperators.BETWEEN]: 'Same day',
  [DateOperators.LESS]: 'Before day',
  [DateOperators.GREATER]: 'From day',
};
export default function DateColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  format = 'dd.MM.yyyy HH:mm',
  children,
}: DateColumnProps) {
  const { query, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;
  const fromValue = query[`${path}.from`];
  const toValue = query[`${path}.to`];

  const [operator, setOperator] = useState(() => {
    if (!fromValue && !toValue) return DateOperators.BETWEEN;
    if (!fromValue && toValue) return DateOperators.LESS;
    if (fromValue && !toValue) return DateOperators.GREATER;
    return DateOperators.BETWEEN;
  });
  const value = fromValue
    ? new Date(fromValue)
    : toValue
    ? new Date(toValue)
    : null;

  const handleChange = (value: Date | null, operator: DateOperators) => {
    let newQuery: Record<string, string | null> = {};
    switch (operator) {
      case DateOperators.LESS: {
        newQuery[`${path}.from`] = null;
        newQuery[`${path}.to`] = limitDate(value, endOfDay);
        break;
      }
      case DateOperators.GREATER: {
        newQuery[`${path}.from`] = limitDate(value, startOfDay);
        newQuery[`${path}.to`] = null;
        break;
      }
      case DateOperators.BETWEEN:
      default: {
        newQuery[`${path}.from`] = limitDate(value, startOfDay);
        newQuery[`${path}.to`] = limitDate(value, endOfDay);
        break;
      }
    }

    submitQuery({ ...query, ...newQuery, page: '1' });
  };
  useEffect(() => {
    handleChange(value, operator);
  }, [operator]);

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }

    const render =
      children ??
      ((row) => {
        const model = objectPath(row);
        if (!model.has(dataPath)) return '-';
        const date = model.get(dataPath);
        return dateFormat(new Date(date), format);
      });

    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        index,
        title: title.toLowerCase(),
        value: {
          dataPath,
          queryPath: path,
          disableSearch,
          disableSort,
          nullable,
          render,
        },
        kind: ColumnKind.DATE,
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
    format,
    dispatch,
    children,
  ]);

  if (disableSearch) {
    return <HeaderRender title={title} path={path} disableSort={disableSort} />;
  }
  return (
    <HeaderRender title={title} path={path} disableSort={disableSort}>
      <div>
        <Select
          hiddenLabel
          className="mb-2"
          options={[
            {
              label: OPERATOR_LABEL[DateOperators.BETWEEN],
              value: DateOperators.BETWEEN,
            },
            {
              label: OPERATOR_LABEL[DateOperators.LESS],
              value: DateOperators.LESS,
            },
            {
              label: OPERATOR_LABEL[DateOperators.GREATER],
              value: DateOperators.GREATER,
            },
          ]}
          selected={{ value: operator, label: OPERATOR_LABEL[operator] }}
          onSelect={(selected?: { label: string; value: DateOperators }) => {
            setOperator(selected?.value ?? DateOperators.BETWEEN);
          }}
        />
        <DatePicker
          selectsRange={false}
          showPopperArrow={false}
          selected={value}
          inline
          className="max-w-10"
          onChange={(date: Date | null) => handleChange(date, operator)}
        />
      </div>
    </HeaderRender>
  );
}
