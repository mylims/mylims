import React, { ReactNode } from 'react';

import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { boundariesFromPage } from '@/components/TableQuery/utils';
import { Badge, BadgeVariant, Color } from '@/components/tailwind-ui';
import {
  Sample,
  SampleSortField,
  SortDirection,
  useSamplesFilteredQuery,
} from '@/generated/graphql';

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
          const sampleCode = (row as Sample).sampleCode;
          if (!sampleCode || sampleCode.length === 0) return '-';

          return sampleCode.join('_');
        }}
      </TableQuery.TextColumn>
      <TableQuery.TextColumn
        title="username"
        dataPath="user.usernames"
        disableSort
        disableSearch
      >
        {(row) => {
          const usernames = (row as Sample).user?.usernames;
          if (!usernames || usernames.length === 0) return '-';
          return usernames[0];
        }}
      </TableQuery.TextColumn>
      <TableQuery.TextColumn title="Labels" dataPath="labels" disableSort>
        {(row) => {
          const labels = (row as Sample).labels;
          if (!labels || labels.length === 0) return '-';

          return labels.map((label) => (
            <Badge
              key={`${row.id}-${label}`}
              variant={BadgeVariant.COLORED_BACKGROUND}
              label={label}
              color={Color.primary}
            />
          ));
        }}
      </TableQuery.TextColumn>
      <TableQuery.TextColumn title="Project" dataPath="project" disableSort />
      <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
      {children}
    </TableQuery>
  );
}
