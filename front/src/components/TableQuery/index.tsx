import React, {
  Reducer,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { produce } from 'immer';

import { Pagination, Spinner } from '@/components/tailwind-ui';

import type {
  QueryType,
  ReducerActions,
  TableQueryProps,
  TableState,
} from './types';

import { reducer } from './reducer';
import { splitChildren } from './utils';

import { TableQueryContext } from './hooks/useTableQueryContext';
import NumberColumn from './components/NumberColumn';
import RowRender from './components/RowRender';
import TextColumn from './components/TextColumn';
import DateColumn from './components/DateColumn';
import ActionsColumn from './components/ActionsColumn';
import MultiSelectColumn from './components/MultiSelectColumn';

const reducerCurr: Reducer<TableState, ReducerActions> = produce(reducer);

export function Table<T extends Record<string, unknown>>({
  data,
  loading,
  query: originalQuery,
  itemsPerPage = 10,
  onQueryChange: submitQuery,
  children,
}: TableQueryProps<T>) {
  const [state, dispatch] = useReducer(reducerCurr, [], undefined);
  const [query, setQuery] = useState<QueryType>(originalQuery);
  useEffect(() => {
    setQuery(originalQuery);
  }, [originalQuery]);

  const { columns } = useMemo(() => splitChildren(children), [children]);
  const orderedColumns = useMemo(() => {
    return produce(state, (copy) => copy.sort((a, b) => a.index - b.index));
  }, [state]);

  const { list = [], totalCount = 0 } = data ?? {};
  const page = parseInt(query.page, 10) ?? 1;

  return (
    <TableQueryContext.Provider
      value={{ query, setQuery, submitQuery, dispatch }}
    >
      <div className="inline-block overflow-hidden align-middle border-b shadow border-neutral-200 sm:rounded-lg">
        <table className="divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr className={`grid grid-cols-${columns.length} gap-4`}>
              {columns}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {loading ? (
              <tr>
                <td>
                  <Spinner className="w-10 h-10 text-danger-500" />
                </td>
              </tr>
            ) : (
              list.map((row, index) => (
                <RowRender
                  key={`table-row-${index}`}
                  row={row}
                  columns={orderedColumns}
                />
              ))
            )}
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

Table.DateColumn = DateColumn;
Table.NumberColumn = NumberColumn;
Table.TextColumn = TextColumn;
Table.MultiSelectColumn = MultiSelectColumn;
Table.ActionsColumn = ActionsColumn;
