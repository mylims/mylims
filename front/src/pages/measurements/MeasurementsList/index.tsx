import React from 'react';
import { Link } from 'react-router-dom';

import { MeasurementPlot } from './MeasurementPlot';

import ElnLayout from '@/components/ElnLayout';
import { Table as TableQuery } from '@/components/TableQuery';
import { useTableQuery } from '@/components/TableQuery/hooks/useTableQuery';
import { Button, Color, Select, Variant } from '@/components/tailwind-ui';
import {
  MeasurementsFilteredQuery,
  MeasurementSortField,
  MeasurementTypes,
  SortDirection,
  useMeasurementsFilteredQuery,
} from '@/generated/graphql';
import MeasurementActions from '@/pages/measurements/MeasurementsList/MeasurementActions';

type MeasurementRowType =
  MeasurementsFilteredQuery['measurements']['list'][number];

const PAGE_SIZE = 10;

export default function MeasurementsList() {
  const { query, setQuery } = useTableQuery({
    page: '1',
    sortField: MeasurementSortField.CREATEDAT,
    sortDirection: SortDirection.DESC,
  });
  const { page, type, sortField, sortDirection, ...filter } = query;
  const measurementType = (query.type ??
    MeasurementTypes.TRANSFER) as MeasurementTypes;
  const pageNum = query.page !== null ? parseInt(query.page, 10) : 1;
  const { loading, error, data } = useMeasurementsFilteredQuery({
    variables: {
      type: measurementType,
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: filter,
      sortBy: {
        direction: sortDirection as SortDirection,
        field: sortField as MeasurementSortField,
      },
    },
  });

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <Select
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
        <Link to="/measurement/list" className="mt-auto">
          <Button variant={Variant.secondary} color={Color.danger}>
            Remove filters
          </Button>
        </Link>
      </div>
      <MeasurementPlot type={MeasurementTypes.TRANSFER}>
        <TableQuery
          data={data?.measurements}
          loading={loading}
          itemsPerPage={PAGE_SIZE}
          query={query}
          onQueryChange={(query) => setQuery(query)}
        >
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
