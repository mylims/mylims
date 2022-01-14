import { format } from 'date-fns';
import { unflatten } from 'flat';
import { produce } from 'immer';
import React, { useMemo } from 'react';

import { ColumnKind, QueryType } from '@/components/TableQuery/types';
import {
  Button,
  Variant,
  Color,
  Badge,
  BadgeVariant,
  Size,
} from '@/components/tailwind-ui';

import { useTableQueryContext } from '../hooks/useTableQueryContext';

export default function Queries() {
  const { columns, query, submitQuery } = useTableQueryContext();
  const queries = useMemo(() => {
    const { sortBy, page, ...values } = unflatten<
      QueryType,
      Record<string, Record<string, unknown> | Record<string, unknown>[]>
    >(query);

    let queries: Record<string, Record<'title' | 'value', string>> = {};

    for (const key of Object.keys(values)) {
      const value = values[key];

      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          if (value[index]) {
            const columnValue = columns.find((column) => {
              if (column.kind === ColumnKind.ACTIONS) return false;
              const path = column.value.queryPath ?? column.value.dataPath;

              return (
                path === key &&
                column.kind === ColumnKind.TEXT_LIST &&
                column.value.queryIndex === index
              );
            });
            queries[`${key}.${index}`] = {
              title: columnValue?.title ?? key,
              value: (value[index].value as Record<string, string>).value,
            };
          }
        }
      } else {
        const columnValue = columns.find((column) => {
          if (column.kind === ColumnKind.ACTIONS) return false;
          return key === column.value.queryPath ?? column.value.dataPath;
        });
        let content;
        switch (columnValue?.kind) {
          case ColumnKind.DATE: {
            content = [value.from, value.to]
              .filter((val) => !!val)
              .map((val) => format(new Date(val as string), 'dd.MM.yyyy HH:mm'))
              .join(' - ');
            break;
          }
          case ColumnKind.MULTI_SELECT: {
            content = JSON.stringify(value);
            break;
          }
          default: {
            content = value.value as string;
            break;
          }
        }
        queries[key] = { title: columnValue?.title ?? key, value: content };
      }
    }

    return queries;
  }, [query, columns]);

  if (Object.keys(queries).length === 0) return <div className="h-12" />;

  return (
    <div className="flex mb-4">
      <Button
        variant={Variant.secondary}
        color={Color.danger}
        size={Size.xSmall}
        onClick={() => {
          const {
            'sortBy.direction': sortDirection,
            'sortBy.field': sortField,
          } = query;
          submitQuery({
            page: '1',
            'sortBy.direction': sortDirection,
            'sortBy.field': sortField,
          });
        }}
      >
        Remove filters
      </Button>
      <div className="flex p-2 ml-3 space-x-3 bg-white rounded-lg shadow">
        {Object.keys(queries).map((key) => (
          <span key={key}>
            <span className="text-xs font-semibold uppercase text-neutral-500">
              {`${queries[key].title}: `}
            </span>
            <Badge
              label={queries[key].value}
              variant={BadgeVariant.COLORED_BACKGROUND}
              color={Color.primary}
              dot={false}
              onDismiss={() => {
                const newQuery = produce(query, (draft) => {
                  for (const queryKey of Object.keys(draft)) {
                    if (queryKey.startsWith(key)) {
                      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                      delete draft[queryKey];
                    }
                  }
                });
                submitQuery(newQuery);
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
