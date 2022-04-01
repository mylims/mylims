import { DocumentTextIcon, DownloadIcon } from '@heroicons/react/outline';
import React from 'react';
import * as yup from 'yup';

import AutoSubmitForm from '@/components/AutoSubmitForm';
import { FileStatusLabel, getTagColor } from '@/components/FileStatusLabel';
import { DownloadButton, LinkButton } from '@/components/LinkButton';
import TableEmpty from '@/components/TableEmpty';
import TableHeader from '@/components/TableHeader';
import {
  Color,
  DatePickerField,
  Form,
  InputField,
  MultiSearchSelectField,
  SelectField,
  Spinner,
  Table,
  Td,
  useMultiSearchSelect,
} from '@/components/tailwind-ui';
import {
  FilesByConfigFlatQuery,
  FilesSortField,
  SyncFileRevision,
  FileStatus,
  SortDirection,
} from '@/generated/graphql';
import {
  useFilterFilesQuery,
  selectOrder,
  selectField,
} from '@/hooks/useFileQuery';
import filesizeParser from '@/utils/filesize-parser';
import { formatBytes, formatDate } from '@/utils/formatFields';

function isByteSize(value: string | null | undefined): boolean {
  if (!value) return true;

  try {
    filesizeParser(value);
    return true;
  } catch (error) {
    return false;
  }
}

interface TableFilesFilteredProps {
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
  minSize: yup
    .string()
    .nullable()
    .test('is-bytesize', 'Not a valid file size', isByteSize),
  maxSize: yup
    .string()
    .nullable()
    .test('is-bytesize', 'Not a valid file size', isByteSize)
    .test(
      'is-greater-than',
      'Should be greater than min size',
      (value, context) => {
        if (value && context.parent.minSize) {
          const maxSize = filesizeParser(value);
          const minSize = filesizeParser(context.parent.minSize);
          return maxSize >= minSize;
        } else {
          return true;
        }
      },
    ),
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
    .nullable(),
});

const selectOrderOptions = [
  { value: SortDirection.ASC, label: selectOrder[SortDirection.ASC] },
  { value: SortDirection.DESC, label: selectOrder[SortDirection.DESC] },
];
const selectFieldOptions = [
  {
    value: FilesSortField.CREATIONDATE,
    label: selectField[FilesSortField.CREATIONDATE],
  },
  { value: FilesSortField.DATE, label: selectField[FilesSortField.DATE] },
  {
    value: FilesSortField.FILENAME,
    label: selectField[FilesSortField.FILENAME],
  },
  {
    value: FilesSortField.MODIFICATIONDATE,
    label: selectField[FilesSortField.MODIFICATIONDATE],
  },
  { value: FilesSortField.SIZE, label: selectField[FilesSortField.SIZE] },
];

const titles = [
  { className: 'w-1/2', name: 'Relative path' },
  { className: 'w-1/12', name: 'Size' },
  { className: 'w-1/12', name: 'Update date' },
  { className: 'w-1/12', name: 'Status' },
  { className: 'w-1/12', name: 'Actions' },
];

export default function TableFilesFiltered({
  data,
  page,
  pageSize,
  loading,
}: TableFilesFilteredProps) {
  const { list = [], totalCount = 0 } = data?.filesByConfigFlat ?? {};

  const selectTags = useMultiSearchSelect({
    options: [
      { value: FileStatus.PENDING, label: FileStatus.PENDING },
      { value: FileStatus.IMPORTING, label: FileStatus.IMPORTING },
      { value: FileStatus.IMPORTED, label: FileStatus.IMPORTED },
      { value: FileStatus.IMPORT_FAIL, label: FileStatus.IMPORT_FAIL },
    ],
  });

  const [query, setQuery] = useFilterFilesQuery();
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
        <LinkButton to={'.'} color={Color.danger}>
          Remove filters
        </LinkButton>

        <div className="my-4 grid grid-cols-4 gap-4">
          <InputField
            className="col-span-2"
            name="filename"
            label="File name"
          />
          <div className="col-span-2">
            <MultiSearchSelectField
              {...selectTags}
              name="status"
              label="Status"
              clearable
              getBadgeColor={({ value }: TagsMultiSearch) => getTagColor(value)}
            />
          </div>
          <InputField name="minSize" label="Min size" />
          <InputField name="maxSize" label="Max size" />
          <DatePickerField name="minDate" label="Min date" />
          <DatePickerField name="maxDate" label="Max date" />
          <SelectField
            options={selectFieldOptions}
            name="sortField"
            label="Sort field"
          />
          <SelectField
            options={selectOrderOptions}
            name="sortDirection"
            label="Sort direction"
          />
          <AutoSubmitForm />
        </div>

        {loading && <Spinner className="h-10 w-10 text-danger-500" />}
        <Table
          tableClassName="table-fixed"
          Header={() => <TableHeader titles={titles} />}
          Empty={() => <TableEmpty titles={titles} />}
          Tr={Row}
          data={list}
          pagination={pagination}
        />
      </div>
    </Form>
  );
}

function Row({ value }: { value: File }) {
  return (
    <tr>
      <Td title={value.relativePath} className="flex items-center truncate">
        <DocumentTextIcon className="mr-1 h-5 w-5" />
        {value.relativePath}
      </Td>
      <Td>{formatBytes(value.size)}</Td>
      <Td>{formatDate(value.date)}</Td>
      <Td>
        <FileStatusLabel status={value.status} />
      </Td>
      <Td>
        <DownloadButton
          to={value.downloadUrl}
          color={Color.neutral}
          className="ml-2"
          title="Download"
        >
          <DownloadIcon className="h-3 w-3" />
        </DownloadButton>
      </Td>
    </tr>
  );
}
