import { clsx } from 'clsx';
import React from 'react';

import { ColumnKind, TableState } from '../types';

interface RowRenderProps<T> {
  row: T;
  columns: TableState;
  columnsTemplate: string;
}

export default function RowRender<T extends Record<string, unknown>>({
  row,
  columns,
  columnsTemplate,
}: RowRenderProps<T>) {
  return (
    <tr className="grid gap-4" style={{ gridTemplateColumns: columnsTemplate }}>
      {columns.map((column, index) => {
        let content = column.value.render(row);
        let title: string | undefined;
        if (typeof content === 'string') title = content;

        return (
          <td
            // eslint-disable-next-line react/no-array-index-key
            key={`${column.value.dataPath}-${index}`}
            className={clsx(
              'self-center whitespace-nowrap px-4 py-3 text-sm font-semibold text-neutral-900',
              column.kind === ColumnKind.ACTIONS ? 'w-min' : 'truncate',
            )}
            title={title}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
