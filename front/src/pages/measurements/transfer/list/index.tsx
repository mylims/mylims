import React from 'react';

import MeasurementActions from './MeasurementActions';
import { MeasurementPlot } from './MeasurementPlot';

import ElnLayout from '@/components/ElnLayout';
import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { boundariesFromPage } from '@/components/TableQuery/utils';
import { Select } from '@/components/tailwind-ui';
import {
  MeasurementsFilteredQuery,
  MeasurementSortField,
  MeasurementTypes,
  SortDirection,
  useMeasurementsFilteredQuery,
} from '@/generated/graphql';

type MeasurementRowType =
  MeasurementsFilteredQuery['measurements']['list'][number];

export default function MeasurementsList() {
  const { query, setQuery } = useTableQuery({
    page: '1',
    sortField: MeasurementSortField.CREATEDAT,
    sortDirection: SortDirection.DESC,
  });
  const { page, type, sortField, sortDirection, ...filter } = query;
  const measurementType = (query.type ??
    MeasurementTypes.TRANSFER) as MeasurementTypes;
  const { skip, limit } = boundariesFromPage(page);
  const { loading, error, data } = useMeasurementsFilteredQuery({
    variables: {
      type: measurementType,
      skip,
      limit,
      filterBy: filter,
      sortBy: {
        direction: sortDirection as SortDirection,
        field: sortField as MeasurementSortField,
      },
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
