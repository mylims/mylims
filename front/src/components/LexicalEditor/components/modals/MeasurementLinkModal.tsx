import {
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import React from 'react';

import { LinkIcon } from '@/components/LinkButton';
import {
  Badge,
  BadgeVariant,
  Color,
  Button,
  Variant,
  Roundness,
  Size,
} from '@/components/tailwind-ui';
import { useMeasurementQuery } from '@/generated/graphql';
import { MeasurementNotebook } from '@/pages/notebook/models';
import { formatDate } from '@/utils/formatFields';

import { useSampleLinkContext } from '../../hooks/useSampleLinkContext';

interface SampleLinkModalProps {
  appendMeasurement: (id: MeasurementNotebook) => void;
}
export function MeasurementLinkModal({
  appendMeasurement,
}: SampleLinkModalProps) {
  const { measurements } = useSampleLinkContext();
  return (
    <div className="min-w-1/4 m-2 min-h-[200px]">
      <div className="mb-2 flex flex-row flex-wrap gap-4">
        <div className="text-xl font-semibold">Measurements</div>
      </div>
      <div className="divide-y divide-neutral-300 rounded-md border border-neutral-300">
        {measurements.length > 0 ? (
          measurements.map((measurement) => (
            <MeasurementItem
              key={measurement.id}
              measurement={measurement}
              appendMeasurement={appendMeasurement}
            />
          ))
        ) : (
          <div className="flex items-center p-4 text-sm text-neutral-400">
            No elements
          </div>
        )}
      </div>
    </div>
  );
}

interface MeasurementItemProps {
  measurement: MeasurementNotebook;
  appendMeasurement: (id: MeasurementNotebook) => void;
}
function MeasurementItem({
  measurement,
  appendMeasurement,
}: MeasurementItemProps) {
  const { data, error, loading } = useMeasurementQuery({
    variables: measurement,
  });
  if (error) {
    return <div className="bg-danger-50 text-danger-700">{error.message}</div>;
  }
  if (loading) return <div>Loading...</div>;
  if (!data) return <div className="bg-danger-50 text-danger-700">No data</div>;

  const {
    measurement: {
      createdAt,
      sample: { sampleCode },
      file,
    },
  } = data;
  const title = file?.filename ?? sampleCode.join('_');
  return (
    <div className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
      <div className="flex flex-row gap-4">
        <div className="text-sm max-w-xs truncate" title={title}>
          {title}
        </div>
        <Badge
          variant={BadgeVariant.COLORED_BACKGROUND}
          label={measurement.type}
          color={Color.primary}
        />
        <div className="text-xs text-neutral-400">{formatDate(createdAt)}</div>
      </div>
      <div>
        <LinkIcon
          className="mx-4"
          to={`/measurement/detail/${measurement.type}/${measurement.id}`}
          title={`Detail of ${title}`}
        >
          <InformationCircleIcon className="h-5 w-5" />
        </LinkIcon>
        <Button
          color={Color.success}
          variant={Variant.secondary}
          roundness={Roundness.circular}
          size={Size.small}
          title="Add to notebook"
          onClick={() => appendMeasurement(measurement)}
        >
          <PlusCircleIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
