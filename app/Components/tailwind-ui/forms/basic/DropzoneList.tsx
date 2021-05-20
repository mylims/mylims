import { XIcon } from '@heroicons/react/outline';
import bytesize from 'byte-size';
import clsx from 'clsx';
import React from 'react';

import { Table, TdProps } from '../../lists/Table';

interface DropzoneListFile {
  id: string;
  file: File;
  delete: () => void;
}

interface DropzoneListRowProps {
  value: DropzoneListFile;
}

export interface DropzoneListProps {
  files?: File[] | undefined;
  onRemove: (file: File) => void;
}

export function DropzoneList({
  files,
  onRemove,
}: DropzoneListProps): JSX.Element | null {
  if (files === undefined || files.length === 0) {
    return null;
  }

  const data: DropzoneListFile[] = files.map((value) => {
    return {
      id: value.name,
      file: value,
      delete: () => onRemove(value),
    };
  });

  return (
    <div className="w-full mt-1">
      <Table data={data} Tr={DropzonListRow} />
    </div>
  );
}

function DropzonListRow({ value: props }: DropzoneListRowProps) {
  return (
    <tr
      className={clsx(
        'w-full min-w-full bg-transparent shadow-none border-neutral-300 border-dashed rounded-md',
      )}
    >
      <DropzoneTd style={{ maxWidth: 300 }} className="px-2 truncate">
        {props.file.name}
      </DropzoneTd>

      <DropzoneTd>{String(bytesize(props.file.size))}</DropzoneTd>

      <DropzoneTd className="px-2 my-2 text-sm font-semibold text-right whitespace-nowrap text-neutral-900">
        <button
          type="button"
          onClick={props.delete}
          className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 text-primary-500 hover:bg-primary-100 active:bg-primary-200 focus:ring-primary-600"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </DropzoneTd>
    </tr>
  );
}

function DropzoneTd(props: TdProps) {
  return (
    <td
      className="px-6 text-sm font-semibold whitespace-nowrap text-neutral-900"
      {...props}
    />
  );
}
