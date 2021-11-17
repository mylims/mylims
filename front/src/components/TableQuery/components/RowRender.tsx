import React, { ReactNode } from 'react';
import numeral from 'numeral';
import { format } from 'date-fns';

import { ColumnKind, TableState } from '../types';

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
        let content: ReactNode;
        switch (column.kind) {
          case ColumnKind.TEXT: {
            content = row[column.value.fieldPath] as string;
            break;
          }
          case ColumnKind.NUMBER: {
            content = numeral(row[column.value.fieldPath] as number).format(
              column.value.format,
            );
            break;
          }
          case ColumnKind.DATE: {
            content = format(
              new Date(row[column.value.fieldPath] as string),
              column.value.format,
            );
            break;
          }
          default: {
            throw new Error(`Unknown column kind ${(column as any).kind}`);
          }
        }
        return (
          <td
            key={`${column.value.fieldPath}-${index}`}
            className="px-4 py-3 text-sm font-semibold whitespace-nowrap text-neutral-900"
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
