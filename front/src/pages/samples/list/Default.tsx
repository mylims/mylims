import { unflatten } from 'flat';
import React, { ReactNode } from 'react';

import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { QueryType, Unflatten } from '@/components/TableQuery/types';
import { boundariesFromPage } from '@/components/TableQuery/utils';
import { Badge, BadgeVariant, Color } from '@/components/tailwind-ui';
import {
  FilterList,
  InputMaybe,
  Sample,
  SampleFilterInput,
  SampleSortField,
  SampleSortInput,
  SortDirection,
  useSamplesFilteredQuery,
} from '@/generated/graphql';

const PAGE_SIZE = 10;

interface SamplesListProps {
  kind: string;
  levels: string[];
  children: ReactNode;
}
export default function SamplesList({
  kind,
  levels,
  children,
}: SamplesListProps) {
  const { query, setQuery } = useTableQuery({
    page: '1',
    'sortBy.field': SampleSortField.CREATEDAT,
    'sortBy.direction': SortDirection.DESC,
  });
  const { page, sortBy, sampleCode, ...filter } = unflatten<
    QueryType,
    Unflatten<SampleFilterInput, SampleSortInput>
  >(query);
  const { skip, limit } = boundariesFromPage(page);
  const { loading, error, data } = useSamplesFilteredQuery({
    variables: {
      kind,
      skip,
      limit,
      filterBy: {
        ...filter,
        sampleCode: sampleCode
          ?.filter((val) => !!val)
          .map((val) => ({
            ...val,
            // @ts-expect-error The type of the value is string
            index: val.index ? parseInt(val.index as string, 10) : null,
          })) as InputMaybe<FilterList[]> | undefined,
      },
      sortBy,
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
      {levels.map((level, index) => (
        <TableQuery.TextListColumn
          key={level}
          title={`${level} name`}
          dataPath="sampleCode"
          queryIndex={index}
          disableSort
        >
          {(row) => {
            const { sampleCode } = row as Sample;
            return sampleCode[index] ?? '-';
          }}
        </TableQuery.TextListColumn>
      ))}
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
          const { labels, id } = row as Sample;
          if (!labels || labels.length === 0) return '-';

          return labels.map((label) => (
            <Badge
              key={`${id}-${label}`}
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
