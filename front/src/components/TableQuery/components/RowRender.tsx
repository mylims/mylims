import React, { ReactNode } from 'react';
import numeral from 'numeral';
import { format } from 'date-fns';
import objectPath from 'object-path';

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
        let title: string | undefined;

        const model = objectPath(row);
        if (
          !model.has(column.value.dataPath) &&
          column.value.dataPath !== ColumnKind.ACTIONS
        ) {
          console.error(
            `Column ${column.value.dataPath} doesn't exists on ${JSON.stringify(
              row,
            )}`,
          );
          content = '-';
        } else {
          const value = model.get(column.value.dataPath);
          switch (column.kind) {
            case ColumnKind.TEXT: {
              content = value as string;
              title = value as string;
              break;
            }
            case ColumnKind.NUMBER: {
              title = numeral(value as number).format(column.value.format);
              content = title;
              break;
            }
            case ColumnKind.DATE: {
              title = format(new Date(value as string), column.value.format);
              content = title;
              break;
            }
            case ColumnKind.ACTIONS: {
              content = column.value.render(row);
              break;
            }
            default: {
              throw new Error(`Unknown column kind ${(column as any).kind}`);
            }
          }
        }
        return (
          <td
            key={`${column.value.dataPath}-${index}`}
            className="px-4 py-3 text-sm font-semibold truncate whitespace-nowrap text-neutral-900"
            title={title}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}
