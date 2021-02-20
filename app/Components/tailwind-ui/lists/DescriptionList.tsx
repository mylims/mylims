import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { SvgOutlinePaperClip } from '../svg/heroicon/outline';

interface DescriptionListProps {
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
        <p className="max-w-2xl mt-1 text-sm text-neutral-500">{subtitle}</p>
      </div>
      <div className="px-4 py-5 border-t border-neutral-200 sm:p-0">
        <dl className="sm:divide-y sm:divide-neutral-200">
          {attributes.map((attribute, idx) => (
            <div
              key={attribute.title}
              className={clsx(
                'py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6',
                stripes && idx % 2 === 0 ? 'bg-neutral-50' : '',
              )}
            >
              <dt className="text-sm font-semibold text-neutral-500">
                {attribute.title}
              </dt>
              <dd className="mt-1 text-sm text-neutral-900 sm:mt-0 sm:col-span-2">
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
    <ul className="border divide-y rounded-md border-neutral-200 divide-neutral-200">
      {props.attachments.map((attachment) => (
        <li
          key={attachment.filename}
          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
        >
          <div className="flex items-center flex-1 w-0">
            <SvgOutlinePaperClip className="flex-shrink-0 w-5 h-5 text-neutral-400" />
            <span className="flex-1 w-0 ml-2 truncate">
              {attachment.filename}
            </span>
          </div>
          <div className="flex-shrink-0 ml-4">
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
