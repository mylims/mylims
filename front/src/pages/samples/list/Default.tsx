import React, { ReactNode } from 'react';

import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { Unflatten } from '@/components/TableQuery/types';
import {
  getVariablesFromQuery,
  PAGE_SIZE,
} from '@/components/TableQuery/utils';
import { Badge, BadgeVariant, Color } from '@/components/tailwind-ui';
import {
  FilterList,
  FilterMetaText,
  InputMaybe,
  Sample,
  SampleFilterInput,
  SampleSortField,
  SampleSortInput,
  SortDirection,
  useSamplesFilteredQuery,
} from '@/generated/graphql';

interface SamplesListProps {
  kind: string;
  levels: string[];
  action: ReactNode;
  children: ReactNode;
}
export default function SamplesList({
  kind,
  levels,
  action,
  children,
}: SamplesListProps) {
  const { query, setQuery } = useTableQuery({
    page: '1',
    'sortBy.field': SampleSortField.CREATEDAT,
    'sortBy.direction': SortDirection.DESC,
  });
  const {
    filterBy: { sampleCode, ...filter },
    ...variables
  } =
    getVariablesFromQuery<
      Unflatten<SampleFilterInput, SampleSortInput, FilterMetaText>
    >(query);
  const { loading, error, data } = useSamplesFilteredQuery({
    variables: {
      kind,
      ...variables,
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
      {action}
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
      <TableQuery.UserColumn title="user" dataPath="user" disableSort />
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
      <TableQuery.TextColumn title="Comment" dataPath="comment" disableSort />
      <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
      {children}
    </TableQuery>
  );
}
