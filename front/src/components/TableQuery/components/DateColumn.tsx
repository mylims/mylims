import { format as dateFormat } from 'date-fns';
import objectPath from 'object-path';
import React, { useEffect } from 'react';
import DatePicker from 'react-datepicker';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind, DateColumnProps } from '../types';

import HeaderRender from './HeaderRender';

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
  const value = objectPath(query).get(path, '');

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

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { dataPath } });
  }, [
    dataPath,
    path,
    disableSearch,
    disableSort,
    nullable,
    index,
    format,
    dispatch,
    children,
  ]);

  if (disableSearch) return <HeaderRender title={title} path={path} />;
  return (
    <HeaderRender title={title} path={path}>
      {() => (
        <DatePicker
          selectsRange={false}
          showPopperArrow={false}
          selected={value ? new Date(value) : null}
          inline
          className="max-w-10"
          onChange={(value: Date | null) => {
            submitQuery({
              ...query,
              [path]: value?.toISOString() ?? '',
              page: '1',
            });
          }}
        />
      )}
    </HeaderRender>
  );
}
