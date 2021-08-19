import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import bytes from 'byte-size';
import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import AutoSubmitForm from '@components/AutoSubmitForm';
import { FileStatusLabel, getTagColor } from '@components/FileStatusLabel';
import {
  Button,
  Color,
  DatePickerField,
  Form,
  InputField,
  MultiSearchSelectField,
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
  FilesByConfigFlatQuery,
  SyncFileRevision,
} from '../../generated/graphql';

interface TableFilesFilteredProps {
  id: string;
  data?: FilesByConfigFlatQuery;
  page: number;
  pageSize: number;
  loading: boolean;
}
type File = Pick<
  SyncFileRevision,
  | 'id'
  | 'filename'
  | 'size'
  | 'relativePath'
  | 'status'
  | 'date'
  | 'downloadUrl'
>;
interface TagsMultiSearch {
  value: FileStatus;
  label: string;
}

const schema = yup.object().shape({
  minSize: yup.number().integer().nullable().min(0),
  maxSize: yup
    .number()
    .integer()
    .nullable()
    .min(0)
    .moreThan(yup.ref('minSize'), 'Should be greater than min size'),
  minDate: yup.date().nullable().min(new Date(0)).max(new Date()),
  maxDate: yup
    .date()
    .nullable()
    .min(yup.ref('minDate'), 'Should be greater than min date')
    .max(new Date()),
  status: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.string().required(),
        label: yup.string().required(),
      }),
    )
    .nullable()
    .min(1),
});

export default function TableFilesFiltered({
  id,
  data,
  page,
  pageSize,
  loading,
}: TableFilesFilteredProps) {
  const { files = [], totalCount = 0 } = data?.filesByConfigFlat ?? {};

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
    onPageChange: (newPage: number) =>
      setQuery({ ...query, page: newPage.toString() }),
  };

  return (
    <Form
      initialValues={query}
      validationSchema={schema}
      onSubmit={(values) => setQuery(values)}
    >
      <div>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <InputField name="minSize" label="Min size" type="number" />
          <InputField name="maxSize" label="Max size" type="number" />
          <DatePickerField name="minDate" label="Min date" />
          <DatePickerField name="maxDate" label="Max date" />
          <div className="col-span-2">
            <MultiSearchSelectField
              {...selectTags}
              name="status"
              label="Status"
              clearable
              getBadgeColor={({ value }: TagsMultiSearch) => getTagColor(value)}
            />
          </div>
          <Link to={id} className="self-end">
            <Button variant={Variant.secondary} color={Color.danger}>
              Remove filters
            </Button>
          </Link>
          <AutoSubmitForm />
        </div>

        {loading && <Spinner className="w-10 h-10 text-danger-500" />}
        <Table
          tableClassName="table-fixed"
          Header={Header}
          Empty={Empty}
          Tr={Row}
          data={files}
          pagination={pagination}
        />
      </div>
    </Form>
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
