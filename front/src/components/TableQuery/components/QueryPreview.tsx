import { produce } from 'immer';
import React, { useMemo } from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';

import {
  Button,
  Variant,
  Color,
  Badge,
  BadgeVariant,
} from '@/components/tailwind-ui';

export default function Queries() {
  const { query, submitQuery } = useTableQueryContext();
  const queries = useMemo(() => {
    let values: Record<'key' | 'value', string>[] = [];
    for (const key in query) {
      const value = query[key];
      if (!['page', 'sortField', 'sortDirection'].includes(key) && value) {
        values.push({ key, value });
      }
    }
    return values;
  }, [query]);
  return (
    <div className="flex mb-4">
      <Button
        variant={Variant.secondary}
        color={Color.danger}
        onClick={() => {
          const { sortField, sortDirection } = query;
          submitQuery({ page: '1', sortField, sortDirection });
        }}
      >
        Remove filters
      </Button>
      <div className="flex p-2 ml-3 space-x-3 bg-white rounded-lg shadow">
        {queries.length === 0 && (
          <span className="text-sm text-neutral-500">Empty query</span>
        )}
        {queries.map(({ key, value }) => (
          <span key={key}>
            <span className="text-xs font-semibold uppercase text-neutral-500">{`${key}: `}</span>
            <Badge
              label={value}
              variant={BadgeVariant.COLORED_BACKGROUND}
              color={Color.primary}
              dot={false}
              onDismiss={() => {
                const newQuery = produce(query, (draft) => {
                  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                  delete draft[key];
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
