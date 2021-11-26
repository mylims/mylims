import React from 'react';
import { Link } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { Button, Color, Roundness, Variant } from '@/components/tailwind-ui';
import {
  SampleSortField,
  SortDirection,
  useSamplesFilteredQuery,
} from '@/generated/graphql';
import { InformationCircleIcon } from '@heroicons/react/outline';

const PAGE_SIZE = 10;

export default function SamplesList() {
  const { query, setQuery } = useTableQuery({
    page: '1',
    sortField: SampleSortField.CREATEDAT,
    sortDirection: SortDirection.DESC,
  });
  const { page, sortField, sortDirection, ...filter } = query;
  const pageNum = query.page !== null ? parseInt(query.page, 10) : 1;
  const { loading, error, data } = useSamplesFilteredQuery({
    variables: {
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: filter,
      sortBy: {
        direction: sortDirection as SortDirection,
        field: sortField as SampleSortField,
      },
    },
  });

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <Link to="/measurement/list">
          <Button variant={Variant.secondary} color={Color.danger}>
            Remove filters
          </Button>
        </Link>
      </div>
      <TableQuery
        data={data?.samples}
        loading={loading}
        error={error}
        itemsPerPage={PAGE_SIZE}
        query={query}
        onQueryChange={(query) => setQuery(query)}
      >
        <TableQuery.TextColumn
          title="Sample code"
          dataPath="sampleCode"
          disableSort
        />
        <TableQuery.TextColumn title="Title" dataPath="title" />
        <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
        <TableQuery.ActionsColumn>
          {(row) => (
            <Link title="detail" to={`/sample/detail/${row.id}`}>
              <Button
                color={Color.primary}
                roundness={Roundness.circular}
                variant={Variant.secondary}
                className="ml-2"
              >
                <InformationCircleIcon className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </TableQuery.ActionsColumn>
      </TableQuery>
    </div>
  );
}

SamplesList.getLayout = (page: React.ReactNode) => (
  <ElnLayout>{page}</ElnLayout>
);
