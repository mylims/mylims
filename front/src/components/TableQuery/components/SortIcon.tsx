import {
  ArrowDown20Filled,
  ArrowSort20Filled,
  ArrowUp20Filled,
} from '@fluentui/react-icons';
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
      <ArrowSort20Filled
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
      <ArrowDown20Filled
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
    <ArrowUp20Filled
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
