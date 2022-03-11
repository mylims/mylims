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

type JsonObject = Record<string, unknown>;
export default function Queries() {
  const { columns, query, submitQuery } = useTableQueryContext();
  const queries = useMemo(() => {
    const { sortBy, page, meta, ...otherValues } = unflatten<
      QueryType,
      Record<string, JsonObject | JsonObject[]>
    >(query);

    let queries: Record<string, Record<'title' | 'value', string>> = {};

    const values = {
      ...otherValues,
      ...(meta as Record<string, JsonObject>),
    };
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
    <div className="mb-4 flex">
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
      <div className="ml-3 flex space-x-3 rounded-lg bg-white p-2 shadow">
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
                    const path = queryKey.split('.');
                    if (
                      path[0] === 'meta' ? path[1] === key : path[0] === key
                    ) {
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
