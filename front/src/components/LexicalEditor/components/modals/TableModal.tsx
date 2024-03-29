import React from 'react';

import { Input } from '@/components/tailwind-ui';

import { useInsertModalContext } from '../InsertOptionsMenu';

export function TableModal() {
  const { state, setState } = useInsertModalContext();
  const { rows, columns } =
    (state as Record<'rows' | 'columns', string> | null) ?? {};
  return (
    <div className="min-w-1/4 m-2 min-h-[200px]">
      <Input
        label="Rows"
        name="rows"
        value={rows ?? ''}
        onChange={(event) => setState({ columns, rows: event.target.value })}
      />
      <Input
        label="Columns"
        name="columns"
        value={columns ?? ''}
        onChange={(event) => setState({ rows, columns: event.target.value })}
      />
    </div>
  );
}
