import {
  InformationCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline';
import React from 'react';

import { LinkIcon } from '@/components/LinkButton';
import {
  Badge,
  BadgeVariant,
  Button,
  Color,
  Roundness,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import { useSampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

import SampleSearch from './SampleSearch';

interface SamplesTableProps {
  samples: string[];
  addSample(sample: string): void;
  appendToNotebook(sample: string): void;
}
export function SamplesTable({
  samples,
  addSample,
  appendToNotebook,
}: SamplesTableProps) {
  return (
    <div>
      <div className="mt-4 mb-2 flex flex-row flex-wrap gap-4">
        <div className="text-xl font-semibold">Inventory</div>
        <SampleSearch addSample={(val) => addSample(val)} />
      </div>
      <div className="divide-y divide-neutral-300 rounded-md border border-neutral-300">
        {samples.length > 0 ? (
          samples.map((sample) => (
            <SampleItem
              key={sample}
              sample={sample}
              appendToNotebook={(val) => appendToNotebook(val)}
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

interface SampleItemProps {
  sample: string;
  appendToNotebook(sample: string): void;
}
function SampleItem({ sample, appendToNotebook }: SampleItemProps) {
  const { data, error, loading } = useSampleQuery({
    variables: { id: sample },
  });
  if (error) {
    return <div className="bg-danger-50 text-danger-700">{error.message}</div>;
  }
  if (loading) return <div>Loading...</div>;
  if (!data) return <div className="bg-danger-50 text-danger-700">No data</div>;

  const {
    sample: {
      sampleCode,
      createdAt,
      kind: { id: kind },
    },
  } = data;
  const code = sampleCode.join('_');
  return (
    <div
      className="flex cursor-move items-center justify-between py-3 pl-3 pr-4 text-sm"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', code);
      }}
    >
      <div className="flex flex-row gap-4">
        <div className="text-sm">{code}</div>
        <Badge
          variant={BadgeVariant.COLORED_BACKGROUND}
          label={kind}
          color={Color.primary}
        />
        <div className="text-xs text-neutral-400">{formatDate(createdAt)}</div>
      </div>
      <div>
        <LinkIcon
          className="mr-2"
          to={`/sample/detail/${kind}/${sample}`}
          title={`Detail of ${code}`}
        >
          <InformationCircleIcon className="h-5 w-5" />
        </LinkIcon>
        <Button
          color={Color.success}
          variant={Variant.secondary}
          roundness={Roundness.circular}
          size={Size.small}
          title="Add to notebook"
          onClick={() => appendToNotebook(code)}
        >
          <PlusCircleIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
