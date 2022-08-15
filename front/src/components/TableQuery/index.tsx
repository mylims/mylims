import { ApolloError } from '@apollo/client';
import { InboxIcon } from '@heroicons/react/solid';
import { produce } from 'immer';
import React, {
  Reducer,
  useRef,
  useMemo,
  useState,
  useEffect,
  useReducer,
} from 'react';

import UserColumn from '@/components/TableQuery/components/UserColumn';
import {
  Alert,
  AlertType,
  Pagination,
  Spinner,
} from '@/components/tailwind-ui';

import ActionsColumn from './components/ActionsColumn';
import DateColumn from './components/DateColumn';
import MultiSelectColumn from './components/MultiSelectColumn';
import NumberColumn from './components/NumberColumn';
import Queries from './components/QueryPreview';
import RowRender from './components/RowRender';
import TextColumn from './components/TextColumn';
import TextListColumn from './components/TextListColumn';
import TextMetaColumn from './components/TextMetaColumn';
import { TableQueryContext } from './hooks/useTableQueryContext';
import { reducer } from './reducer';
import {
  QueryType,
  ColumnKind,
  TableState,
  ReducerActions,
  TableQueryProps,
} from './types';
import { PAGE_SIZE, splitChildren } from './utils';

interface TableBodyProps<T> {
  list: Array<T>;
  columns: TableState;
  columnsTemplate: string;
  loading?: boolean;
  error?: ApolloError;
}

const reducerCurr: Reducer<TableState, ReducerActions> = produce(reducer);

export function Table<T extends Record<string, unknown>>({
  data,
  error,
  loading,
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

  // Calculates the grid sizes for the child columns
  const headerRef = useRef<HTMLTableRowElement>(null);
  const columnsTemplate = useMemo(() => {
    const widths = Array.from(headerRef.current?.children ?? []).map(
      (el) => (el as HTMLElement).offsetWidth,
    );
    let columnsTemplate = '';
    for (let i = 0; i < orderedColumns.length; i++) {
      let width = widths[i];
      if (orderedColumns[i].kind === ColumnKind.ACTIONS) {
        width = orderedColumns[i]?.width || width;
      }
      columnsTemplate += `${width}px `;
    }
    return columnsTemplate;
  }, [headerRef, orderedColumns]);

  const { list = [], totalCount = 0 } = data ?? {};
  const page = parseInt(query.page, 10) ?? 1;

  return (
    <TableQueryContext.Provider
      value={{ columns: state, query, setQuery, submitQuery, dispatch }}
    >
      {queries}
      <div className="border-b border-neutral-200 shadow sm:rounded-lg">
        <div className="overflow-x-auto overflow-y-visible align-middle ">
          <table className="w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr
                className="grid auto-cols-max grid-flow-col gap-4"
                ref={headerRef}
              >
                {columns}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              <TableBody
                list={list}
                columns={orderedColumns}
                columnsTemplate={columnsTemplate}
                loading={loading}
                error={error}
              />
            </tbody>
          </table>
        </div>
        <Pagination
          className="mb-2"
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
  list,
  error,
  loading,
  columns,
  columnsTemplate,
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
            <Spinner className="h-10 w-10 text-danger-500" />
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
            <InboxIcon className="mr-2 h-5 w-5" />
            <span>Empty</span>
          </div>
        </td>
      </tr>
    );
  }
  return (
    <>
      {list.map((row, index) => (
        <RowRender
          row={row}
          columns={columns}
          // eslint-disable-next-line react/no-array-index-key
          key={`table-row-${index}`}
          columnsTemplate={columnsTemplate}
        />
      ))}
    </>
  );
}

Table.Queries = Queries;
Table.DateColumn = DateColumn;
Table.NumberColumn = NumberColumn;
Table.TextColumn = TextColumn;
Table.TextListColumn = TextListColumn;
Table.TextMetaColumn = TextMetaColumn;
Table.MultiSelectColumn = MultiSelectColumn;
Table.UserColumn = UserColumn;
Table.ActionsColumn = ActionsColumn;
