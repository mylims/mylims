import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid';
import React from 'react';

import { SortDirection } from '@/generated/graphql';

import { useTableQueryContext } from '../hooks/useTableQueryContext';

interface SortIconProps {
  disableSort: boolean;
  path: string;
}

export default function SortIcon({ disableSort, path }: SortIconProps) {
  const { query, submitQuery } = useTableQueryContext();
  if (disableSort) return null;

  const { 'sortBy.field': sortField, 'sortBy.direction': sortDirection } =
    query;
  if (sortField !== path) {
    return (
      <SortDescendingIcon
        className="h-5 w-5 flex-none text-neutral-400"
        onClick={() => {
          submitQuery({
            ...query,
            'sortBy.field': path,
            'sortBy.direction': SortDirection.DESC,
          });
        }}
      />
    );
  }

  if (sortDirection === SortDirection.DESC) {
    return (
      <SortDescendingIcon
        className="h-5 w-5 flex-none text-primary-600"
        onClick={() => {
          submitQuery({
            ...query,
            'sortBy.field': sortField,
            'sortBy.direction': SortDirection.ASC,
          });
        }}
      />
    );
  }

  return (
    <SortAscendingIcon
      className="h-5 w-5 flex-none text-primary-600"
      onClick={() => {
        submitQuery({
          ...query,
          'sortBy.field': sortField,
          'sortBy.direction': SortDirection.DESC,
        });
      }}
    />
  );
}
