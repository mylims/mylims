import { PaperClipIcon } from '@heroicons/react/outline';
import React from 'react';

import { SampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

interface AttachmentsTableProps {
  attachments: SampleQuery['sample']['attachments'];
}
export default function AttachmentsTable({
  attachments,
}: AttachmentsTableProps) {
  return (
    <ul
      role="list"
      className="border divide-y rounded-md divide-neutral-300 border-neutral-300"
    >
      {attachments.length === 0 && (
        <li className="flex items-center p-4 text-sm text-neutral-400">
          No files attached
        </li>
      )}
      {attachments.map(({ filename, id, date, downloadUrl }) => (
        <li
          key={id}
          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
        >
          <div className="flex items-center flex-1 w-0" title={filename}>
            <PaperClipIcon
              className="flex-shrink-0 w-5 h-5 text-neutral-400"
              aria-hidden="true"
            />
            <span className="flex-1 w-0 ml-2 truncate">{filename}</span>
          </div>
          <div>{formatDate(date)}</div>
          <div className="flex-shrink-0 ml-4">
            <a
              href={downloadUrl}
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Download
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
