import { PaperClipIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { SampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

interface AttachmentsTableProps {
  attachments: SampleQuery['sample']['attachments'];
  className?: string;
}
export default function AttachmentsTable({
  attachments,
  className,
}: AttachmentsTableProps) {
  const files = useMemo(
    () => attachments.filter(({ collection }) => !collection),
    [attachments],
  );
  return (
    <ul
      role="list"
      className={clsx(
        'divide-y divide-neutral-300 rounded-md border border-neutral-300',
        className,
      )}
    >
      {files.length === 0 && (
        <li className="flex items-center p-4 text-sm text-neutral-400">
          No files attached
        </li>
      )}
      {files.map(({ filename, id, date, downloadUrl }) => {
        return (
          <li
            key={id}
            className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
          >
            <div className="flex w-0 flex-1 items-center" title={filename}>
              <PaperClipIcon
                className="h-5 w-5 flex-shrink-0 text-neutral-400"
                aria-hidden="true"
              />
              <span className="ml-2 w-0 flex-1 truncate">{filename}</span>
            </div>
            <div>{formatDate(date)}</div>
            <div className="ml-4 flex-shrink-0">
              <a
                href={downloadUrl}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Download
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
