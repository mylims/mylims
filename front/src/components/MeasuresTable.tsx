import { DownloadIcon, InformationCircleIcon } from '@heroicons/react/outline';
import React, { useMemo } from 'react';

import { DownloadButton, LinkIcon } from '@/components/LinkButton';
import { Color } from '@/components/tailwind-ui';
import { SampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

type Measurement = SampleQuery['sample']['measurements'][number];
interface MeasuresTableProps {
  measurements: Measurement[];
}
export default function MeasuresTable({ measurements }: MeasuresTableProps) {
  const splitMeasurements = useMemo(() => {
    let split: Record<string, Omit<Measurement, 'type'>[]> = {};
    for (const { type, ...measurement } of measurements) {
      split[type] = split[type] ? [...split[type], measurement] : [measurement];
    }
    return split;
  }, [measurements]);

  if (measurements.length === 0) {
    return (
      <div className="flex items-center p-4 text-sm text-neutral-400">
        No measurements
      </div>
    );
  }
  return (
    <>
      {Object.entries(splitMeasurements).map(([type, measurements]) => (
        <MeasurementTypeTable
          key={type}
          type={type}
          measurements={measurements}
        />
      ))}
    </>
  );
}

interface MeasurementTypeTableProps {
  type: string;
  measurements: Omit<Measurement, 'type'>[];
}
function MeasurementTypeTable({
  type,
  measurements,
}: MeasurementTypeTableProps) {
  return (
    <div className="mt-2">
      <div className="text-base font-semibold uppercase text-neutral-500">
        {type}
      </div>
      <ul
        role="list"
        className="divide-y divide-neutral-300 rounded-md border border-neutral-300"
      >
        {measurements.map(({ id, createdAt, file, title }) => {
          const header = title || (file && file.filename) || id;
          return (
            <li
              key={id}
              className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
            >
              <span className="w-1/2 truncate" title={header}>
                {header}
              </span>
              <div className="flex items-center gap-4">
                <span>{formatDate(createdAt)}</span>
                {file ? (
                  <DownloadButton
                    to={file.downloadUrl}
                    color={Color.neutral}
                    title="Download"
                  >
                    <DownloadIcon className="h-5 w-5" />
                  </DownloadButton>
                ) : null}
                <LinkIcon
                  to={`/measurement/detail/${type}/${id}`}
                  title="Measurement detail"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                </LinkIcon>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
