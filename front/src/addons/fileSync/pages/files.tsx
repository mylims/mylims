import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Alert, AlertType } from '@components/tailwind-ui';
import TableFilesSync from '../TableFilesSync';
import TableFilesFiltered from '../TableFilesFiltered';
import {
  useFilesByConfigQuery,
  useFilesByConfigFilteredQuery,
  FilesSortField,
  SortDirection,
  FileStatus,
} from '../generated/graphql';
import ElnLayout from '@components/ElnLayout';

interface RouterQuery {
  id: string;
  page?: string;
  minSize?: string;
  maxSize?: string;
  minDate?: string;
  maxDate?: string;
  status?: FileStatus;
  sortField?: FilesSortField;
  sortDirection?: SortDirection;
}

const PAGE_SIZE = 10;

export default function ListFiles() {
  const router = useHistory();
  const {
    id,
    page,
    minSize = '0',
    maxSize = '1000000000',
    minDate = new Date(0).toISOString(),
    maxDate = new Date().toISOString(),
    status = 'imported',
    sortField = FilesSortField.DATE,
    sortDirection = SortDirection.DESC,
  } = useParams<RouterQuery>();

  if (id === undefined) {
    void router.push('list');
    return null;
  }

  if (page) {
    return (
      <FilterTable
        id={id as string}
        page={page as string}
        minSize={minSize as string}
        maxSize={maxSize as string}
        minDate={minDate as string}
        maxDate={maxDate as string}
        status={status as FileStatus}
        sortField={sortField as FilesSortField}
        sortDirection={sortDirection as SortDirection}
      />
    );
  } else {
    return <NestedTable id={id as string} />;
  }
}

function NestedTable({ id }: Pick<RouterQuery, 'id'>) {
  const { data, loading, error } = useFilesByConfigQuery({
    variables: { id, path: [] },
  });

  if (error) {
    return (
      <Alert
        title="Error while fetching file sync option"
        type={AlertType.ERROR}
      >
        Unexpected error {error.message}
      </Alert>
    );
  }

  return <TableFilesSync loading={loading} data={data} id={id} />;
}

function FilterTable({
  id,
  page,
  sortField,
  sortDirection,
  minSize,
  maxSize,
  status,
  ...filters
}: Required<RouterQuery>) {
  const pageNum = parseInt(page, 10);
  const { data, loading, error } = useFilesByConfigFilteredQuery({
    variables: {
      id,
      skip: (pageNum - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
      filterBy: {
        minSize: parseInt(minSize, 10),
        maxSize: parseInt(maxSize, 10),
        status: [status],
        ...filters,
      },
      sortBy: { field: sortField, direction: sortDirection },
    },
  });

  if (error) {
    return (
      <Alert
        title="Error while fetching file sync option"
        type={AlertType.ERROR}
      >
        Unexpected error {error.message}
      </Alert>
    );
  }

  return (
    <TableFilesFiltered
      id={id}
      loading={loading}
      data={data}
      page={pageNum}
      pageSize={PAGE_SIZE}
    />
  );
}

FilterTable.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Table of filtered files">{page}</ElnLayout>
);
