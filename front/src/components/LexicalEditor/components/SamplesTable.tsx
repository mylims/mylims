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

import { useSampleLinkContext } from '../hooks/useSampleLinkContext';

import SampleSearch from './SampleSearch';

interface SamplesTableProps {
  appendSample: (id: string) => void;
}
export function SamplesTable({ appendSample }: SamplesTableProps) {
  const { samples } = useSampleLinkContext();
  return (
    <div>
      <div className="mb-2 flex flex-row flex-wrap gap-4">
        <div className="text-xl font-semibold">Inventory</div>
        <SampleSearch />
      </div>
      <div className="divide-y divide-neutral-300 rounded-md border border-neutral-300">
        {samples.length > 0 ? (
          samples.map((sample) => (
            <SampleItem
              key={sample}
              sample={sample}
              appendSample={appendSample}
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
  appendSample: (id: string) => void;
}
function SampleItem({ sample, appendSample }: SampleItemProps) {
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
    <div className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
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
          className="mx-4"
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
          onClick={() => appendSample(code)}
        >
          <PlusCircleIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
