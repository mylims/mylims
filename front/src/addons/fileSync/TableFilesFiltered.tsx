import React, { useMemo } from 'react';
import bytes from 'byte-size';
import { format } from 'date-fns';

import ElnLayout from '@components/ElnLayout';
import {
  Badge,
  BadgeVariant,
  Button,
  Color,
  Roundness,
  Table,
  Td,
  Th,
  Variant,
} from '@components/tailwind-ui';
import {
  FilesByConfigFilteredQuery,
  FileStatus,
  SyncFileRevision,
} from './generated/graphql';
import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import { useHistory } from 'react-router-dom';

interface TableFilesFilteredProps {
  id: string;
  data?: FilesByConfigFilteredQuery;
  page: number;
  pageSize: number;
  loading: boolean;
}
type File = Pick<
  SyncFileRevision,
  | 'revisionId'
  | 'filename'
  | 'size'
  | 'relativePath'
  | 'status'
  | 'date'
  | 'downloadUrl'
> & { id: string };
export default function TableFilesFiltered({
  id,
  data,
  page,
  pageSize,
  loading,
}: TableFilesFilteredProps) {
  const router = useHistory();
  const { files = [], totalCount = 0 } = data?.filesByConfigFiltered ?? {};
  const tableData = useMemo(
    () => files.map((file) => ({ id: file.revisionId, ...file })),
    [files],
  );
  const pagination = {
    page,
    itemsPerPage: pageSize,
    totalCount,
    onPageChange: (newPage: number) => router.push(`${id}?page=${newPage}`),
  };
  return (
    <Table
      tableClassName="table-fixed"
      Header={Header}
      Empty={Empty}
      Tr={Row}
      data={tableData}
      pagination={pagination}
    />
  );
}

function Header() {
  return (
    <tr>
      <Th className="w-1/2">Relative path</Th>
      <Th className="w-1/12">Size</Th>
      <Th className="w-1/12">Update date</Th>
      <Th className="w-1/12">Status</Th>
      <Th className="w-1/12">Actions</Th>
    </tr>
  );
}
function Empty() {
  return (
    <>
      <Header />
      <tr>
        <Td colSpan={4} align="center">
          <div className="flex flex-row justify-center text-neutral-500">
            <span>Empty</span>
          </div>
        </Td>
      </tr>
    </>
  );
}
function Row({ value }: { value: File }) {
  const size = bytes(value.size).toString();
  return (
    <tr>
      <Td title={value.relativePath} className="flex items-center truncate">
        <DocumentTextIcon className="w-5 h-5 mr-1" />
        {value.relativePath}
      </Td>
      <Td>{size}</Td>
      <Td>{format(new Date(value.date), 'dd.MM.yyyy')}</Td>
      <Td>
        <FileStatusLabel status={value.status} />
      </Td>
      <Td>
        <a href={value.downloadUrl} target="_blank" rel="noreferrer">
          <Button
            color={Color.neutral}
            roundness={Roundness.circular}
            variant={Variant.secondary}
            className="ml-2"
            title="Download"
          >
            <DownloadIcon className="w-3 h-3" />
          </Button>
        </a>
      </Td>
    </tr>
  );
}

function FileStatusLabel({ status }: { status: FileStatus }) {
  let color: Color;
  switch (status) {
    case 'imported': {
      color = Color.primary;
      break;
    }
    case 'import_fail': {
      color = Color.danger;
      break;
    }
    default: {
      color = Color.warning;
      break;
    }
  }
  return (
    <Badge
      variant={BadgeVariant.COLORED_BACKGROUND}
      label={status}
      color={color}
    />
  );
}

TableFilesFiltered.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Table of synchronized files">{page}</ElnLayout>
);
