import React from 'react';

import MeasurementFormFilter from './MeasurementFormFilter';
import MeasurementRow from './MeasurementRow';

import ElnLayout from '@/components/ElnLayout';
import TableEmpty from '@/components/TableEmpty';
import TableHeader from '@/components/TableHeader';
import { Alert, AlertType, Spinner, Table } from '@/components/tailwind-ui';
import {
  MeasurementsFilteredQuery,
  MeasurementTypes,
  useMeasurementsFilteredQuery,
} from '@/generated/graphql';
import { useFilterMeasurementQuery } from '@/hooks/useMeasurementQuery';
import { formatDate } from '@/utils/formatFields';

type MeasurementRowType =
  MeasurementsFilteredQuery['measurements']['measurements'][number];

const PAGE_SIZE = 10;
const titles = [
  { className: 'w-2/12', name: 'Sample' },
  { className: 'w-2/12', name: 'Creation date' },
  { className: 'w-2/12', name: 'Owner' },
  { className: 'w-2/12', name: 'Creator' },
  { className: 'w-6/12', name: 'Actions' },
];

export default function MeasurementsList() {
  const [query, setQuery] = useFilterMeasurementQuery();
  const pageNum = query.page !== null ? parseInt(query.page, 10) : 1;
  const { loading, error, data } = useMeasurementsFilteredQuery({
    variables: {
      type: query.type?.value ?? MeasurementTypes.GENERAL,
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: {
        username: query.username,
        sampleCode: query.sampleCode ? query.sampleCode.split(',') : null,
      },
    },
  });

  const pagination = {
    page: pageNum,
    itemsPerPage: PAGE_SIZE,
    totalCount: data?.measurements.totalCount ?? 0,
    onPageChange: (newPage: number) =>
      setQuery({ ...query, page: newPage.toString() }),
  };

  return (
    <MeasurementFormFilter
      initialValues={query}
      onSubmit={(values) => setQuery(values)}
    >
      {error && (
        <Alert title={'Error'} type={AlertType.ERROR}>
          Unexpected error: {error.message}
        </Alert>
      )}

      {loading ? (
        <Spinner className="w-10 h-10 text-danger-500" />
      ) : (
        <Table
          tableClassName="table-fixed"
          Header={() => <TableHeader titles={titles} />}
          Empty={() => <TableEmpty titles={titles} />}
          Tr={Row}
          data={data?.measurements.measurements ?? []}
          pagination={pagination}
        />
      )}
    </MeasurementFormFilter>
  );
}

function Row({
  value: { createdAt, ...params },
}: {
  value: MeasurementRowType;
}) {
  return <MeasurementRow {...params} createdAt={formatDate(createdAt)} />;
}

MeasurementsList.getLayout = (page: React.ReactNode) => (
  <ElnLayout>{page}</ElnLayout>
);
