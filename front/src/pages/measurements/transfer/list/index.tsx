import { unflatten } from 'flat';
import React from 'react';


import ElnLayout from '@/components/ElnLayout';
import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { QueryType, Unflatten } from '@/components/TableQuery/types';
import { boundariesFromPage } from '@/components/TableQuery/utils';
import { Select } from '@/components/tailwind-ui';
import {
  MeasurementFilterInput,
  MeasurementsFilteredQuery,
  MeasurementSortField,
  MeasurementSortInput,
  MeasurementTypes,
  SortDirection,
  useMeasurementsFilteredQuery,
} from '@/generated/graphql';

import MeasurementActions from './MeasurementActions';
import { MeasurementPlot } from './MeasurementPlot';

type MeasurementRowType =
  MeasurementsFilteredQuery['measurements']['list'][number];
type DestructuredQuery = Unflatten<
  MeasurementFilterInput,
  MeasurementSortInput
> & {
  type: MeasurementTypes;
};
export default function MeasurementsList() {
  const { query, setQuery } = useTableQuery({
    page: '1',
    'sortBy.field': MeasurementSortField.CREATEDAT,
    'sortBy.direction': SortDirection.DESC,
  });
  const { page, type, sortBy, ...filter } = unflatten<
    QueryType,
    DestructuredQuery
  >(query);
  const measurementType = (query.type ??
    MeasurementTypes.TRANSFER) as MeasurementTypes;
  const { skip, limit } = boundariesFromPage(page);
  const { loading, error, data } = useMeasurementsFilteredQuery({
    variables: {
      type: measurementType,
      skip,
      limit,
      filterBy: filter,
      sortBy,
    },
  });

  return (
    <div>
      <Select
        className="mb-4 w-60"
        options={[
          {
            value: MeasurementTypes.TRANSFER,
            label: MeasurementTypes.TRANSFER,
          },
        ]}
        selected={{ value: measurementType, label: measurementType }}
        onSelect={(
          selected: Record<'value' | 'label', MeasurementTypes> | undefined,
        ) => {
          setQuery({
            ...query,
            type: selected?.value ?? MeasurementTypes.TRANSFER,
          });
        }}
        label="Measurement type"
      />
      <MeasurementPlot query={query} type={measurementType}>
        <TableQuery
          data={data?.measurements}
          loading={loading}
          error={error}
          query={query}
          onQueryChange={(query) => setQuery(query)}
        >
          <TableQuery.Queries />
          <TableQuery.TextColumn
            title="Sample"
            dataPath="sampleCode"
            disableSort
          />
          <TableQuery.DateColumn title="Creation date" dataPath="createdAt" />
          <TableQuery.TextColumn title="Username" dataPath="username" />
          <TableQuery.ActionsColumn>
            {(row) => {
              const { file, id, type } = row as MeasurementRowType;
              const fileUrl = file?.downloadUrl;
              return (
                <MeasurementActions id={id} type={type} fileUrl={fileUrl} />
              );
            }}
          </TableQuery.ActionsColumn>
        </TableQuery>
      </MeasurementPlot>
    </div>
  );
}

MeasurementsList.getLayout = (page: React.ReactNode) => (
  <ElnLayout>{page}</ElnLayout>
);
