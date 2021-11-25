import React from 'react';
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { SortDirection } from '@/generated/graphql';

interface SortIconProps {
  disableSort: boolean;
  path: string;
}

export default function SortIcon({ disableSort, path }: SortIconProps) {
  const { query, submitQuery } = useTableQueryContext();
  console.log({ disableSort, path });
  if (disableSort) return null;

  const { sortField, sortDirection } = query;
  if (sortField !== path) {
    return (
      <SortDescendingIcon
        className="flex-none w-5 h-5 text-neutral-400"
        onClick={() => {
          submitQuery({
            ...query,
            sortField: path,
            sortDirection: SortDirection.DESC,
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
            sortField,
            sortDirection: SortDirection.ASC,
          });
        }}
      />
    );
  }

  return (
    <SortAscendingIcon
      className="flex-none w-5 h-5 text-primary-600"
      onClick={() => {
        submitQuery({ ...query, sortField, sortDirection: SortDirection.DESC });
      }}
    />
  );
}
