import React, { Reducer, useMemo, useReducer } from 'react';
import { produce } from 'immer';

import { Input, Spinner } from '@/components/tailwind-ui';

import type { ReducerActions, TableQueryProps, TableState } from './types';

import { reducer } from './reducer';
import { splitChildren } from './utils';

import { TableQueryContext } from './hooks/useTableQueryContext';
import NumberColumn from './components/NumberColumn';
import RowRender from './components/RowRender';
import TextColumn from './components/TextColumn';
import DateColumn from './components/DateColumn';

const reducerCurr: Reducer<TableState, ReducerActions> = produce(reducer);

export function Table<T extends Record<string, unknown>>({
  data,
  loading,
  pagination,
  onQueryChange,
  children,
}: TableQueryProps<T>) {
  const [state, dispatch] = useReducer(reducerCurr, [], undefined);
  const { columns } = useMemo(() => splitChildren(children), [children]);
  const { list = [] } = data ?? {};
  const orderedColumns = useMemo(() => {
    return produce(state, (copy) => copy.sort((a, b) => a.index - b.index));
  }, [state]);
  return (
    <TableQueryContext.Provider value={{ columnsContext: {}, dispatch }}>
      <div className="inline-block overflow-hidden align-middle border-b shadow border-neutral-200 sm:rounded-lg">
        <table className="divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr className={`grid grid-cols-${columns.length} gap-4`}>
              {columns}
            </tr>
            <tr className={`grid grid-cols-${columns.length} gap-4`}>
              <Input name="test" label="" />
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
      </div>
    </TableQueryContext.Provider>
  );
}

Table.DateColumn = DateColumn;
Table.NumberColumn = NumberColumn;
Table.TextColumn = TextColumn;
