import { PaperClipIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

export interface DescriptionListProps {
  title: ReactNode;
  subtitle?: ReactNode;
  stripes?: boolean;
  attributes: {
    title: string;
    details?: ReactNode;
  }[];
}

export function DescriptionList(props: DescriptionListProps) {
  const { title, subtitle, attributes, stripes } = props;
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-semibold leading-6 text-neutral-900">
          {title}
        </h3>
        <div className="mt-1 max-w-2xl text-sm text-neutral-500">
          {subtitle}
        </div>
      </div>
      <div className="border-t border-neutral-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-neutral-200">
          {attributes.map((attribute, idx) => (
            <div
              key={attribute.title}
              className={clsx(
                'py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6',
                stripes && idx % 2 === 0 ? 'bg-neutral-50' : '',
              )}
            >
              <dt className="text-sm font-semibold text-neutral-500">
                {attribute.title}
              </dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:col-span-2 sm:mt-0">
                {attribute.details}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

interface Attachment extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  filename: string;
}

interface DescriptionAttachmentListProps {
  attachments: Attachment[];
}

export function DescriptionAttachmentList(
  props: DescriptionAttachmentListProps,
) {
  return (
    <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
      {props.attachments.map((attachment) => (
        <li
          key={attachment.filename}
          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
        >
          <div className="flex w-0 flex-1 items-center">
            <PaperClipIcon className="h-5 w-5 shrink-0 text-neutral-400" />
            <span className="ml-2 w-0 flex-1 truncate">
              {attachment.filename}
            </span>
          </div>
          <div className="ml-4 shrink-0">
            <a
              {...attachment}
              className="font-semibold text-primary-600 hover:text-primary-500"
            >
              Download
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
