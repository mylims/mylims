import React, { ReactNode } from 'react';

import { Table as TableQuery } from '@/components/TableQuery';
import { boundariesFromPage } from '@/components/TableQuery/utils';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import {
  SampleSortField,
  SortDirection,
  useSamplesFilteredQuery,
} from '@/generated/graphql';
import { Badge, BadgeVariant, Color } from '@/components/tailwind-ui';

const PAGE_SIZE = 10;

interface SamplesListProps {
  kind: string;
  children: ReactNode;
}
export default function SamplesList({ kind, children }: SamplesListProps) {
  const { query, setQuery } = useTableQuery({
    page: '1',
    sortField: SampleSortField.CREATEDAT,
    sortDirection: SortDirection.DESC,
  });
  const { page, sortField, sortDirection, ...filter } = query;
  const { skip, limit } = boundariesFromPage(page);
  const { loading, error, data } = useSamplesFilteredQuery({
    variables: {
      kind,
      skip,
      limit,
      filterBy: filter,
      sortBy: {
        direction: sortDirection as SortDirection,
        field: sortField as SampleSortField,
      },
    },
  });

  return (
    <TableQuery
      data={data?.samples}
      loading={loading}
      error={error}
      itemsPerPage={PAGE_SIZE}
      query={query}
      onQueryChange={(query) => setQuery(query)}
    >
      <TableQuery.Queries />
      <TableQuery.TextColumn title="name" dataPath="sampleCode" disableSort>
        {(row) => {
          const sampleCode = row.sampleCode as string[];
          if (!sampleCode || sampleCode.length === 0) return '-';

          return sampleCode.join('_');
        }}
      </TableQuery.TextColumn>
      <TableQuery.TextColumn title="Labels" dataPath="labels">
        {(row) => {
          const labels = row.labels as string[];
          if (!labels || labels.length === 0) return '-';

          return labels.map((label) => (
            <Badge
              variant={BadgeVariant.COLORED_BACKGROUND}
              label={label}
              color={Color.primary}
            />
          ));
        }}
      </TableQuery.TextColumn>
      <TableQuery.TextColumn title="Project" dataPath="project" />
      <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
      {children}
    </TableQuery>
  );
}
