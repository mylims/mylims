import { ApolloError } from '@apollo/client';
import { InboxIcon } from '@heroicons/react/solid';
import { produce } from 'immer';
import React, {
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import Queries from './components/QueryPreview';
import ActionsColumn from './components/ActionsColumn';
import DateColumn from './components/DateColumn';
import MultiSelectColumn from './components/MultiSelectColumn';
import NumberColumn from './components/NumberColumn';
import RowRender from './components/RowRender';
import TextColumn from './components/TextColumn';
import { TableQueryContext } from './hooks/useTableQueryContext';
import { reducer } from './reducer';
import type {
  QueryType,
  ReducerActions,
  TableQueryProps,
  TableState,
} from './types';
import { PAGE_SIZE, splitChildren } from './utils';

import {
  Alert,
  AlertType,
  Pagination,
  Spinner,
} from '@/components/tailwind-ui';

interface TableBodyProps<T> {
  list: Array<T>;
  columns: TableState;
  loading?: boolean;
  error?: ApolloError;
}

const reducerCurr: Reducer<TableState, ReducerActions> = produce(reducer);

export function Table<T extends Record<string, unknown>>({
  data,
  loading,
  error,
  query: originalQuery,
  itemsPerPage = PAGE_SIZE,
  onQueryChange: submitQuery,
  children,
}: TableQueryProps<T>) {
  const [state, dispatch] = useReducer(reducerCurr, [], undefined);
  const [query, setQuery] = useState<QueryType>(originalQuery);
  useEffect(() => {
    setQuery(originalQuery);
  }, [originalQuery]);

  const { columns, queries } = useMemo(
    () => splitChildren(children),
    [children],
  );
  const orderedColumns = useMemo(() => {
    return produce(state, (copy) => copy.sort((a, b) => a.index - b.index));
  }, [state]);

  const { list = [], totalCount = 0 } = data ?? {};
  const page = parseInt(query.page, 10) ?? 1;

  return (
    <TableQueryContext.Provider
      value={{ query, setQuery, submitQuery, dispatch }}
    >
      {queries}
      <div className="inline-block align-middle border-b shadow border-neutral-200 sm:rounded-lg">
        <table className="divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr className={`grid grid-cols-${columns.length} gap-4`}>
              {columns}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            <TableBody
              list={list}
              columns={orderedColumns}
              loading={loading}
              error={error}
            />
          </tbody>
        </table>
        <Pagination
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          page={page}
          onPageChange={(page) => submitQuery({ ...query, page: `${page}` })}
        />
      </div>
    </TableQueryContext.Provider>
  );
}

function TableBody<T extends Record<string, unknown>>({
  error,
  loading,
  list,
  columns,
}: TableBodyProps<T>) {
  if (error) {
    return (
      <Alert title="Error from server" type={AlertType.ERROR}>
        {error.message}
      </Alert>
    );
  }
  if (loading) {
    return (
      <tr>
        <td>
          <div className="flex flex-row justify-center py-4">
            <Spinner className="w-10 h-10 text-danger-500" />
          </div>
        </td>
      </tr>
    );
  }
  if (list.length === 0) {
    return (
      <tr>
        <td>
          <div className="flex flex-row justify-center py-4 text-neutral-500">
            <InboxIcon className="w-5 h-5 mr-2" />
            <span>Empty</span>
          </div>
        </td>
      </tr>
    );
  }
  return (
    <>
      {list.map((row, index) => (
        <RowRender key={`table-row-${index}`} row={row} columns={columns} />
      ))}
    </>
  );
}

Table.Queries = Queries;
Table.DateColumn = DateColumn;
Table.NumberColumn = NumberColumn;
Table.TextColumn = TextColumn;
Table.MultiSelectColumn = MultiSelectColumn;
Table.ActionsColumn = ActionsColumn;
