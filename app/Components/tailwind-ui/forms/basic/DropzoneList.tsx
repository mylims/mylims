import { XIcon } from '@heroicons/react/outline';
import bytesize from 'byte-size';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

interface DropzoneListFile {
  id: string;
  file: File;
  delete: () => void;
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
    <div
      className="mt-1 grid rounded-md border-b border-neutral-300 shadow"
      style={{ gridTemplateColumns: 'minmax(0, 1fr) auto auto' }}
    >
      {data.map((row, index) => (
        <DropzoneListRow
          key={row.id}
          value={row}
          isLast={index === data.length - 1}
        />
      ))}
    </div>
  );
}

interface DropzoneListRowProps {
  value: DropzoneListFile;
  isLast: boolean;
}

function DropzoneListRow({ value, isLast }: DropzoneListRowProps) {
  return (
    <>
      <DropzoneListCell className="px-2" isLast={isLast}>
        <span className="truncate">{value.file.name}</span>
      </DropzoneListCell>

      <DropzoneListCell
        className="truncate px-6 text-sm font-semibold text-neutral-900"
        isLast={isLast}
      >
        {String(bytesize(value.file.size))}
      </DropzoneListCell>

      <DropzoneListCell
        className="px-2 text-right text-sm font-semibold text-neutral-900"
        isLast={isLast}
      >
        <button
          type="button"
          onClick={value.delete}
          className="inline-flex rounded-md p-1.5 text-primary-500 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-600 active:bg-primary-200"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </DropzoneListCell>
    </>
  );
}

function DropzoneListCell({
  className,
  children,
  isLast,
}: {
  className: string;
  children: ReactNode;
  isLast: boolean;
}) {
  return (
    <div
      className={clsx(
        !isLast && 'border-b border-dashed border-neutral-300',
        'flex items-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
