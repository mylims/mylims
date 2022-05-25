import React from 'react';

import FieldDescription from '@/components/FieldDescription';
import { Alert, AlertType, Card } from '@/components/tailwind-ui';
import { MeasurementQuery } from '@/generated/graphql';
import { useFetchFile } from '@/hooks/useFetchFile';
import { formatDate } from '@/utils/formatFields';

import { MeasurementMap } from '../models/BaseMeasurement';

interface DetailBodyProps {
  measurement: MeasurementQuery['measurement'];
}
export default function DetailBody({ measurement }: DetailBodyProps) {
  const Measurement = MeasurementMap[measurement.type];
  const { data, error } = useFetchFile(
    measurement.fileId ?? null,
    measurement.file?.downloadUrl ?? null,
  );

  if (error) {
    return (
      <Card.Body>
        <Alert
          title="Error while fetching measurement plot"
          type={AlertType.ERROR}
        >
          Unexpected error: {error?.message}
        </Alert>
      </Card.Body>
    );
  }

  return (
    <Card.Body>
      <div className="flex flex-col lg:w-full lg:flex-row lg:gap-4">
        <div className="lg:w-1/2">
          <div className="grid-cols-auto mb-4 grid items-end gap-4">
            <FieldDescription title="Sample code">
              {measurement.sample.sampleCode.join('_')}
            </FieldDescription>
            <FieldDescription title="Owner's username">
              {measurement.user?.usernames[0]}
            </FieldDescription>
            <FieldDescription title="Creation date">
              {formatDate(measurement.createdAt)}
            </FieldDescription>
            {measurement.file && (
              <div>
                <div className="font-medium">File name</div>
                <div
                  className="truncate text-neutral-500"
                  title={measurement.file.filename}
                >
                  {measurement.file.filename}
                </div>
              </div>
            )}
            <FieldDescription title="Comment">
              {measurement.comment ?? '-'}
            </FieldDescription>
          </div>
        </div>
        <div className="flex flex-col-reverse items-end gap-2 lg:w-1/2">
          <Measurement.PlotDetail data={data} measurement={measurement} />
        </div>
      </div>
    </Card.Body>
  );
}
