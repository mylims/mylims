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
        className="flex-none w-5 h-5 text-neutral-400"
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
        className="flex-none w-5 h-5 text-primary-600"
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
      className="flex-none w-5 h-5 text-primary-600"
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
