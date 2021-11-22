import React from 'react';

import { TableState } from '../types';

interface RowRenderProps<T> {
  row: T;
  columns: TableState;
}

export default function RowRender<T extends Record<string, unknown>>({
  row,
  columns,
}: RowRenderProps<T>) {
  return (
    <tr className={`grid grid-cols-${columns.length} gap-4`}>
      {columns.map((column, index) => {
        let content = column.value.render(row);
        let title: string | undefined;
        if (typeof content === 'string') title = content;

        return (
          <td
            key={`${column.value.dataPath}-${index}`}
            className="px-4 py-3 my-auto text-sm font-semibold truncate whitespace-nowrap text-neutral-900"
            title={title}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
