import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import bytes from 'byte-size';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { FileStatusLabel, getTagColor } from '@components/FileStatusLabel';
import InputDebounce from '@components/InputDebounce';
import {
  Button,
  Color,
  MultiSearchSelect,
  Roundness,
  Spinner,
  Table,
  Td,
  Th,
  useMultiSearchSelect,
  Variant,
} from '@components/tailwind-ui';
import { FileStatus } from '@generated/graphql';
import { useFilterQuery } from '@hooks/useQuery';

import {
  FilesByConfigFilteredQuery,
  SyncFileRevision,
} from '../../generated/graphql';

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
interface TagsMultiSearch {
  value: FileStatus;
  label: string;
}

export default function TableFilesFiltered({
  id,
  data,
  page,
  pageSize,
  loading,
}: TableFilesFilteredProps) {
  const { files = [], totalCount = 0 } = data?.filesByConfigFiltered ?? {};
  const tableData = useMemo(
    () => files.map((file) => ({ id: file.revisionId, ...file })),
    [files],
  );

  const selectTags = useMultiSearchSelect({
    options: [
      { value: FileStatus.PENDING, label: FileStatus.PENDING },
      { value: FileStatus.IMPORTING, label: FileStatus.IMPORTING },
      { value: FileStatus.IMPORTED, label: FileStatus.IMPORTED },
      { value: FileStatus.IMPORT_FAIL, label: FileStatus.IMPORT_FAIL },
    ],
  });

  const [query, setQuery] = useFilterQuery(id);
  const pagination = {
    page,
    itemsPerPage: pageSize,
    totalCount,
    onPageChange: (newPage: number) => setQuery('page', newPage.toString()),
  };

  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
  return (
    <div>
      <div className="flex items-end mb-2">
        <InputDebounce
          name="minSize"
          label="Min size"
          className="w-1/4 mr-2"
          type="number"
          value={query.minSize}
          onChange={(newValue) => setQuery('minSize', newValue)}
        />
        <InputDebounce
          name="maxSize"
          label="Max size"
          className="w-1/4 mr-2"
          type="number"
          value={query.maxSize}
          onChange={(newValue) => setQuery('maxSize', newValue)}
        />
        <InputDebounce
          name="minDate"
          label="Min date"
          className="w-1/4 mr-2"
          type="date"
          value={format(new Date(query.minDate), 'yyyy-MM-dd')}
          onChange={(value) =>
            setQuery('minDate', new Date(value).toISOString())
          }
        />
        <InputDebounce
          name="maxDate"
          label="Max date"
          className="w-1/4 mr-2"
          type="date"
          value={format(new Date(query.maxDate), 'yyyy-MM-dd')}
          onChange={(value) =>
            setQuery('maxDate', new Date(value).toISOString())
          }
        />
      </div>
      <div className="flex items-end mb-2">
        <MultiSearchSelect
          {...selectTags}
          label="Status"
          getBadgeColor={(option: TagsMultiSearch) => getTagColor(option.value)}
          selected={query.status.map((value) => ({ value, label: value }))}
          onSelect={(tags: TagsMultiSearch[]) =>
            setQuery(
              'status',
              tags.map(({ value }) => value).join(',') || FileStatus.IMPORTED,
            )
          }
        />
        <Link to={id}>
          <Button
            className="ml-2"
            variant={Variant.secondary}
            color={Color.danger}
          >
            Remove filters
          </Button>
        </Link>
      </div>

      <Table
        tableClassName="table-fixed"
        Header={Header}
        Empty={Empty}
        Tr={Row}
        data={tableData}
        pagination={pagination}
      />
    </div>
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
